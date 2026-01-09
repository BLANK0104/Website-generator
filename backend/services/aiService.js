const Groq = require('groq-sdk');
const Conversation = require('../models/Conversation');

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async chatWebsite(conversationId, userMessage) {
    try {
      // Load or create conversation
      let conversation = conversationId ? await Conversation.findById(conversationId) : null;
      
      if (!conversation) {
        conversation = new Conversation({ messages: [] });
      }

      // Add user message
      conversation.messages.push({ role: 'user', content: userMessage });

      // Determine if this is initial generation or modification
      const isInitial = !conversation.currentWebsite || !conversation.currentWebsite.html;
      
      if (isInitial) {
        // Initial generation
        const result = await this.generateWebsite(userMessage);
        conversation.currentWebsite = result;
        conversation.messages.push({ role: 'assistant', content: `Created website for ${result.content.businessName}` });
      } else {
        // Modification
        const result = await this.modifyWebsite(conversation.currentWebsite, userMessage);
        conversation.currentWebsite = result;
        conversation.messages.push({ role: 'assistant', content: 'Updated website based on your feedback' });
      }

      conversation.updatedAt = new Date();
      await conversation.save();

      return {
        conversationId: conversation._id,
        website: {
          html: conversation.currentWebsite.html,
          css: conversation.currentWebsite.css,
          javascript: conversation.currentWebsite.javascript,
          components: conversation.currentWebsite.components,
          description: conversation.currentWebsite.description
        },
        messages: conversation.messages
      };
    } catch (error) {
      console.error('Chat Service Error:', error);
      throw new Error(`Failed to process chat: ${error.message}`);
    }
  }

  async modifyWebsite(currentWebsite, modification) {
    try {
      const modificationPrompt = `You are an expert web developer. Modify the existing website based on user feedback.

Current website:
HTML: ${currentWebsite.html.substring(0, 500)}...
CSS: ${currentWebsite.css.substring(0, 500)}...
Description: ${currentWebsite.description}

User modification request: "${modification}"

IMPORTANT: Make the exact changes requested. This could be:
- Content changes (text, images, colors)
- Structural changes (add/remove sections, layouts)
- Functionality changes (new features, game mechanics, interactions)
- Style changes (colors, fonts, animations)
- Complete redesigns

Return JSON with the COMPLETE modified code:
{
  "html": "complete updated HTML",
  "css": "complete updated CSS",
  "javascript": "complete updated JavaScript (if any)",
  "description": "description of changes made"
}`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: modificationPrompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const website = JSON.parse(completion.choices[0].message.content);
      console.log('🔄 Modification applied:', modification);
      
      return {
        html: website.html || currentWebsite.html,
        css: website.css || currentWebsite.css,
        javascript: website.javascript || currentWebsite.javascript || '',
        description: website.description || currentWebsite.description,
        content: currentWebsite.content
      };
    } catch (error) {
      throw new Error(`Failed to modify website: ${error.message}`);
    }
  }

  async generateWebsite(description) {
    try {
      const prompt = `You are an expert web developer. Generate a complete, functional website based on this request: "${description}"

IMPORTANT: Generate ANY type of website or web application requested - business sites, games, tools, interactive experiences, etc.

Requirements:
1. Generate complete, production-ready HTML, CSS, and JavaScript
2. All functionality must work (buttons, links, interactions, game mechanics, etc.)
3. For images: use https://images.unsplash.com/photo-[ID]?w=800&q=80 with real photo IDs, OR use placeholder colored divs
4. For interactive elements: include full JavaScript logic (event listeners, game loops, animations, etc.)
5. Make it visually appealing with modern design
6. Ensure all links are functional (use onclick, href="tel:", href="mailto:", or game controls)
7. For games: implement complete game logic with controls, scoring, collision detection, etc.
8. Be creative and match the user's vision exactly

Return JSON with:
{
  "html": "complete HTML code",
  "css": "complete CSS code",
  "javascript": "complete JavaScript code (if needed)",
  "description": "brief description of what was created"
}

Generate the complete website now:`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const website = JSON.parse(completion.choices[0].message.content);
      console.log('✅ Website generated:', website.description);
      
      return {
        html: website.html || '',
        css: website.css || '',
        javascript: website.javascript || '',
        description: website.description || description,
        content: { description }
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate website: ${error.message}`);
    }
  }


}


module.exports = new AIService();
