# System Flow Diagrams

Visual representations of how the AI Website Generator works.

## 1. Overall System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          USER                               │
│                      (Web Browser)                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│  ┌──────────────┐  ┌───────────┐  ┌─────────────────────┐  │
│  │  Generator   │  │  Preview  │  │     Projects        │  │
│  │  Component   │  │ Component │  │     Component       │  │
│  └──────┬───────┘  └─────┬─────┘  └──────┬──────────────┘  │
│         │                 │                │                 │
│         └─────────────────┴────────────────┘                 │
│                           │                                  │
│                    ┌──────▼───────┐                         │
│                    │  API Service │                         │
│                    └──────┬───────┘                         │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            │ REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               API Routes Layer                      │   │
│  │  /generate  │  /projects  │  /components           │   │
│  └───────┬──────────┬─────────────┬────────────────────┘   │
│          │          │             │                         │
│  ┌───────▼──────────▼─────────────▼────────────────────┐   │
│  │            Controllers & Logic                      │   │
│  └───────┬──────────┬─────────────┬────────────────────┘   │
│          │          │             │                         │
│  ┌───────▼──────┐   │      ┌──────▼──────────────────┐     │
│  │ AI Service   │   │      │  Component Templates    │     │
│  │ (OpenAI)     │   │      │  (6 UI Components)      │     │
│  └───────┬──────┘   │      └─────────────────────────┘     │
│          │          │                                       │
└──────────┼──────────┼───────────────────────────────────────┘
           │          │
           │          │ Mongoose ODM
           │          ▼
           │    ┌─────────────┐
           │    │   MongoDB   │
           │    │  (Projects) │
           │    └─────────────┘
           │
           │ HTTPS API Call
           ▼
     ┌──────────────┐
     │  OpenAI API  │
     │   (GPT-4)    │
     └──────────────┘
```

## 2. User Interaction Flow

```
START
  │
  ▼
┌─────────────────────┐
│  User Opens App     │
│  (localhost:3000)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Generator Component │
│ - Input field shown │
│ - Examples visible  │
└──────────┬──────────┘
           │
           │ User enters prompt
           │ "Create portfolio..."
           ▼
┌─────────────────────┐
│  Click Generate     │
│  Button             │
└──────────┬──────────┘
           │
           │ Loading state
           │ (15-30 seconds)
           ▼
┌─────────────────────┐
│  Website Generated  │
│  - HTML received    │
│  - CSS received     │
│  - JS received      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Preview Component  │
│  - Renders website  │
│  - Shows code tabs  │
└──────────┬──────────┘
           │
           ├─────────────────┐
           │                 │
           ▼                 ▼
┌─────────────────┐   ┌─────────────────┐
│  Export HTML    │   │  Save Project   │
│  (Download)     │   │  (Auto/Manual)  │
└─────────────────┘   └─────────────────┘
           │                 │
           │                 ▼
           │          ┌─────────────────┐
           │          │  MongoDB Store  │
           │          └─────────────────┘
           │
           ▼
         END
```

## 3. Website Generation Flow

```
User Prompt
    │
    │ "Create a portfolio website..."
    ▼
┌────────────────────────┐
│  Frontend: Generator   │
│  - Validates input     │
│  - Shows loading       │
└────────┬───────────────┘
         │
         │ POST /api/generate
         │ { prompt: "..." }
         ▼
┌────────────────────────┐
│  Backend: Route        │
│  - Receives request    │
│  - Validates prompt    │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  AI Service            │
│  - Get component list  │
│  - Build system prompt │
│  - Add user prompt     │
└────────┬───────────────┘
         │
         │ API Request
         ▼
┌────────────────────────┐
│  OpenAI API (GPT-4)    │
│  - Process request     │
│  - Generate code       │
│  - Return JSON         │
└────────┬───────────────┘
         │
         │ Response:
         │ { html, css, js, ... }
         ▼
┌────────────────────────┐
│  AI Service            │
│  - Parse response      │
│  - Validate code       │
│  - Format output       │
└────────┬───────────────┘
         │
         │ JSON Response
         ▼
┌────────────────────────┐
│  Backend: Route        │
│  - Send to frontend    │
└────────┬───────────────┘
         │
         │ HTTP Response
         ▼
┌────────────────────────┐
│  Frontend: Generator   │
│  - Receive data        │
│  - Update state        │
│  - Trigger preview     │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│  Preview Component     │
│  - Render website      │
│  - Enable interactions │
└────────────────────────┘
```

## 4. Project Save/Load Flow

### Save Flow
```
Generated Code
    │
    ▼
