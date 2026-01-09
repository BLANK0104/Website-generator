# Project Architecture

## Overview

The AI Website Generator follows a client-server architecture with clear separation of concerns. The system is built using modern web technologies and leverages AI capabilities for intelligent code generation.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │  Generator  │  │   Preview    │  │   Projects    │   │
│  │  Component  │  │  Component   │  │   Component   │   │
│  └─────────────┘  └──────────────┘  └───────────────┘   │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                           │                             │
│                    API Service Layer                    │
└───────────────────────────┼─────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌───────────────────────────┼──────────────────────────────┐
│               Backend (Node.js + Express)                │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                   API Routes                        │ │
│  │  /generate  │  /projects  │  /components            │ │
│  └──────┬───────────┬────────────┬─────────────────────┘ │
│         │           │            │                       │
│  ┌──────▼───────────▼────────────▼─────────────────────┐ │
│  │              Services Layer                         │ │
│  │  ┌──────────────┐  ┌────────────────────────────┐   │ │
│  │  │  AI Service  │  │  Component Templates       │   │ │
│  │  │  (OpenAI)    │  │  (Predefined Patterns)     │   │ │
│  │  └──────────────┘  └────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────┘ │
│                           │                              │
│  ┌────────────────────────▼──────────────────────────┐   │
│  │                  Data Layer                       │   │
│  │            MongoDB (Project Storage)              │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                            │
                    External Services
                            │
                ┌───────────▼───────────┐
                │   OpenAI API (GPT-4)  │
                └───────────────────────┘
```

## Frontend Architecture (React)

### Component Structure

```
src/
├── components/
│   ├── Generator.js          # Main input interface
│   ├── Generator.css
│   ├── Preview.js            # Website preview & code viewer
│   ├── Preview.css
│   ├── Projects.js           # Project management
│   └── Projects.css
├── services/
│   └── api.js               # API communication layer
├── utils/
│   └── export.js            # Export & preview utilities
├── App.js                   # Main application container
├── App.css
├── index.js                 # React entry point
└── index.css
```

### Key Components

#### 1. Generator Component
- **Purpose**: User input and website generation trigger
- **Features**:
  - Natural language input textarea
  - Example prompts for quick start
  - Loading states during generation
  - Error handling and display

#### 2. Preview Component
- **Purpose**: Display and interact with generated websites
- **Features**:
  - Live preview in iframe
  - Responsive viewport testing (Desktop/Tablet/Mobile)
  - Code viewer with syntax highlighting
  - Copy to clipboard functionality
  - Export to HTML file

#### 3. Projects Component
- **Purpose**: Manage saved website projects
- **Features**:
  - Project listing with metadata
  - Search functionality
  - Project deletion
  - Quick load into preview

### State Management

Currently uses React's built-in state management:
- Component-level state with `useState`
- Props for parent-child communication
- No external state management library (Redux, MobX) needed

For larger applications, consider:
- Context API for global state
- Redux for complex state management
- React Query for server state

## Backend Architecture (Node.js/Express)

### Directory Structure

```
backend/
├── models/
│   └── Project.js           # MongoDB schema for projects
├── routes/
│   ├── generate.js          # Generation endpoints
│   ├── projects.js          # CRUD for projects
│   └── components.js        # Component templates
├── services/
│   └── aiService.js         # OpenAI integration
├── components/
│   └── templates.js         # UI component library
├── server.js                # Express app setup
├── package.json
└── .env                     # Environment configuration
```

### Core Modules

#### 1. Server (server.js)
- Express application setup
- Middleware configuration (CORS, body-parser)
- MongoDB connection
- Route mounting
- Error handling

#### 2. AI Service (aiService.js)
- **OpenAI Integration**: Communicates with GPT-4 API
- **Methods**:
  - `generateWebsite()` - Full website generation
  - `generateContent()` - Specific content generation
  - `improveCode()` - Code enhancement based on feedback
- **Prompt Engineering**: Carefully crafted system prompts for consistent output

#### 3. Component Templates (templates.js)
- Predefined UI components (navbar, hero, features, etc.)
- Each component includes HTML, CSS, and optional JavaScript
- Used as reference patterns for AI generation
- Ensures consistent, production-ready output

#### 4. Data Models (models/Project.js)
- MongoDB schema definition
- Project metadata tracking
- Automatic timestamp updates
- Data validation

### API Layers

```
Request → Router → Controller Logic → Service Layer → External API/Database → Response
```

**Example Flow for Website Generation:**
```
1. POST /api/generate
   ↓
2. generate.js route handler
   ↓
3. aiService.generateWebsite()
   ↓
4. OpenAI API call with prompt
   ↓
5. Parse and validate AI response
   ↓
6. Return JSON with generated code
```

## Data Flow

### 1. Website Generation Flow

```
User Input (Prompt)
    ↓
Frontend: Generator Component
    ↓
API Call: POST /api/generate
    ↓
Backend: Generate Route
    ↓
AI Service: Construct Prompt
    ↓
OpenAI API: GPT-4 Processing
    ↓
AI Service: Parse Response
    ↓
Backend: Format and Validate
    ↓
Frontend: Receive Generated Code
    ↓
Preview Component: Render Website
    ↓
Auto-save to Database
```

### 2. Project Save/Load Flow

```
Generated Code
    ↓
Frontend: createProject() API call
    ↓
Backend: POST /api/projects
    ↓
MongoDB: Insert document
    ↓
Frontend: Confirmation
    
    [Later...]
    
User: Load Project
    ↓
Frontend: GET /api/projects/:id
    ↓
