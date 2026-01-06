const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/projects
 * Get all projects
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ 'metadata.updatedAt': -1 })
      .select('-__v');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      message: error.message
    });
  }
});

/**
 * GET /api/projects/:id
 * Get a specific project by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.id });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        message: `No project found with ID: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      message: error.message
    });
  }
});

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, prompt, generatedCode, components, metadata } = req.body;

    if (!name || !prompt || !generatedCode) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name, prompt, and generatedCode are required'
      });
    }

    const project = new Project({
      projectId: uuidv4(),
      name,
      description: description || prompt,
      prompt,
      generatedCode,
      components: components || [],
      metadata: {
        ...metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    await project.save();

    console.log(`✅ Project saved: ${project.name} (ID: ${project.projectId})`);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      error: 'Failed to create project',
      message: error.message
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update an existing project
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, description, generatedCode, components, metadata } = req.body;

    const project = await Project.findOne({ projectId: req.params.id });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        message: `No project found with ID: ${req.params.id}`
      });
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (generatedCode) project.generatedCode = generatedCode;
    if (components) project.components = components;
    if (metadata) {
      project.metadata = {
        ...project.metadata,
        ...metadata,
        updatedAt: new Date()
      };
    }

    await project.save();

    console.log(`✅ Project updated: ${project.name} (ID: ${project.projectId})`);

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ 
      error: 'Failed to update project',
      message: error.message
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ projectId: req.params.id });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        message: `No project found with ID: ${req.params.id}`
      });
    }

    console.log(`🗑️ Project deleted: ${project.name} (ID: ${project.projectId})`);

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: { projectId: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      error: 'Failed to delete project',
      message: error.message
    });
  }
});

module.exports = router;
