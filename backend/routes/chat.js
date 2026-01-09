const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Chat endpoint - handles both initial generation and modifications
router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await aiService.chatWebsite(conversationId, message);
    
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get conversation history
router.get('/conversation/:id', async (req, res) => {
  try {
    const Conversation = require('../models/Conversation');
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      conversationId: conversation._id,
      messages: conversation.messages,
      website: conversation.currentWebsite
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
