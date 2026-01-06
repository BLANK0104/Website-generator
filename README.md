# AI-Powered Website Generator

An intelligent website generator that uses AI to create functional websites from natural language descriptions.

## Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini AI to generate HTML, CSS, and JavaScript code
- 💬 **Natural Language Input**: Describe your website in plain English
- 🎨 **Component Library**: Pre-built, reusable UI components
- 📱 **Responsive Design**: Generated websites work on all devices
- 👁️ **Live Preview**: See your website before downloading
- 📦 **Export Functionality**: Download complete HTML/CSS/JS files
- 💾 **Project Management**: Save and manage multiple projects

## Tech Stack

### Frontend
- React.js
- Axios for API calls
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB for data storage
- Google Gemini API for AI generation
- Mongoose ODM

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key (free tier available)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your Google Gemini API key and MongoDB URI to `.env`

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will open at http://localhost:3000

## Usage

1. **Enter Requirements**: Describe your website in the input field (e.g., "Create a portfolio website for a photographer")

2. **Generate**: Click the generate button to let AI create your website

3. **Preview**: Review the generated website in the live preview panel

4. **Export**: Download the complete HTML/CSS/JS files or save the project

## API Endpoints

### Website Generation
- `POST /api/generate` - Generate website from prompt
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Save a new project
- `DELETE /api/projects/:id` - Delete a project

### Components
- `GET /api/components` - Get all available components
- `GET /api/components/:type` - Get components by type

## Project Structure

```
website-generator/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── components/      # Component templates
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── services/    # API services
│       ├── utils/       # Helper functions
│       └── App.js       # Main component
└── README.md
```

## Architecture

The application follows a client-server architecture:

1. **Frontend (React)**: Provides the user interface for inputting requirements and previewing websites
2. **Backend (Express)**: Handles API requests and coordinates AI generation
3. **AI Service (OpenAI)**: Processes natural language and generates code
4. **Database (MongoDB)**: Stores user projects and templates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
