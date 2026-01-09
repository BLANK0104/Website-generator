// Enhanced AI Service for NLP interpretation and website code generation
const Groq = require('groq-sdk');
const codeGenerator = require('./codeGenerator');

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  // Main function: Interpret natural language and generate complete website
  async interpretAndGenerate(userInput) {
    try {
      // Step 1: Extract specifications from natural language
      const specifications = await this.extractSpecifications(userInput);
      
      // Step 2: Enrich specifications with AI-generated content
      const enrichedSpecs = await this.enrichSpecifications(specifications);
      
      // Step 3: Generate complete website code
      const websiteCode = codeGenerator.generateWebsite(enrichedSpecs);
      
      // Step 4: Generate file structure
      const fileStructure = this.generateFileStructure(websiteCode, enrichedSpecs);
      
      return {
        specifications: enrichedSpecs,
        code: websiteCode,
        files: fileStructure,
        summary: this.generateSummary(enrichedSpecs)
      };
    } catch (error) {
      console.error('Error in interpretAndGenerate:', error);
      throw error;
    }
  }

  // Extract website specifications from natural language
  async extractSpecifications(userInput) {
    const prompt = `Analyze this website request and extract structured specifications in JSON format:

User Request: "${userInput}"

Extract and return ONLY a valid JSON object with this structure:
{
  "websiteType": "type of website (e.g., portfolio, business, blog, ecommerce)",
  "siteName": "suggested website name",
  "industry": "industry or field",
  "pages": [
    {
      "name": "page identifier (e.g., index, about, services, gallery, contact)",
      "title": "page title",
      "description": "what this page should contain"
    }
  ],
  "components": ["list of required components like navbar, hero, features, gallery, contact, footer"],
  "features": ["list of features like responsive design, contact form, image gallery"],
  "backend": {
    "contactForm": true/false,
    "authentication": true/false,
    "admin": true/false,
    "database": true/false
  },
  "designStyle": "modern/minimalist/corporate/creative",
  "colorScheme": "suggested colors"
}

Rules:
- All pages must include navbar and footer components
- Business websites should have contact forms
- Portfolio websites should have gallery
- Include at least 3-5 pages
- Always include index, about, and contact pages`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const specs = JSON.parse(completion.choices[0].message.content);
      return specs;
    } catch (error) {
      console.error('Error extracting specifications:', error);
      return this.getDefaultSpecifications(userInput);
    }
  }

  // Enrich specifications with AI-generated content
  async enrichSpecifications(specs) {
    const enrichedSpecs = { ...specs };

    // Generate content for each page
    for (let page of enrichedSpecs.pages) {
      page.heroData = await this.generateHeroContent(page, specs);
      
      if (specs.components.includes('features') || specs.components.includes('services')) {
        page.featuresData = await this.generateFeaturesContent(page, specs);
      }
      
      page.navData = this.generateNavData(enrichedSpecs);
      page.footerData = this.generateFooterData(enrichedSpecs);
      
      if (page.name === 'index') {
        page.heroStyle = 'centered';
      } else {
        page.heroStyle = 'withImage';
      }

      if (page.name === 'contact') {
        page.contactData = this.generateContactData(specs);
      }

      if (page.description?.includes('gallery') || page.name === 'gallery') {
        page.galleryData = this.generateGalleryData(specs);
      }
    }

    return enrichedSpecs;
  }

  // Generate hero section content
  async generateHeroContent(page, specs) {
    const prompt = `Create compelling hero section content for a ${page.title} page of a ${specs.websiteType} website in ${specs.industry}.

Return JSON with:
{
  "title": "catchy main headline (5-8 words)",
  "subtitle": "engaging subtitle (10-15 words)",
  "buttons": [
    {"text": "button text", "href": "#contact or #features or page link", "style": "primary or secondary"}
  ],
  "imageUrl": "https://via.placeholder.com/800x600",
  "imageAlt": "description"
}`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating hero content:', error);
      return {
        title: page.title,
        subtitle: `Welcome to ${specs.siteName}`,
        buttons: [
          { text: 'Get Started', href: '#contact', style: 'primary' },
          { text: 'Learn More', href: '#features', style: 'secondary' }
        ]
      };
    }
  }

  // Generate features/services content
  async generateFeaturesContent(page, specs) {
    if (!page.description?.includes('service') && 
        !page.description?.includes('feature') && 
        page.name !== 'index' && 
        page.name !== 'services') {
      return null;
    }

    const prompt = `Create 4-6 feature/service items for a ${specs.websiteType} website in ${specs.industry}.

Return JSON with:
{
  "title": "Section title (e.g., Our Services, What We Offer)",
  "subtitle": "Section description (1 sentence)",
  "items": [
    {
      "icon": "emoji icon",
      "title": "Feature/Service name",
      "description": "Brief description (20-30 words)"
    }
  ]
}

Make it professional and relevant to ${specs.industry}.`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating features content:', error);
      return {
        title: 'Our Services',
        subtitle: 'What we offer to our clients',
        items: [
          { icon: '🎯', title: 'Service 1', description: 'Professional service description goes here with details about what we offer.' },
          { icon: '💎', title: 'Service 2', description: 'High-quality service that meets your needs and exceeds expectations.' },
          { icon: '🚀', title: 'Service 3', description: 'Fast and reliable service delivery with attention to detail and quality.' }
        ]
      };
    }
  }

  // Generate navigation data
  generateNavData(specs) {
    return {
      siteName: specs.siteName,
      navLinks: specs.pages.map(page => ({
        text: page.title,
        href: page.name === 'index' ? '/' : `/${page.name}`
      }))
    };
  }

  // Generate footer data
  generateFooterData(specs) {
    return {
      siteName: specs.siteName,
      description: `${specs.siteName} - Your trusted partner in ${specs.industry}`,
      links: specs.pages.map(page => ({
        text: page.title,
        href: page.name === 'index' ? '/' : `/${page.name}`
      })),
      contact: {
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567'
      },
      year: new Date().getFullYear()
    };
  }

  // Generate contact form data
  generateContactData(specs) {
    return {
      title: 'Get In Touch',
      subtitle: `Have questions? Send us a message and we'll respond as soon as possible.`
    };
  }

  // Generate gallery data
  generateGalleryData(specs) {
    const imageCount = 6;
    const images = [];
    
    for (let i = 1; i <= imageCount; i++) {
      images.push({
        url: `https://via.placeholder.com/400x300?text=Gallery+Image+${i}`,
        alt: `Gallery image ${i}`,
        caption: `${specs.industry} showcase ${i}`
      });
    }

    return {
      title: 'Our Gallery',
      images
    };
  }

  // Generate file structure for the website
  generateFileStructure(code, specs) {
    const files = [];

    // Frontend files
    Object.keys(code.frontend).forEach(pageName => {
      const page = code.frontend[pageName];
      
      files.push({
        path: `public/${pageName}.html`,
        content: page.html
      });
      
      files.push({
        path: `public/css/${pageName}.css`,
        content: page.css
      });
      
      if (page.js) {
        files.push({
          path: `public/js/${pageName}.js`,
          content: page.js
        });
      }
    });

    // Backend files
    files.push({
      path: 'server.js',
      content: code.backend.server
    });

    Object.keys(code.backend.routes).forEach(routeName => {
      files.push({
        path: `routes/${routeName}.js`,
        content: code.backend.routes[routeName]
      });
    });

    Object.keys(code.backend.models).forEach(modelName => {
      files.push({
        path: `models/${modelName}.js`,
        content: code.backend.models[modelName]
      });
    });

    files.push({
      path: 'package.json',
      content: JSON.stringify(code.backend.package, null, 2)
    });

    files.push({
      path: '.env.example',
      content: codeGenerator.generateEnvTemplate(specs.siteName)
    });

    files.push({
      path: 'README.md',
      content: codeGenerator.generateReadme(specs.siteName, specs)
    });

    return files;
  }

  // Generate summary of the website
  generateSummary(specs) {
    return {
      siteName: specs.siteName,
      type: specs.websiteType,
      pageCount: specs.pages.length,
      pages: specs.pages.map(p => p.title),
      features: specs.features,
      hasBackend: specs.backend?.contactForm || specs.backend?.authentication,
      hasForms: specs.backend?.contactForm,
      hasAuth: specs.backend?.authentication,
      hasAdmin: specs.backend?.admin,
      components: specs.components
    };
  }

  // Default specifications if AI parsing fails
  getDefaultSpecifications(userInput) {
    const keywords = userInput.toLowerCase();
    
    const isPortfolio = keywords.includes('portfolio') || keywords.includes('photographer');
    const isBusiness = keywords.includes('business') || keywords.includes('company');
    
    return {
      websiteType: isPortfolio ? 'portfolio' : isBusiness ? 'business' : 'general',
      siteName: 'My Website',
      industry: 'General',
      pages: [
        { name: 'index', title: 'Home', description: 'Homepage with hero and features' },
        { name: 'about', title: 'About', description: 'About us page' },
        { name: 'services', title: 'Services', description: 'Services we offer' },
        { name: 'contact', title: 'Contact', description: 'Contact form page' }
      ],
      components: ['navbar', 'hero', 'features', 'contact', 'footer'],
      features: ['Responsive Design', 'Contact Form', 'Modern UI', 'Working Backend'],
      backend: {
        contactForm: true,
        authentication: false,
        admin: false,
        database: true
      },
      designStyle: 'modern',
      colorScheme: 'blue and white'
    };
  }
}

module.exports = new AIService();
