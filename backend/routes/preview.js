const express = require('express');
const router = express.Router();
const GeneratedWebsite = require('../models/GeneratedWebsite');

// Preview system for generated websites
// Serves the generated website files with proper routing

// Serve preview HTML page
router.get('/:id', async (req, res) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    
    if (!website) {
      return res.status(404).send('<h1>Website not found</h1>');
    }

    // Default to index page
    const indexFile = website.files.find(f => f.path === 'public/index.html');
    if (!indexFile) {
      return res.status(404).send('<h1>Index page not found</h1>');
    }

    // Get CSS and JS for index page
    const cssFile = website.files.find(f => f.path === 'public/css/index.css');
    const jsFile = website.files.find(f => f.path === 'public/js/index.js');

    let html = indexFile.content;

    // Inject CSS inline
    if (cssFile) {
      html = html.replace(
        /<link rel="stylesheet" href="\/css\/index\.css">/,
        `<style>${cssFile.content}</style>`
      );
    }

    // Inject JS inline and fix API endpoints for preview
    if (jsFile) {
      // Replace API endpoint in JS to work in preview mode
      let jsContent = jsFile.content;
      jsContent = jsContent.replace(/fetch\('\/api\//g, `fetch('/preview/${req.params.id}/api/`);
      
      html = html.replace(
        '</body>',
        `<script>${jsContent}</script></body>`
      );
    }

    // Fix navigation links for preview mode
    website.specifications.pages.forEach(page => {
      const regex = new RegExp(`href="/${page.name}"`, 'g');
      html = html.replace(regex, `href="/preview/${req.params.id}/${page.name}"`);
      
      const indexRegex = new RegExp(`href="/"`, 'g');
      html = html.replace(indexRegex, `href="/preview/${req.params.id}"`);
    });

    res.send(html);

  } catch (error) {
    console.error('Error serving preview:', error);
    res.status(500).send('<h1>Error loading preview</h1>');
  }
});

// Serve specific page in preview mode
router.get('/:id/:page', async (req, res) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    
    if (!website) {
      return res.status(404).send('<h1>Website not found</h1>');
    }

    const pageName = req.params.page;
    const htmlFile = website.files.find(f => f.path === `public/${pageName}.html`);
    
    if (!htmlFile) {
      return res.status(404).send('<h1>Page not found</h1>');
    }

    const cssFile = website.files.find(f => f.path === `public/css/${pageName}.css`);
    const jsFile = website.files.find(f => f.path === `public/js/${pageName}.js`);

    let html = htmlFile.content;

    // Inject CSS inline
    if (cssFile) {
      html = html.replace(
        new RegExp(`<link rel="stylesheet" href="/css/${pageName}\\.css">`),
        `<style>${cssFile.content}</style>`
      );
    }

    // Inject JS inline
    if (jsFile) {
      let jsContent = jsFile.content;
      jsContent = jsContent.replace(/fetch\('\/api\//g, `fetch('/preview/${req.params.id}/api/`);
      
      html = html.replace(
        '</body>',
        `<script>${jsContent}</script></body>`
      );
    }

    // Fix navigation links for preview mode
    website.specifications.pages.forEach(page => {
      const regex = new RegExp(`href="/${page.name}"`, 'g');
      html = html.replace(regex, `href="/preview/${req.params.id}/${page.name}"`);
      
      const indexRegex = new RegExp(`href="/"`, 'g');
      html = html.replace(indexRegex, `href="/preview/${req.params.id}"`);
    });

    res.send(html);

  } catch (error) {
    console.error('Error serving page preview:', error);
    res.status(500).send('<h1>Error loading page</h1>');
  }
});

// Handle API calls from preview (e.g., contact form)
router.post('/:id/api/contact', async (req, res) => {
  try {
    // In preview mode, just return success without saving to database
    res.json({ 
      success: true, 
      message: 'Preview mode: Form submission received (not saved)',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process form' });
  }
});

// Serve static assets (CSS/JS) if needed
router.get('/:id/css/:file', async (req, res) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    if (!website) return res.status(404).send('Not found');

    const cssFile = website.files.find(f => f.path === `public/css/${req.params.file}`);
    if (!cssFile) return res.status(404).send('CSS file not found');

    res.type('text/css').send(cssFile.content);
  } catch (error) {
    res.status(500).send('Error serving CSS');
  }
});

router.get('/:id/js/:file', async (req, res) => {
  try {
    const website = await GeneratedWebsite.findById(req.params.id);
    if (!website) return res.status(404).send('Not found');

    const jsFile = website.files.find(f => f.path === `public/js/${req.params.file}`);
    if (!jsFile) return res.status(404).send('JS file not found');

    res.type('application/javascript').send(jsFile.content);
  } catch (error) {
    res.status(500).send('Error serving JavaScript');
  }
});

module.exports = router;
