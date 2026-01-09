# AI-Powered Website Generator

## Overview

An advanced AI-powered website generator that accepts natural language input and automatically generates complete, functional websites with:

- ✅ Multiple pages
- ✅ Reusable UI components  
- ✅ Responsive design
- ✅ Functional backend logic
- ✅ Working forms and button actions
- ✅ Database integration

**This is NOT a static HTML template generator** - it produces fully operational websites that can run independently.

## Key Features

### 1. Natural Language Processing
- Accepts plain English descriptions of websites
- AI interprets requirements and extracts specifications
- Automatically determines website type, pages, components, and features

### 2. Complete Code Generation
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js/Express with full API routes
- **Database**: MongoDB schemas and models
- **Component-based**: Reusable UI components dynamically assembled

### 3. Responsive Design
- All generated websites are mobile-responsive
- Uses modern CSS Grid and Flexbox
- Adapts to desktop, tablet, and mobile devices

### 4. Working Backend
- Contact form submissions saved to database
- RESTful API endpoints
- Optional user authentication
- Optional admin interface

### 5. Live Preview
- Embedded iframe preview
- Open in new tab
- Real-time rendering of generated website

## Architecture

### Backend Structure

```
backend/
├── models/
│   ├── GeneratedWebsite.js    # Database model for generated sites
│   └── Contact.js              # Contact form submissions
├── routes/
│   ├── generateWebsite.js     # Main generation API
│   └── preview.js              # Preview system
├── services/
│   ├── aiService.js            # AI/NLP interpretation
│   ├── codeGenerator.js        # Code generation engine
│   └── componentLibrary.js     # Reusable UI components
└── server.js                   # Express server
```

### Frontend Structure

```
frontend/src/
├── components/
│   ├── WebsiteGenerator.js     # Main generation interface
│   ├── WebsiteGenerator.css    # Styling
│   └── Projects.js             # Project management
└── services/
    └── api.js                  # API client
```

### Component Library

The system includes a comprehensive library of reusable components:

- **Navigation**: Modern navbar with mobile menu
- **Hero Sections**: Centered and image-based layouts
- **Features/Services**: Grid-based card layouts
- **Contact Forms**: Fully functional with backend integration
- **Galleries**: Responsive image grids
- **Footers**: Multi-column with links and contact info

## How It Works

### 1. User Input
User describes their website in natural language:
```
"Create a portfolio website for a photographer with a gallery and contact form"
```

### 2. AI Interpretation
The AI service extracts:
- Website type (portfolio)
- Required pages (Home, About, Gallery, Contact)
- Components (navbar, hero, gallery, contact form, footer)
- Backend requirements (contact form, database)

### 3. Content Generation
AI generates:
- Hero section content (headlines, CTAs)
- Features/services descriptions
- Navigation structure
- Footer content

### 4. Code Generation
The code generator:
- Selects appropriate components
- Combines components into pages
- Generates HTML, CSS, and JavaScript
- Creates backend routes and models
- Generates database schemas

### 5. File Structure Creation
Produces complete project structure:
```
generated-website/
├── public/
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── css/
│   └── js/
├── routes/
│   └── contact.js
├── models/
│   └── Contact.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Generate Website
```http
POST /api/website/generate
Content-Type: application/json

{
  "userInput": "Create a portfolio website for a photographer"
}

Response:
{
  "success": true,
  "websiteId": "...",
  "specifications": {...},
  "summary": {...},
  "files": [...]
}
```

### Get Generated Website
```http
GET /api/website/:id

Response: Complete website data including files
```

### Save to Filesystem
```http
POST /api/website/:id/save

Response:
{
  "success": true,
  "projectPath": "/path/to/generated-websites/project-name"
}
```

### Preview Website
```http
GET /preview/:id
GET /preview/:id/:page
```

## Component Library Details

### Navbar Component
- Sticky navigation
- Mobile-responsive with hamburger menu
- Smooth transitions

### Hero Components
- **Centered**: Full-width with gradient background
- **With Image**: Two-column layout with image

### Features Grid
- Auto-fit responsive grid
- Icon + title + description cards
- Hover effects

### Contact Form
- Name, email, subject, message fields
- Client-side validation
- Backend API integration
- Success/error messaging

### Gallery
- Responsive grid layout
- Image overlay on hover
- Lightbox-ready structure

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Groq AI (Llama 3.3 70B)

### Frontend
- React
- CSS3 (Grid, Flexbox)
- Modern JavaScript (ES6+)

### Generated Websites
- Vanilla HTML/CSS/JavaScript
- Express.js backend
- MongoDB database
- RESTful API architecture

## Setup Instructions

### 1. Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 2. Environment Variables

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/website-generator
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start MongoDB

```bash
mongod
```

### 4. Run Backend

```bash
cd backend
npm start
```

### 5. Run Frontend

```bash
cd frontend
npm start
```

### 6. Access Application

Open browser to `http://localhost:3000`

## Usage Examples

### Example 1: Photographer Portfolio
**Input:**
```
Create a portfolio website for a photographer with a gallery and contact form
```

**Generated:**
- Home page with hero section
- About page
- Gallery with image grid
- Contact form with backend
- Responsive navigation
- Professional footer

### Example 2: Restaurant Website
**Input:**
```
Build a restaurant website with menu, location, and online reservation
```

**Generated:**
- Home with hero and features
- Menu page with items
- Location/contact page
- Reservation form
- All with working backend

### Example 3: Business Website
**Input:**
```
Make a business website for a consulting company with services and team pages
```

**Generated:**
- Professional homepage
- Services page with grid layout
- Team/about page
- Contact form
- Business-appropriate styling

## Generated Website Deployment

Each generated website can be deployed independently:

### 1. Navigate to generated project
```bash
cd generated-websites/project-name
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

### 4. Start server
```bash
npm start
```

The generated website will run on its own port (default: 3000).

## Key Differences from Template Generators

| Feature | Template Generators | This System |
|---------|-------------------|-------------|
| Generation Method | Select pre-made templates | AI interprets requirements |
| Backend | Static or minimal | Full backend with APIs |
| Forms | Often non-functional | Working with database storage |
| Customization | Limited to template options | Fully custom based on input |
| Database | Rarely included | MongoDB integration included |
| API Routes | Not included | Complete RESTful APIs |
| Content | Placeholder text | AI-generated relevant content |

## Limitations & Future Enhancements

### Current Limitations
- Fixed component library (extensible)
- MongoDB only (could add other databases)
- No authentication by default (can be added)
- English input only

### Planned Enhancements
- [ ] More component variants
- [ ] Additional database support
- [ ] Built-in authentication system
- [ ] Admin dashboard generator
- [ ] Multi-language support
- [ ] E-commerce functionality
- [ ] Blog/CMS integration
- [ ] API documentation generation

## Troubleshooting

### Issue: AI generation fails
- Check GROQ_API_KEY in .env
- Verify API key has sufficient credits
- Check network connectivity

### Issue: MongoDB connection error
- Ensure MongoDB is running
- Verify MONGODB_URI in .env
- Check MongoDB service status

### Issue: Preview not loading
- Check if backend is running
- Verify websiteId is correct
- Check browser console for errors

### Issue: Generated website won't start
- Run `npm install` in generated project
- Configure .env file
- Ensure MongoDB is accessible

## License

MIT License - Feel free to use and modify

## Support

For issues and questions, please open an issue on the GitHub repository.
