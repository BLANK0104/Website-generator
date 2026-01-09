# Quick Start Guide - AI Website Generator

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 14+ installed
- MongoDB installed and running
- Groq API key ([Get one free here](https://console.groq.com))

### Step 1: Clone and Install

```bash
# Navigate to project
cd "e:\Projects\Website generator"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### Step 2: Configure Environment

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/website-generator
GROQ_API_KEY=your_api_key_here
```

### Step 3: Start Services

**Terminal 1 - Start MongoDB:**
```bash
mongod
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm start
```

### Step 4: Generate Your First Website

1. Open `http://localhost:3000` in your browser
2. Enter a description like:
   ```
   Create a portfolio website for a photographer with gallery and contact form
   ```
3. Click "Generate Website"
4. Wait 20-30 seconds for AI to work
5. View your generated website in the preview!

## 📝 Example Prompts to Try

### Portfolio Sites
```
Create a portfolio website for a photographer with a gallery and contact form
```
```
Make a graphic designer portfolio with projects showcase and about page
```

### Business Sites
```
Build a business website for a consulting company with services and contact form
```
```
Create a law firm website with practice areas, attorney bios, and consultation form
```

### Restaurant/Service Sites
```
Make a restaurant website with menu, location, and reservation form
```
```
Build a spa website with services, pricing, and booking form
```
```
Create a gym website with class schedules, trainers, and membership signup
```

### E-commerce Style
```
Create a jewelry store website with product gallery and contact form
```
```
Make a boutique clothing website with collections and inquiry form
```

## 🎯 What You'll Get

Each generated website includes:

✅ **Multiple Pages**
- Home (with hero and features)
- About
- Services/Gallery
- Contact

✅ **Professional Components**
- Responsive navigation
- Hero sections
- Feature grids
- Image galleries
- Contact forms

✅ **Working Backend**
- Express.js server
- MongoDB database
- REST API endpoints
- Form submission handling

✅ **Complete Code**
- HTML/CSS/JavaScript
- Backend routes
- Database models
- Package.json
- README

## 💾 Saving Generated Websites

After generation:

1. Click "Save to Filesystem" button
2. Website saved to `backend/generated-websites/`
3. Navigate to the folder
4. Run:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI
   npm start
   ```

## 🔍 Preview Features

- **Embedded Preview**: See website in iframe
- **Open in New Tab**: Full-screen preview
- **Multiple Pages**: Navigate between generated pages
- **Working Forms**: Test form submissions (preview mode)

## 🛠️ Customizing Generated Websites

Generated websites can be fully customized:

1. Edit HTML files in `public/` folder
2. Modify CSS in `public/css/` folder
3. Update JavaScript in `public/js/` folder
4. Change backend logic in `routes/` folder
5. Modify database models in `models/` folder

## 📊 Project Structure Overview

```
Generated Website/
├── public/
│   ├── index.html          # Home page
│   ├── about.html          # About page
│   ├── contact.html        # Contact page
│   ├── css/                # Stylesheets
│   └── js/                 # Client scripts
├── routes/
│   └── contact.js          # Contact form API
├── models/
│   └── Contact.js          # Database schema
├── server.js               # Express server
├── package.json            # Dependencies
└── README.md               # Instructions
```

## 🎨 Customization Tips

### Change Colors
Edit the CSS files and replace color values:
```css
/* Find and replace these common colors */
#007bff  /* Primary blue */
#667eea  /* Purple gradient start */
#764ba2  /* Purple gradient end */
```

### Add New Pages
1. Copy an existing HTML file
2. Update navigation links
3. Add corresponding CSS/JS files
4. Update server.js routes

### Modify Contact Form
Edit `routes/contact.js` to:
- Add email notifications
- Change validation rules
- Add more fields
- Connect to external services

## 🐛 Common Issues

### "AI model not initialized"
- Check GROQ_API_KEY in .env
- Restart backend server

### "Database connection error"
- Ensure MongoDB is running
- Check MONGODB_URI is correct

### Preview shows blank page
- Check browser console for errors
- Verify backend is running on port 5000
- Check websiteId in URL

### Generation takes too long
- Normal time: 20-30 seconds
- Check internet connection
- Verify Groq API status

## 📚 Next Steps

- Explore the component library
- Try different website types
- Customize generated websites
- Deploy to production
- Add more features

## 🎓 Learning Resources

- **Component Library**: See `backend/services/componentLibrary.js`
- **Code Generator**: See `backend/services/codeGenerator.js`
- **AI Service**: See `backend/services/aiService.js`
- **Full Docs**: See `README_NEW.md`

## 💡 Pro Tips

1. **Be Specific**: More detailed descriptions = better results
2. **Mention Features**: Explicitly state features like "contact form", "gallery", "services"
3. **Review Summary**: Check the Summary tab to see what was generated
4. **Test Forms**: Try submitting the contact form in preview
5. **Save Projects**: Use "Save to Filesystem" to preserve generated sites

## 🌟 Example Workflow

```
1. Describe website → "Create a spa website..."
2. Click Generate → Wait 30 seconds
3. View Preview → Check the generated site
4. Review Summary → See pages and features
5. Check Files → View all generated code
6. Save Project → Store to filesystem
7. Run Locally → npm install && npm start
8. Customize → Edit files as needed
9. Deploy → Host on your server
```

## 📞 Need Help?

- Check the full README_NEW.md
- Review generated code
- Check browser console
- Verify environment variables

Happy website generating! 🎉