Backend: Query MongoDB
    ↓
Frontend: Populate Preview
```

## Database Schema

### Project Collection

```javascript
{
  projectId: String (UUID),      // Unique identifier
  name: String,                  // Project name
  description: String,           // Brief description
  prompt: String,                // Original user prompt
  generatedCode: {
    html: String,                // Generated HTML
    css: String,                 // Generated CSS
    javascript: String           // Generated JS (optional)
  },
  components: [String],          // Used component types
  metadata: {
    createdAt: Date,            // Creation timestamp
    updatedAt: Date,            // Last update timestamp
    isResponsive: Boolean,      // Responsiveness flag
    theme: String               // Color theme
  }
}
```

**Indexes:**
- `projectId` (unique)
- `metadata.updatedAt` (for sorting)

## AI Integration Details

### OpenAI Configuration

**Model**: GPT-4 Turbo Preview
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 4000 (for complete website code)
- **Response Format**: JSON object

### Prompt Engineering

The system uses carefully crafted prompts with:

1. **System Prompt**: Defines the AI's role and capabilities
   - Expert web developer persona
   - Quality standards (semantic HTML, accessibility, etc.)
   - Output format requirements

2. **User Prompt**: The actual user request
   - Natural language description
   - Component preferences

3. **Context**: Available component patterns
   - Informs AI about reusable components
   - Ensures consistent patterns

### Response Handling

```javascript
{
  html: "Complete HTML markup",
  css: "Complete stylesheet",
  javascript: "Interactive behavior (optional)",
  components: ["navbar", "hero", "features"],
  description: "Human-readable description"
}
```

## Security Considerations

### Current Implementation
- CORS enabled for local development
- Environment variables for sensitive data
- Input validation on API endpoints
- MongoDB injection protection via Mongoose

### Production Recommendations
1. **Authentication**: Implement JWT-based auth
2. **Rate Limiting**: Prevent API abuse
3. **Input Sanitization**: Validate and sanitize all inputs
4. **HTTPS**: Enable SSL/TLS in production
5. **API Key Rotation**: Regular OpenAI key rotation
6. **Database Security**: Use MongoDB Atlas with IP whitelisting
7. **Secrets Management**: Use services like AWS Secrets Manager

## Performance Optimization

### Current Optimizations
- Lazy loading of components
- Code splitting in React
- Efficient MongoDB queries with projections
- Connection pooling for database

### Future Improvements
1. **Caching**: Redis for frequently requested data
2. **CDN**: Serve static assets via CDN
3. **Compression**: Gzip/Brotli for API responses
4. **Debouncing**: Prevent rapid-fire API calls
5. **Pagination**: For project listings
6. **Background Jobs**: Queue system for long-running tasks

## Scalability Considerations

### Current Limitations
- Single-server architecture
- No load balancing
- Limited concurrent request handling
- OpenAI API rate limits

### Scaling Strategy

**Horizontal Scaling:**
```
Load Balancer
    ↓
Multiple Node.js Instances
    ↓
Shared MongoDB Cluster
```

**Microservices Approach:**
- Separate generation service
- Project management service
- Authentication service
- Each with independent scaling

## Technology Stack Summary

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Icons**: Lucide React
- **Code Display**: React Syntax Highlighter

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI**: OpenAI API (GPT-4)
- **Utilities**: dotenv, uuid, cors, body-parser

### Development Tools
- **Package Manager**: npm
- **Dev Server**: Create React App, Nodemon
- **Version Control**: Git

## Deployment Architecture

### Development Environment
```
localhost:3000 (React Dev Server)
    ↓
localhost:5000 (Express Server)
    ↓
localhost:27017 (MongoDB)
```

### Production Environment (Recommended)
```
Vercel/Netlify (Frontend)
    ↓ HTTPS
Render/Heroku (Backend)
    ↓ Secure Connection
MongoDB Atlas (Database)
    ↓ API Key
OpenAI Platform
```

## Error Handling Strategy

### Frontend
- Try-catch blocks for API calls
- User-friendly error messages
- Loading states to prevent multiple submissions
- Graceful degradation

### Backend
- Centralized error handling middleware
- Detailed logging (console in dev, file/service in prod)
- Proper HTTP status codes
- Error response standardization

## Testing Strategy (Future Implementation)

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Component interactions
- **E2E Tests**: Cypress or Playwright

### Backend Testing
- **Unit Tests**: Jest + Supertest
- **Integration Tests**: API endpoint testing
- **Mock Testing**: Mock OpenAI responses

## Monitoring and Logging (Future)

### Recommended Tools
- **Application Monitoring**: New Relic, Datadog
- **Error Tracking**: Sentry
- **Logging**: Winston, Morgan
- **Analytics**: Google Analytics, Mixpanel

## Documentation Standards

- **Code Comments**: Inline for complex logic
- **JSDoc**: Function documentation
- **API Docs**: OpenAPI/Swagger specification
- **README**: Setup and usage instructions
- **Architecture Docs**: This document

## Future Architecture Enhancements

1. **Real-time Collaboration**
   - WebSocket integration
   - Collaborative editing
   - Live preview sharing

2. **Template Marketplace**
   - User-contributed templates
   - Rating and review system
   - Premium templates

3. **Advanced AI Features**
   - Multi-page website generation
   - Image generation integration
   - SEO optimization
   - A/B testing suggestions

4. **Deployment Integration**
   - Direct deployment to Vercel/Netlify
   - Custom domain management
   - Continuous deployment pipelines

5. **Version Control**
   - Git-like versioning for projects
   - Branch and merge capabilities
   - Rollback functionality
