# Project Architecture - AI Website Generator

## System Overview

This is a **complete AI-powered website generator** that transforms natural language input into fully functional, production-ready websites with frontend, backend, and database components.

## Core Architecture

### 1. AI Service Layer (`aiService.js`)
**Purpose**: Natural language processing and requirement interpretation

**Key Functions:**
- `interpretAndGenerate(userInput)` - Main entry point
- `extractSpecifications(userInput)` - Extracts structured requirements from natural language
- `enrichSpecifications(specs)` - Generates AI content for pages
- `generateHeroContent()` - Creates hero section content
- `generateFeaturesContent()` - Creates features/services content

**Technology**: Groq AI with Llama 3.3 70B model

**Input Example:**
```
"Create a portfolio website for a photographer with gallery and contact form"
```

**Output:**
```json
{
  "websiteType": "portfolio",
  "siteName": "Photography Portfolio",
  "pages": [...],
  "components": ["navbar", "hero", "gallery", "contact", "footer"],
  "backend": { "contactForm": true, "database": true }
}
```

### 2. Component Library (`componentLibrary.js`)
**Purpose**: Reusable UI components with HTML, CSS, and JavaScript

**Components Included:**
- **Navigation**: Responsive navbar with mobile menu
- **Hero Sections**: Centered and image-based layouts
- **Features Grid**: Card-based service/feature displays
- **Contact Forms**: Full working forms with backend integration
- **Galleries**: Responsive image grids
- **Footers**: Multi-column layouts

**Structure:**
```javascript
componentLibrary = {
  navbar: {
    modern: {
      html: "...",
      css: "...",
      js: "..."
    }
  },
  hero: {
    centered: {...},
    withImage: {...}
  }
  // ... more components
}
```

### 3. Code Generator (`codeGenerator.js`)
**Purpose**: Assembles components into complete website code

**Key Functions:**
- `generateWebsite(specifications)` - Main generation function
- `generateFrontend(specs)` - Creates HTML/CSS/JS pages
- `generateBackend(specs)` - Creates Express server and routes
- `generateDatabaseSchema(specs)` - Creates MongoDB models
- `renderComponent(type, variant, data)` - Renders components with data

**Process Flow:**
```
Specifications → Select Components → Render with Data → Generate Files
```

**Output Structure:**
```javascript
{
  frontend: {
    index: { html, css, js },
    about: { html, css, js },
    contact: { html, css, js }
  },
  backend: {
    server: "...",
    routes: { contact: "..." },
    models: { Contact: "..." },
    package: {...}
  },
  database: [...]
}
```

### 4. API Routes

#### Generate Website Route (`generateWebsite.js`)
- `POST /api/website/generate` - Generate new website
- `GET /api/website/:id` - Get generated website
- `GET /api/website` - List all websites
- `POST /api/website/:id/save` - Save to filesystem
- `DELETE /api/website/:id` - Delete website

#### Preview Route (`preview.js`)
- `GET /preview/:id` - Preview homepage
- `GET /preview/:id/:page` - Preview specific page
- `POST /preview/:id/api/contact` - Handle form submissions in preview

### 5. Database Models

#### GeneratedWebsite Model
```javascript
{
  name: String,
  userInput: String,
  specifications: Object,
  files: [{ path: String, content: String }],
  summary: Object,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Frontend Interface

#### WebsiteGenerator Component
- Natural language input textarea
- Example prompts
- Generate button with loading state
- Tabbed interface (Preview, Summary, Files)
- Embedded iframe preview
- File tree viewer

## Data Flow

### Complete Generation Flow

```
1. USER INPUT
   ↓
2. AI SERVICE (Natural Language Processing)
   - Extract specifications
   - Identify website type, pages, components
   ↓
3. AI SERVICE (Content Generation)
   - Generate hero content
   - Generate features content
   - Generate navigation data
   ↓
4. CODE GENERATOR (Component Assembly)
   - Select appropriate components
   - Render with generated content
   ↓
5. CODE GENERATOR (File Generation)
   - Create HTML files
   - Create CSS files
   - Create JavaScript files
   - Create backend routes
   - Create database models
   ↓
6. DATABASE STORAGE
   - Save to GeneratedWebsite collection
   ↓
7. RESPONSE TO USER
   - Website ID
   - Specifications
   - Summary
   - Files array
   ↓
8. PREVIEW RENDERING
   - Serve through preview route
   - Inject CSS/JS inline
   - Fix navigation links
   ↓
9. FILESYSTEM SAVE (Optional)
   - Create project directory
   - Write all files
   - Ready to run independently
