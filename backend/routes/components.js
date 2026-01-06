const express = require('express');
const router = express.Router();
const componentTemplates = require('../components/templates');

/**
 * GET /api/components
 * Get all available components
 */
router.get('/', (req, res) => {
  try {
    const components = Object.entries(componentTemplates).map(([key, component]) => ({
      id: key,
      name: component.name,
      description: component.description,
      category: component.category
    }));

    res.json({
      success: true,
      count: components.length,
      data: components
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ 
      error: 'Failed to fetch components',
      message: error.message
    });
  }
});

/**
 * GET /api/components/:type
 * Get a specific component template
 */
router.get('/:type', (req, res) => {
  try {
    const { type } = req.params;
    const component = componentTemplates[type];

    if (!component) {
      return res.status(404).json({ 
        error: 'Component not found',
        message: `No component template found with type: ${type}`,
        availableTypes: Object.keys(componentTemplates)
      });
    }

    res.json({
      success: true,
      data: {
        id: type,
        ...component
      }
    });
  } catch (error) {
    console.error('Error fetching component:', error);
    res.status(500).json({ 
      error: 'Failed to fetch component',
      message: error.message
    });
  }
});

/**
 * GET /api/components/category/:category
 * Get components by category
 */
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    const components = Object.entries(componentTemplates)
      .filter(([_, component]) => component.category === category)
      .map(([key, component]) => ({
        id: key,
        name: component.name,
        description: component.description,
        category: component.category
      }));

    if (components.length === 0) {
      return res.status(404).json({ 
        error: 'No components found',
        message: `No components found in category: ${category}`,
        availableCategories: [...new Set(Object.values(componentTemplates).map(c => c.category))]
      });
    }

    res.json({
      success: true,
      count: components.length,
      data: components
    });
  } catch (error) {
    console.error('Error fetching components by category:', error);
    res.status(500).json({ 
      error: 'Failed to fetch components',
      message: error.message
    });
  }
});

module.exports = router;
