# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
1. [Website Generation](#website-generation)
2. [Projects](#projects)
3. [Components](#components)

---

## Website Generation

### Generate Website from Prompt

Generate a complete website from a natural language description.

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "prompt": "Create a portfolio website for a photographer with a gallery and contact form"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "html": "<!DOCTYPE html>...",
    "css": "body { margin: 0; }...",
    "javascript": "document.addEventListener...",
    "components": ["navbar", "hero", "gallery", "contactForm"],
    "description": "A modern portfolio website featuring..."
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (missing or invalid prompt)
- `500` - Server Error (AI generation failed)

---

### Generate Content

Generate specific content like headings, paragraphs, or descriptions.

**Endpoint:** `POST /api/generate/content`

**Request Body:**
```json
{
  "sectionType": "hero heading",
  "context": "photography portfolio website"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Capturing Life's Beautiful Moments"
  }
}
```

---

### Improve Code

Improve or modify existing website code based on feedback.

**Endpoint:** `POST /api/generate/improve`

**Request Body:**
```json
{
  "code": {
    "html": "existing html",
    "css": "existing css",
    "javascript": "existing js"
  },
  "improvements": "Make the navbar sticky and add smooth scrolling"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "html": "improved html",
    "css": "improved css",
    "javascript": "improved js"
  }
}
```

---

## Projects

### Get All Projects

Retrieve all saved projects.

**Endpoint:** `GET /api/projects`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "projectId": "uuid-here",
      "name": "Photography Portfolio",
      "description": "A modern portfolio website",
      "prompt": "Create a portfolio website...",
      "generatedCode": {
        "html": "...",
        "css": "...",
        "javascript": "..."
      },
      "components": ["navbar", "hero", "gallery"],
      "metadata": {
        "createdAt": "2026-01-06T10:00:00.000Z",
        "updatedAt": "2026-01-06T10:00:00.000Z",
        "isResponsive": true,
        "theme": "light"
      }
    }
  ]
}
```

---

### Get Project by ID

Retrieve a specific project by its ID.

**Endpoint:** `GET /api/projects/:id`

**Parameters:**
- `id` - Project UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": "uuid-here",
    "name": "Photography Portfolio",
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Project not found

---

### Create Project

Save a new project.

**Endpoint:** `POST /api/projects`

**Request Body:**
```json
{
  "name": "My Website",
  "description": "A beautiful website",
  "prompt": "Create a website...",
  "generatedCode": {
    "html": "...",
    "css": "...",
    "javascript": "..."
  },
  "components": ["navbar", "hero"],
  "metadata": {
    "isResponsive": true,
    "theme": "light"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": "generated-uuid",
    "name": "My Website",
    ...
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Bad Request (missing required fields)
- `500` - Server Error

---

### Update Project

Update an existing project.

**Endpoint:** `PUT /api/projects/:id`

**Parameters:**
- `id` - Project UUID

**Request Body:**
```json
{
  "name": "Updated Name",
  "generatedCode": {
    "html": "updated html",
    "css": "updated css"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": "uuid-here",
    "name": "Updated Name",
    ...
  }
}
```

---

### Delete Project

Delete a project.

**Endpoint:** `DELETE /api/projects/:id`

**Parameters:**
- `id` - Project UUID

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {
    "projectId": "uuid-here"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Project not found

---

## Components

### Get All Components

Retrieve all available component templates.

**Endpoint:** `GET /api/components`

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "navbar",
      "name": "Navigation Bar",
      "description": "Responsive navigation with logo and menu items",
      "category": "navigation"
    },
    {
      "id": "hero",
      "name": "Hero Section",
      "description": "Full-width hero section with heading, description, and CTA",
      "category": "header"
    }
  ]
}
```

---

### Get Component by Type

Retrieve a specific component template with its code.

**Endpoint:** `GET /api/components/:type`

**Parameters:**
- `type` - Component type (navbar, hero, features, gallery, contactForm, footer)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "navbar",
    "name": "Navigation Bar",
    "description": "Responsive navigation with logo and menu items",
    "category": "navigation",
    "template": {
      "html": "navbar html code",
      "css": "navbar css code",
      "javascript": "navbar js code (optional)"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Component not found

---

### Get Components by Category

Retrieve components filtered by category.

**Endpoint:** `GET /api/components/category/:category`

**Parameters:**
- `category` - Component category (navigation, header, content, media, form, footer)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "navbar",
      "name": "Navigation Bar",
      "description": "Responsive navigation with logo and menu items",
      "category": "navigation"
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Stack trace (only in development mode)"
}
```

**Common Error Status Codes:**
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side error)

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse, especially for the AI generation endpoints which consume OpenAI credits.

---

## Authentication

The current version does not include authentication. For production use, consider implementing:
- JWT-based authentication
- API keys for external access
- User-specific project isolation

---

## Examples

### Using cURL

**Generate a website:**
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a portfolio website for a photographer"}'
```

**Get all projects:**
```bash
curl http://localhost:5000/api/projects
```

**Delete a project:**
```bash
curl -X DELETE http://localhost:5000/api/projects/your-project-id
```

### Using JavaScript (Fetch API)

```javascript
// Generate website
const response = await fetch('http://localhost:5000/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Create a portfolio website for a photographer'
  })
});
const data = await response.json();
console.log(data);
```

---

## Future Enhancements

Potential API improvements:
- WebSocket support for real-time generation progress
- Batch generation of multiple websites
- Template marketplace integration
- Direct deployment endpoints
- Version control for projects
- Collaborative editing features