```

## Component System Architecture

### Component Structure
Each component has:
- **HTML Template**: With Mustache-style variables `{{variable}}`
- **CSS Styling**: Component-specific styles
- **JavaScript**: Interactive functionality (optional)
- **Backend**: API routes and models (for forms)

### Template Variables

**Simple Variables:**
```html
<h1>{{title}}</h1>
```

**Arrays:**
```html
{{#items}}
  <div>{{name}}</div>
{{/items}}
```

### Component Selection Logic

```javascript
Page Type → Required Components
---------    -----------------
Home       → navbar, hero, features, footer
About      → navbar, hero, content, footer
Services   → navbar, hero, features grid, footer
Gallery    → navbar, hero, gallery grid, footer
Contact    → navbar, hero, contact form, footer
```

## Generated Website Architecture

### Directory Structure
```
generated-website/
├── public/
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── css/
│   │   ├── index.css
│   │   ├── about.css
│   │   └── contact.css
│   └── js/
│       ├── index.js
│       └── contact.js
├── routes/
│   └── contact.js
├── models/
│   └── Contact.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

### Server Architecture
```
Express Server
├── Static File Serving (public/)
├── API Routes (/api/...)
├── Page Routes (/, /about, /contact)
└── MongoDB Connection
```

## Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Groq (Llama 3.3 70B)
- **Language**: Node.js

### Frontend Generator
- **Framework**: React
- **Styling**: CSS3
- **State Management**: React Hooks

### Generated Websites
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Express.js
- **Database**: MongoDB
- **Architecture**: RESTful API

## Scalability Considerations

### Current Capacity
- Handles multiple concurrent generations
- Stores unlimited generated websites
- Preview system supports multiple active previews

### Potential Bottlenecks
1. **AI API Rate Limits**: Groq API has rate limits
2. **Database Size**: MongoDB storage for all generated sites
3. **Preview Memory**: Iframe-based previews use browser memory

### Scaling Solutions
1. **Queue System**: For handling many concurrent requests
2. **File Storage**: Move generated files to cloud storage
3. **Caching**: Cache common component combinations
4. **CDN**: Serve preview content through CDN

## Security Considerations

### Implemented
- Input sanitization for user descriptions
- MongoDB injection prevention (Mongoose)
- CORS configuration
- Environment variable protection

### Future Enhancements
- Rate limiting on generation endpoint
- User authentication
- Project ownership tracking
- API key rotation

## Extension Points

### Adding New Components
1. Add to `componentLibrary.js`
2. Update `selectComponentsForPage()` logic
3. Add rendering logic in code generator

### Supporting New Website Types
1. Update AI specification extraction
2. Add type-specific component selection
3. Add type-specific content generation

### Adding New Backends
1. Create template generators for other frameworks
2. Add backend type selection in specifications
3. Update code generator with new backend logic

### Database Support
1. Add database type to specifications
2. Create schema generators for other databases
3. Update backend code generation

## Performance Metrics

### Generation Time
- AI Specification Extraction: ~5-8 seconds
- Content Generation: ~8-12 seconds
- Code Assembly: ~2-3 seconds
- Database Save: ~1 second
- **Total**: ~20-30 seconds

### Resource Usage
- Memory per generation: ~50-100 MB
- Database storage per project: ~500 KB - 2 MB
- Filesystem storage: ~50-200 KB per generated site

## Testing Strategy

### Unit Tests (Future)
- Component rendering
- Template variable replacement
- Code generation logic
- API endpoint responses

### Integration Tests (Future)
- End-to-end generation flow
- Preview system functionality
- Filesystem save operations
- Database operations

### Manual Testing Checklist
- ✅ Generate website from natural language
- ✅ Preview generated website
- ✅ Navigate between pages in preview
- ✅ Test contact form submission
- ✅ Save to filesystem
- ✅ Run generated website independently

## Monitoring & Logging

### Current Logging
- AI service initialization
- Generation requests
- Error logging with stack traces
- MongoDB connection status

### Recommended Additions
- Generation success/failure metrics
- Average generation time tracking
- Component usage statistics
- User input analysis

## Deployment Architecture

### Development
```
Frontend (React Dev Server :3000)
    ↓
Backend (Express :5000)
    ↓
MongoDB (localhost:27017)
    ↓
Groq API (External)
```

### Production
```
Frontend (Static Build → CDN/Nginx)
    ↓
Backend (Express → PM2/Docker)
    ↓
MongoDB (Atlas/Self-hosted)
    ↓
Groq API (External)
```

## Future Architecture Enhancements

### Microservices Split
- Generation Service
- Preview Service
- Storage Service
- AI Service (separate)

### Queue System
- Bull/RabbitMQ for generation queue
- Background job processing
- Progress tracking

### Caching Layer
- Redis for component caching
- Generated website caching
- AI response caching

### Cloud Integration
- S3 for generated file storage
- CloudFront for preview delivery
- Lambda for serverless generation

## Conclusion

This architecture provides a solid foundation for an AI-powered website generator that produces **real, functional websites** rather than static templates. The modular design allows for easy extension and customization while maintaining separation of concerns between AI processing, code generation, and file management.