┌─────────────────────┐
│  Auto-save Trigger  │
└──────────┬──────────┘
           │
           │ POST /api/projects
           │ { name, code, prompt, ... }
           ▼
┌─────────────────────┐
│  Projects Route     │
│  - Validate data    │
│  - Generate UUID    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  MongoDB Insert     │
│  - Save document    │
│  - Return project   │
└──────────┬──────────┘
           │
           │ Success Response
           ▼
┌─────────────────────┐
│  Frontend           │
│  - Show success     │
└─────────────────────┘
```

### Load Flow
```
User Clicks Project
    │
    ▼
┌─────────────────────┐
│  Projects Component │
│  - Get project ID   │
└──────────┬──────────┘
           │
           │ GET /api/projects/:id
           ▼
┌─────────────────────┐
│  Projects Route     │
│  - Find by ID       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  MongoDB Query      │
│  - Retrieve doc     │
└──────────┬──────────┘
           │
           │ Project Data
           ▼
┌─────────────────────┐
│  Frontend           │
│  - Update state     │
│  - Show in preview  │
└─────────────────────┘
```

## 5. Component Template System

```
┌─────────────────────────────────────────────────────┐
│              Component Templates                    │
│                 (templates.js)                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  navbar:                                            │
│  ├─ HTML: <nav>...</nav>                           │
│  ├─ CSS:  .navbar {...}                            │
│  └─ JS:   (optional)                               │
│                                                     │
│  hero:                                              │
│  ├─ HTML: <section class="hero">...                │
│  ├─ CSS:  .hero {...}                              │
│  └─ JS:   (none)                                   │
│                                                     │
│  features:                                          │
│  ├─ HTML: <section class="features">...            │
│  ├─ CSS:  .features-grid {...}                     │
│  └─ JS:   (none)                                   │
│                                                     │
│  gallery:                                           │
│  ├─ HTML: <section class="gallery">...             │
│  ├─ CSS:  .gallery-grid {...}                      │
│  └─ JS:   (optional interactions)                  │
│                                                     │
│  contactForm:                                       │
│  ├─ HTML: <form>...</form>                         │
│  ├─ CSS:  .contact-form {...}                      │
│  └─ JS:   form validation                          │
│                                                     │
│  footer:                                            │
│  ├─ HTML: <footer>...</footer>                     │
│  ├─ CSS:  .footer {...}                            │
│  └─ JS:   (none)                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
         │
         │ Referenced during AI generation
         ▼
┌─────────────────────────────────────────────────────┐
│             AI Generation Process                   │
│  - AI knows about available components              │
│  - Intelligently combines them                      │
│  - Adapts styling to user's requirements            │
│  - Maintains consistency                            │
└─────────────────────────────────────────────────────┘
```

## 6. Data Flow Diagram

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       │ 1. Enters prompt
       ▼
┌──────────────┐      2. API Call      ┌──────────────┐
│   React UI   │ ───────────────────> │   Express    │
│  (Frontend)  │                       │   Backend    │
└──────┬───────┘                       └──────┬───────┘
       │                                      │
       │ 6. Display result                   │ 3. Process
       │ ◄───────────────────────────────────┤
       │                                      │
       │                                      ▼
       │                               ┌──────────────┐
       │                               │   OpenAI     │
       │                               │     API      │
       │                               └──────┬───────┘
       │                                      │
       │                               4. Generate code
       │                                      │
       │                                      ▼
       │                               ┌──────────────┐
       │ 5. Save project               │   MongoDB    │
       └──────────────────────────────>│   Database   │
                                       └──────────────┘
```

## 7. State Management

```
┌─────────────────────────────────────────────────┐
│          App Component (Main State)             │
├─────────────────────────────────────────────────┤
│                                                 │
│  State:                                         │
│  ├─ generatedCode: null | CodeObject           │
│  ├─ isLoading: boolean                         │
│  ├─ error: null | string                       │
│  └─ currentView: 'home' | 'projects'           │
│                                                 │
└───┬─────────────────────────────────────────────┘
    │
    │ Props passed down
    │
    ├────────────────────────┬────────────────────┐
    │                        │                    │
    ▼                        ▼                    ▼
┌──────────┐          ┌──────────┐        ┌──────────┐
│Generator │          │ Preview  │        │ Projects │
│Component │          │Component │        │Component │
└────┬─────┘          └────┬─────┘        └────┬─────┘
     │                     │                    │
     │ Local State:        │ Local State:       │ Local State:
     │ - prompt            │ - viewMode         │ - projects[]
     │                     │ - activeTab        │ - searchTerm
     │                     │ - previewURL       │
     │                     │                    │
     └─────────────────────┴────────────────────┘
```

