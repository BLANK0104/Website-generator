// Code Generator - Generates complete website code (Frontend + Backend + Database)
const componentLibrary = require('./componentLibrary');

class CodeGenerator {
  constructor() {
    this.componentLibrary = componentLibrary;
  }

  // Main function to generate complete website
  generateWebsite(specifications) {
    const { websiteType, pages, components, features, backend, siteName } = specifications;

    const generatedCode = {
      frontend: this.generateFrontend(specifications),
      backend: this.generateBackend(specifications),
      database: this.generateDatabaseSchema(specifications)
    };

    return generatedCode;
  }

  // Generate Frontend Code (HTML + CSS + JS)
  generateFrontend(specs) {
    const { pages, siteName, components } = specs;
    const frontendCode = {};

    pages.forEach(page => {
      const pageComponents = this.selectComponentsForPage(page, components);
      frontendCode[page.name] = this.generatePage(page, pageComponents, siteName);
    });

    return frontendCode;
  }

  // Generate individual page
  generatePage(page, components, siteName) {
    let html = this.generateHTMLStructure(page, siteName);
    let css = this.componentLibrary.global.css + '\n' + this.componentLibrary.buttons.css;
    let js = '';

    // Add components to page
    components.forEach(comp => {
      if (comp.html) html += comp.html;
      if (comp.css) css += '\n' + comp.css;
      if (comp.js) js += '\n' + comp.js;
    });

    // Close HTML structure
    html += `
      </body>
      </html>
    `;

    return { html, css, js };
  }

  // Generate HTML structure
  generateHTMLStructure(page, siteName) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title || siteName}</title>
  <link rel="stylesheet" href="/css/${page.name}.css">
</head>
<body>
`;
  }

  // Select appropriate components for page
  selectComponentsForPage(page, requestedComponents) {
    const components = [];

    requestedComponents.forEach(compName => {
      switch (compName) {
        case 'navbar':
          components.push(this.renderComponent('navbar', 'modern', page.navData));
          break;
        case 'hero':
          components.push(this.renderComponent('hero', page.heroStyle || 'centered', page.heroData));
          break;
        case 'features':
        case 'services':
          components.push(this.renderComponent('features', 'grid', page.featuresData));
          break;
        case 'gallery':
          components.push(this.renderComponent('gallery', 'grid', page.galleryData));
          break;
        case 'contact':
          components.push(this.renderComponent('contactForm', 'standard', page.contactData));
          break;
        case 'footer':
          components.push(this.renderComponent('footer', 'standard', page.footerData));
          break;
      }
    });

    return components;
  }

  // Render component with data
  renderComponent(type, variant, data) {
    const component = this.componentLibrary[type]?.[variant];
    if (!component) return { html: '', css: '', js: '' };

    return {
      html: this.replaceTemplateVars(component.html, data),
      css: component.css,
      js: component.js || ''
    };
  }

  // Simple template variable replacement (Mustache-like)
  replaceTemplateVars(template, data) {
    if (!data) return template;

    let result = template;

    // Replace simple variables {{variable}}
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, data[key] || '');
    });

    // Handle arrays {{#array}}...{{/array}}
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        const arrayRegex = new RegExp(`{{#${key}}}([\\s\\S]*?){{/${key}}}`, 'g');
        result = result.replace(arrayRegex, (match, template) => {
          return data[key].map(item => {
            let itemHtml = template;
            Object.keys(item).forEach(itemKey => {
              const itemRegex = new RegExp(`{{${itemKey}}}`, 'g');
              itemHtml = itemHtml.replace(itemRegex, item[itemKey] || '');
            });
            return itemHtml;
          }).join('');
        });
      }
    });

    return result;
  }

  // Generate Backend Code
  generateBackend(specs) {
    const { features, backend, siteName } = specs;
    
    const backendCode = {
      server: this.generateServerCode(siteName),
      routes: {},
      models: {},
      package: this.generatePackageJson(siteName)
    };

    // Generate routes and models based on features
    if (backend?.contactForm) {
      backendCode.routes.contact = this.componentLibrary.contactForm.standard.backend.route;
      backendCode.models.Contact = this.componentLibrary.contactForm.standard.backend.model;
    }

    if (backend?.authentication) {
      backendCode.routes.auth = this.generateAuthRoutes();
      backendCode.models.User = this.generateUserModel();
    }

    if (backend?.admin) {
      backendCode.routes.admin = this.generateAdminRoutes();
    }

    return backendCode;
  }

  // Generate main server code
  generateServerCode(siteName) {
    return `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${siteName.replace(/\s+/g, '_').toLowerCase()}', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

// Routes
const contactRouter = require('./routes/contact');
app.use('/api', contactRouter);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'public', \`\${page}.html\`), (err) => {
    if (err) {
      res.status(404).send('Page not found');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  }

  // Generate auth routes
  generateAuthRoutes() {
    return `const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();
    
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
`;
  }

  // Generate user model
  generateUserModel() {
    return `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
`;
  }

  // Generate admin routes
  generateAdminRoutes() {
    return `const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Middleware to check admin
const isAdmin = (req, res, next) => {
  // Add your admin authentication logic here
  next();
};

// Get all contact submissions
router.get('/contacts', isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Delete contact submission
router.delete('/contacts/:id', isAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
`;
  }

  // Generate database schema
  generateDatabaseSchema(specs) {
    const schemas = [];

    if (specs.backend?.contactForm) {
      schemas.push({
        name: 'Contact',
        fields: ['name', 'email', 'subject', 'message', 'submittedAt']
      });
    }

    if (specs.backend?.authentication) {
      schemas.push({
        name: 'User',
        fields: ['email', 'password', 'name', 'role', 'createdAt']
      });
    }

    return schemas;
  }

  // Generate package.json
  generatePackageJson(siteName) {
    return {
      name: siteName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: `Generated website - ${siteName}`,
      main: 'server.js',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js'
      },
      dependencies: {
        express: '^4.18.2',
        mongoose: '^7.0.0',
        cors: '^2.8.5',
        dotenv: '^16.0.3',
        bcryptjs: '^2.4.3',
        jsonwebtoken: '^9.0.0'
      },
      devDependencies: {
        nodemon: '^2.0.22'
      }
    };
  }

  // Generate .env template
  generateEnvTemplate(siteName) {
    return `PORT=3000
MONGODB_URI=mongodb://localhost:27017/${siteName.replace(/\s+/g, '_').toLowerCase()}
JWT_SECRET=your_jwt_secret_here
`;
  }

  // Generate README
  generateReadme(siteName, specs) {
    return `# ${siteName}

## Generated Website

This website was automatically generated with the following features:
${specs.features?.map(f => `- ${f}`).join('\n') || ''}

## Setup Instructions

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure environment variables:
   - Copy \`.env.example\` to \`.env\`
   - Update MongoDB URI and other settings

3. Start the server:
\`\`\`bash
npm start
\`\`\`

4. Open your browser:
   - Navigate to \`http://localhost:3000\`

## Pages
${specs.pages?.map(p => `- ${p.name}: ${p.title}`).join('\n') || ''}

## Backend Features
${specs.backend ? Object.keys(specs.backend).map(k => `- ${k}`).join('\n') : 'No backend features'}

## Technology Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
`;
  }
}

module.exports = new CodeGenerator();
