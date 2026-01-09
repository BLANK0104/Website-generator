const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const GeneratedWebsite = require('../models/GeneratedWebsite');
const fs = require('fs').promises;
const path = require('path');

// Generate website from natural language input
router.post('/generate', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a website description' });
    }

    console.log('Generating website for input:', userInput);

    // Use AI to interpret and generate complete website
    const result = await aiService.interpretAndGenerate(userInput);

    // Save to database
    const website = new GeneratedWebsite({
      name: result.specifications.siteName,
      userInput,
      specifications: result.specifications,
      files: result.files,
      summary: result.summary,
      status: 'generated'
    });

    await website.save();

    res.json({
      success: true,
      websiteId: website._id,
      specifications: result.specifications,
      summary: result.summary,
      files: result.files,
      message: 'Website generated successfully'
    });

  } catch (error) {
    console.error('Error generating website:', error);
    res.status(500).json({ 
      error: 'Failed to generate website',
      details: error.message 
    });
  }
});

// Get generated website by ID
router.get('/:id', async (req, res) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json(website);
  } catch (error) {
    console.error('Error fetching website:', error);
    res.status(500).json({ error: 'Failed to fetch website' });
  }
});

// Get all generated websites
router.get('/', async (req, res) => {
  try {
    const websites = await GeneratedWebsite.find()
      .sort({ createdAt: -1 })
      .select('name specifications.siteName specifications.websiteType summary status createdAt');

    res.json(websites);
  } catch (error) {
    console.error('Error fetching websites:', error);
    res.status(500).json({ error: 'Failed to fetch websites' });
  }
});

// Save generated website to filesystem
router.post('/:id/save', async (req, res) => {
  try {
    console.log('Saving website with ID:', req.params.id);
    
    const website = await GeneratedWebsite.findById(req.params.id);
    
    if (!website) {
      console.log('Website not found:', req.params.id);
      return res.status(404).json({ error: 'Website not found' });
    }

    console.log('Website found, creating directories...');

    // Create project directory
    const projectsDir = path.join(__dirname, '../../generated-websites');
    const projectName = website.specifications.siteName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const projectPath = path.join(projectsDir, projectName);

    console.log('Project path:', projectPath);

    // Create directory structure
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(path.join(projectPath, 'public'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'public/css'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'public/js'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'routes'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'models'), { recursive: true });

    console.log('Directories created, writing files...');

    // Write all files
    for (const file of website.files) {
      const filePath = path.join(projectPath, file.path);
      await fs.writeFile(filePath, file.content, 'utf8');
    }

    console.log('Files written, updating database...');

    // Update database
    website.projectPath = projectPath;
    website.status = 'saved';
    await website.save();

    console.log('Website saved successfully to:', projectPath);

    res.json({
      success: true,
      message: 'Website saved to filesystem',
      projectPath
    });

  } catch (error) {
    console.error('Error saving website:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to save website',
      details: error.message 
    });
  }
});

// Delete generated website
router.delete('/:id', async (req, res) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Delete from filesystem if saved
    if (website.projectPath) {
      try {
        await fs.rm(website.projectPath, { recursive: true, force: true });
      } catch (err) {
        console.error('Error deleting project files:', err);
      }
    }

    // Delete from database
    await GeneratedWebsite.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Website deleted successfully' });

  } catch (error) {
    console.error('Error deleting website:', error);
    res.status(500).json({ error: 'Failed to delete website' });
  }
});

// Preview a specific page from generated website
router.get('/:id/preview/:page', async (req, res) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    const pageName = req.params.page;
    const htmlFile = website.files.find(f => f.path === `public/${pageName}.html`);
    const cssFile = website.files.find(f => f.path === `public/css/${pageName}.css`);
    const jsFile = website.files.find(f => f.path === `public/js/${pageName}.js`);

    if (!htmlFile) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Inject CSS and JS into HTML for preview
    let html = htmlFile.content;
    
    if (cssFile) {
      html = html.replace(
        `<link rel="stylesheet" href="/css/${pageName}.css">`,
        `<style>${cssFile.content}</style>`
      );
    }

    if (jsFile) {
      html = html.replace(
        '</body>',
        `<script>${jsFile.content}</script></body>`
      );
    }

    res.send(html);

  } catch (error) {
    console.error('Error previewing page:', error);
    res.status(500).json({ error: 'Failed to preview page' });
  }
});

module.exports = router;