## 8. API Request/Response Flow

```
Frontend                    Backend                    External
   │                          │                          │
   │  POST /api/generate      │                          │
   ├─────────────────────────>│                          │
   │  { prompt: "..." }       │                          │
   │                          │  OpenAI API Call         │
   │                          ├─────────────────────────>│
   │                          │  System + User Prompt    │
   │                          │                          │
   │                          │      AI Processing       │
   │                          │      (15-30 seconds)     │
   │                          │                          │
   │                          │<─────────────────────────┤
   │                          │  Generated Code (JSON)   │
   │<─────────────────────────┤                          │
   │  {                       │                          │
   │    success: true,        │                          │
   │    data: {               │                          │
   │      html: "...",        │                          │
   │      css: "...",         │                          │
   │      javascript: "..."   │                          │
   │    }                     │                          │
   │  }                       │                          │
   │                          │                          │
```

## 9. Component Hierarchy

```
App
├── Router
│   ├── Navbar
│   │   ├── Brand Logo
│   │   └── Navigation Links
│   │       ├── Generate Button
│   │       └── Projects Button
│   │
│   ├── Main Content (Conditional)
│   │   │
│   │   ├── Home View
│   │   │   ├── Generator Component
│   │   │   │   ├── Header
│   │   │   │   ├── Input Form
│   │   │   │   │   ├── Textarea
│   │   │   │   │   └── Generate Button
│   │   │   │   └── Examples Section
│   │   │   │       └── Example Cards
│   │   │   │
│   │   │   └── Preview Component
│   │   │       ├── Preview Header
│   │   │       │   ├── Tabs (Preview/HTML/CSS/JS)
│   │   │       │   └── Actions (Device/Copy/Export)
│   │   │       ├── Preview Content
│   │   │       │   ├── iframe (Preview mode)
│   │   │       │   └── Code Viewer (Code modes)
│   │   │       └── Preview Info
│   │   │
│   │   └── Projects View
│   │       ├── Projects Header
│   │       │   ├── Title
│   │       │   └── Search Box
│   │       └── Projects Grid
│   │           └── Project Cards
│   │               ├── Card Header
│   │               ├── Description
│   │               ├── Component Tags
│   │               └── Footer (Date, Actions)
│   │
│   └── Footer
│       └── Copyright Info
```

## 10. Error Handling Flow

```
┌─────────────────────┐
│   User Action       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Frontend Validate  │
├─────────────────────┤
│  Prompt not empty?  │
└──────────┬──────────┘
           │
       ┌───┴───┐
       │  Yes  │  No ──> Show validation error
       │       │
       ▼       └──────────────┐
┌─────────────────────┐       │
│  Send API Request   │       │
└──────────┬──────────┘       │
           │                  │
       ┌───┴───┐              │
       │Success│ Error ──┐    │
       │       │         │    │
       ▼       │         ▼    │
┌──────────┐   │  ┌──────────────┐
│  Show    │   │  │ Catch Error  │
│  Result  │   │  ├──────────────┤
└──────────┘   │  │ - Network?   │
               │  │ - API?       │
               │  │ - Server?    │
               │  └──────┬───────┘
               │         │
               │         ▼
               │  ┌──────────────┐
               │  │ Show Error   │
               │  │ Message to   │
               │  │ User         │
               │  └──────────────┘
               │         │
               └─────────┴────────> Log to console
```

## 11. MongoDB Schema Diagram

```
┌─────────────────────────────────────────────┐
│               Project Document              │
├─────────────────────────────────────────────┤
│                                             │
│  _id: ObjectId                              │
│  projectId: String (UUID)                   │
│  name: String                               │
│  description: String                        │
│  prompt: String                             │
│                                             │
│  generatedCode: {                           │
│    html: String                             │
│    css: String                              │
│    javascript: String                       │
│  }                                          │
│                                             │
│  components: [String]                       │
│                                             │
│  metadata: {                                │
│    createdAt: Date                          │
│    updatedAt: Date                          │
│    isResponsive: Boolean                    │
│    theme: String                            │
│  }                                          │
│                                             │
└─────────────────────────────────────────────┘

Indexes:
- projectId (unique)
- metadata.updatedAt (for sorting)
```

---

These diagrams provide a comprehensive visual understanding of how the AI Website Generator works at various levels, from high-level architecture to detailed component interactions.
