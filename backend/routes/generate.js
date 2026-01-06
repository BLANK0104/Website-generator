const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const componentTemplates = require('../components/templates');

/**
 * POST /api/generate
 * Generate website from natural language prompt
 */
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Prompt is required',
        message: 'Please provide a description of the website you want to create'
      });
    }

    console.log(`🎨 Generating website from prompt: "${prompt}"`);

    // Get available component types
    const availableComponents = Object.keys(componentTemplates);

    // Generate website using AI
    const generatedCode = await aiService.generateWebsite(prompt, availableComponents);

    res.json({
      success: true,
      data: {
        html: generatedCode.html,
        css: generatedCode.css,
        javascript: generatedCode.javascript,
        components: generatedCode.components,
        description: generatedCode.description
      }
    });

  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate website',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * POST /api/generate/content
 * Generate specific content (headings, paragraphs, etc.)
 */
router.post('/content', async (req, res) => {
  try {
    const { sectionType, context } = req.body;

    if (!sectionType || !context) {
      return res.status(400).json({ 
        error: 'Section type and context are required'
      });
    }

    const content = await aiService.generateContent(sectionType, context);

    res.json({
      success: true,
      data: { content }
    });

  } catch (error) {
    console.error('Content Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message
    });
  }
});

/**
 * POST /api/generate/improve
 * Improve existing code based on feedback
 */
router.post('/improve', async (req, res) => {
  try {
    const { code, improvements } = req.body;

    if (!code || !improvements) {
      return res.status(400).json({ 
        error: 'Code and improvement requirements are required'
      });
    }

    const improvedCode = await aiService.improveCode(code, improvements);

    res.json({
      success: true,
      data: improvedCode
    });

  } catch (error) {
    console.error('Code Improvement Error:', error);
    res.status(500).json({ 
      error: 'Failed to improve code',
      message: error.message
    });
  }
});

module.exports = router;
