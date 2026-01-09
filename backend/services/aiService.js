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
        conversation.messages.push({ role: 'assistant', content: `✅ ${result.description}` });
      } else {
        // Modification
        const result = await this.modifyWebsite(conversation.currentWebsite, userMessage);
        conversation.currentWebsite = result;
        conversation.messages.push({ role: 'assistant', content: `✅ ${result.description}` });
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
HTML: ${currentWebsite.html.substring(0, 1000)}...
CSS: ${currentWebsite.css.substring(0, 500)}...
JavaScript: ${currentWebsite.javascript ? currentWebsite.javascript.substring(0, 500) : 'none'}...

User modification request: "${modification}"

CRITICAL RULES:
1. **Preserve Working Functionality**: Keep all working buttons, functions, event listeners
2. **Make Requested Changes**: Apply the exact modifications the user wants
3. **Maintain Code Quality**: Don't break existing features while adding new ones
4. **Complete Code**: Return FULL HTML/CSS/JS, not snippets
5. **Test Logic**: Ensure all onclick, href, and event listeners work

COMMON MODIFICATION TYPES:
- Color changes: Update CSS hex codes and gradients
- Content changes: Update text while keeping structure
- Feature additions: Add new sections/functionality
- Style changes: Modify layouts, fonts, spacing
- Bug fixes: Fix broken buttons or functionality

BUTTON REQUIREMENTS:
- All buttons need onclick="functionName()" or proper href
- All functions must be defined in JavaScript
- Use onclick="smoothScroll('id')" for navigation
- Use href="tel:", href="mailto:" for contact links

Return JSON with COMPLETE updated code:
{
  "html": "complete updated HTML",
  "css": "complete updated CSS",
  "javascript": "complete updated JavaScript with all functions",
  "description": "description of changes made"
}`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: modificationPrompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const website = JSON.parse(completion.choices[0].message.content);
      console.log('🔄 Modification applied:', modification);
      
      // Post-process modifications too
      const processedWebsite = this.postProcess(website);
      
      return {
        html: processedWebsite.html || currentWebsite.html,
        css: processedWebsite.css || currentWebsite.css,
        javascript: processedWebsite.javascript || currentWebsite.javascript || '',
        description: website.description || currentWebsite.description,
        content: currentWebsite.content
      };
    } catch (error) {
      throw new Error(`Failed to modify website: ${error.message}`);
    }
  }

  async generateWebsite(description) {
    try {
      // Detect the type of request
      const isGame = /game|play|interactive|animation|canvas/i.test(description);
      const isPortfolio = /portfolio|resume|cv|personal site/i.test(description);
      
      const prompt = isGame ? this.getGamePrompt(description) : 
                     isPortfolio ? this.getPortfolioPrompt(description) :
                     this.getGeneralPrompt(description);

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const website = JSON.parse(completion.choices[0].message.content);
      console.log('✅ Website generated:', website.description);
      
      // Post-process to ensure functionality
      const processedWebsite = this.postProcess(website);
      
      return {
        html: processedWebsite.html || '',
        css: processedWebsite.css || '',
        javascript: processedWebsite.javascript || '',
        description: website.description || description,
        content: { description }
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate website: ${error.message}`);
    }
  }

  getGamePrompt(description) {
    return `You are an expert game developer. Create a fully functional browser game: "${description}"

CRITICAL REQUIREMENTS:
1. **Complete Game Loop**: Use requestAnimationFrame for smooth animations
2. **Full Keyboard/Mouse Controls**: Add event listeners that actually work
3. **Game State Management**: Track score, lives, level, game over states
4. **Collision Detection**: Implement actual collision logic
5. **Visual Feedback**: Show score, animations, particle effects
6. **Start/Restart**: Include start button and game over screen with restart

WORKING CODE EXAMPLE STRUCTURE:
- Canvas-based games: Use <canvas id="game"></canvas> with proper 2D context
- JavaScript MUST include: game loop, update(), draw(), handleInput(), checkCollisions()
- All event listeners must be properly attached in DOMContentLoaded
- Use real math for physics (velocity, acceleration, gravity)

CREATIVITY BONUS:
- Add sound effects (optional, using Web Audio API)
- Add power-ups or special abilities
- Include particle effects for impacts/explosions
- Add smooth animations and transitions
- Create engaging visual design

Return JSON:
{
  "html": "complete HTML with canvas or game container",
  "css": "complete CSS with game styling",
  "javascript": "complete working JavaScript with game loop and all mechanics",
  "description": "what game was created"
}`;
  }

  getPortfolioPrompt(description) {
    return `You are an expert portfolio designer. Create a stunning, professional portfolio: "${description}"

CRITICAL REQUIREMENTS:
1. **Modern Design**: Use gradients, shadows, smooth animations
2. **Multiple Sections**: Hero, About, Skills, Projects, Contact
3. **Interactive Elements**: Smooth scrolling, hover effects, animated skill bars
4. **Working Links**: All buttons must use onclick="functionName()" or proper hrefs
5. **Responsive**: Mobile-friendly design with media queries
6. **Professional**: Clean, minimalist, impressive layout

WORKING BUTTON EXAMPLES YOU MUST USE:
- Navigation: <a href="#section" onclick="smoothScroll('section')">Link</a>
- Contact: <a href="mailto:email@example.com">Email</a>
- Phone: <a href="tel:+1234567890">Call</a>
- Social: <button onclick="openLink('https://github.com/username')">GitHub</button>
- Download CV: <button onclick="alert('CV Download Started!')">Download CV</button>

JAVASCRIPT MUST INCLUDE:
function smoothScroll(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
function openLink(url) {
  window.open(url, '_blank');
}

CREATIVITY BONUS:
- Animated skill bars that fill on scroll
- Parallax effects on hero section
- Typing animation for name/title
- Project cards with flip or zoom effects
- Animated background (particles, gradients)
- Dark/Light mode toggle

Return JSON:
{
  "html": "complete HTML with all sections",
  "css": "complete CSS with animations",
  "javascript": "complete working JavaScript with all interactions",
  "description": "portfolio features"
}`;
  }

  getGeneralPrompt(description) {
    return `You are an expert web developer. Create a complete, functional website: "${description}"

CRITICAL REQUIREMENTS:
1. **Working Buttons**: Every button MUST have onclick="functionName()" or proper href
2. **Proper Links**: Use href="tel:", href="mailto:", href="https://", or onclick events
3. **Real Images**: Use https://images.unsplash.com/photo-[ID]?w=800&q=80 with real IDs
4. **JavaScript Functions**: Define ALL functions that buttons call
5. **Event Listeners**: Attach in DOMContentLoaded or use inline onclick
6. **Modern Design**: Professional, clean, visually appealing

WORKING BUTTON EXAMPLES YOU MUST USE:
- Navigation: <button onclick="smoothScroll('section')">Go to Section</button>
- Links: <a href="tel:+1234567890">Call Now</a> or <a href="mailto:email@example.com">Email</a>
- External: <button onclick="window.open('https://example.com', '_blank')">Visit</button>
- Actions: <button onclick="handleAction()">Click Me</button>

JAVASCRIPT MUST INCLUDE:
- smoothScroll(id) function
- All functions referenced by onclick
- Form submission handlers
- Menu toggle for mobile

CREATIVITY BONUS:
- Add animations and transitions
- Include interactive elements
- Use modern design patterns
- Add micro-interactions
- Create engaging user experience

Return JSON:
{
  "html": "complete HTML with proper structure",
  "css": "complete CSS with modern styling",
  "javascript": "complete JavaScript with ALL functions defined",
  "description": "what was created"
}`;
  }

  postProcess(website) {
    let html = website.html || '';
    let js = website.javascript || '';
    
    // Ensure smoothScroll function exists if any onclick="smoothScroll(...)" found
    if (html.includes('smoothScroll(') && !js.includes('function smoothScroll')) {
      js += `\nfunction smoothScroll(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}\n`;
    }
    
    // Ensure openLink function exists if needed
    if (html.includes('openLink(') && !js.includes('function openLink')) {
      js += `\nfunction openLink(url) {
  window.open(url, '_blank');
}\n`;
    }
    
    // Ensure toggleMenu function exists if mobile menu present
    if (html.includes('toggleMenu()') && !js.includes('function toggleMenu')) {
      js += `\nfunction toggleMenu() {
  const menu = document.getElementById('menu') || document.querySelector('.nav-menu') || document.querySelector('nav ul');
  if (menu) menu.classList.toggle('active');
}\n`;
    }
    
    // Fix common button issues - convert href="#" to proper onclick
    html = html.replace(/href="#"([^>]*?)>/g, (match) => {
      if (!match.includes('onclick')) {
        return match.replace('href="#"', 'href="javascript:void(0)" onclick="alert(\'Feature coming soon!\')"');
      }
      return match;
    });
    
    // Wrap JavaScript in DOMContentLoaded if not already
    if (js && !js.includes('DOMContentLoaded') && !js.includes('window.onload')) {
      js = `document.addEventListener('DOMContentLoaded', function() {\n${js}\n});`;
    }
    
    return {
      html,
      css: website.css || '',
      javascript: js
    };
  }


}


module.exports = new AIService();
