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
      let conversation = conversationId ? await Conversation.findById(conversationId) : null;
      
      if (!conversation) {
        conversation = new Conversation({ messages: [] });
      }

      conversation.messages.push({ role: 'user', content: userMessage });

      const isInitial = !conversation.currentWebsite || !conversation.currentWebsite.html;
      
      if (isInitial) {
        const result = await this.generateWebsite(userMessage);
        conversation.currentWebsite = result;
        conversation.messages.push({ role: 'assistant', content: `✅ ${result.description}` });
      } else {
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
          description: conversation.currentWebsite.description
        },
        messages: conversation.messages
      };
    } catch (error) {
      console.error('Chat Service Error:', error);
      throw new Error(`Failed to process chat: ${error.message}`);
    }
  }

  async generateWebsite(description) {
    try {
      const prompt = `You are an expert full-stack web developer. Create a complete, fully functional, production-ready website based on this request: "${description}"

🎯 YOUR MISSION: Create the BEST possible website - be creative, add features, make it impressive!

📋 ABSOLUTE REQUIREMENTS:

1. **WORKING BUTTONS** - Every button MUST work:
   - Navigation buttons: onclick="smoothScroll('sectionId')"
   - External links: onclick="window.open('https://url.com', '_blank')"
   - Phone links: <a href="tel:+1234567890">Call Us</a>
   - Email links: <a href="mailto:email@example.com">Email Us</a>
   - Actions: onclick="handleAction()" (and define handleAction in JavaScript!)
   
2. **WORKING IMAGES** - Use REAL working image URLs:
   - Unsplash: https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80
   - OR placeholder: https://via.placeholder.com/800x600/667eea/ffffff?text=Image
   - NO broken image URLs!

3. **COMPLETE JAVASCRIPT** - Define ALL functions:
   \`\`\`javascript
   function smoothScroll(id) {
     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
   }
   
   function handleSubmit(e) {
     e.preventDefault();
     alert('✅ Form submitted successfully!');
     e.target.reset();
   }
   
   function toggleMenu() {
     document.querySelector('.nav-menu')?.classList.toggle('active');
   }
   \`\`\`

4. **MODERN DESIGN** - Make it beautiful:
   - Use gradients, shadows, animations
   - Responsive design with mobile menu
   - Smooth transitions and hover effects
   - Professional color schemes
   - Clean, modern layout

5. **BE CREATIVE** - Add impressive features:
   - Animated sections (fade in on scroll)
   - Particle backgrounds
   - Interactive elements
   - Smooth scrolling navigation
   - Contact forms that work
   - Social media buttons
   - Image galleries
   - Testimonials
   - Whatever makes it amazing!

📝 EXAMPLES OF PERFECT CODE:

HTML Button Examples:
\`\`\`html
<button onclick="smoothScroll('contact')" class="cta-button">Contact Us</button>
<a href="tel:+15551234567" class="phone-btn">📞 Call Now</a>
<a href="mailto:info@example.com" class="email-btn">✉️ Email Us</a>
<button onclick="window.open('https://github.com', '_blank')">Visit GitHub</button>
\`\`\`

Working Image Examples:
\`\`\`html
<img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Hero">
<img src="https://via.placeholder.com/400x300/667eea/ffffff?text=Service+1" alt="Service">
\`\`\`

🎨 RETURN FORMAT:
Return a JSON object with three fields:
{
  "html": "complete HTML code here",
  "css": "complete CSS code here", 
  "javascript": "complete JavaScript code here"
}

⚠️ CRITICAL: Return ONLY the JSON object, no markdown formatting, no \`\`\`json tags, just pure JSON!

NOW CREATE THE BEST WEBSITE POSSIBLE!`;

      const result = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.9,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });
      
      const website = JSON.parse(result.choices[0].message.content);
      console.log('✅ Website generated with Groq');
      
      // Post-process to ensure everything works
      const processedWebsite = this.postProcessWebsite(website);
      
      return {
        html: processedWebsite.html,
        css: processedWebsite.css,
        javascript: processedWebsite.javascript,
        description: this.extractDescription(processedWebsite.html, description)
      };
    } catch (error) {
      console.error('Generation Error:', error);
      throw new Error(`Failed to generate website: ${error.message}`);
    }
  }

  async modifyWebsite(currentWebsite, modification) {
    try {
      const prompt = `You are an expert web developer. Modify the existing website based on the user's request.

CURRENT WEBSITE CODE:
HTML (first 2000 chars): ${currentWebsite.html.substring(0, 2000)}...
CSS (first 1000 chars): ${currentWebsite.css.substring(0, 1000)}...
JavaScript: ${currentWebsite.javascript || 'none'}

USER REQUEST: "${modification}"

📋 MODIFICATION RULES:
1. Make EXACTLY the changes the user requested
2. Keep all working functionality (don't break existing buttons/features)
3. If changing colors: update CSS hex codes, gradients, backgrounds
4. If changing text: update HTML content
5. If adding features: add HTML structure, CSS styles, JavaScript functions
6. If changing layout: modify CSS grid/flexbox
7. Maintain responsive design

⚠️ CRITICAL: Return COMPLETE updated code, not just snippets!

🎨 RETURN FORMAT:
{
  "html": "COMPLETE updated HTML",
  "css": "COMPLETE updated CSS",
  "javascript": "COMPLETE updated JavaScript"
}

Return ONLY the JSON object, no markdown formatting!`;

      const result = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });
      
      const website = JSON.parse(result.choices[0].message.content);
      console.log('🔄 Website modified with Groq');
      
      const processedWebsite = this.postProcessWebsite(website);
      
      return {
        html: processedWebsite.html || currentWebsite.html,
        css: processedWebsite.css || currentWebsite.css,
        javascript: processedWebsite.javascript || currentWebsite.javascript,
        description: `Modified: ${modification}`
      };
    } catch (error) {
      console.error('Modification Error:', error);
      throw new Error(`Failed to modify website: ${error.message}`);
    }
  }

  postProcessWebsite(website) {
    let html = website.html || '';
    let css = website.css || '';
    let js = website.javascript || '';
    
    // Fix 1: Ensure smoothScroll function exists
    if (html.includes('smoothScroll(') && !js.includes('function smoothScroll')) {
      js += `\n\nfunction smoothScroll(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}\n`;
    }
    
    // Fix 2: Ensure toggleMenu function exists
    if ((html.includes('toggleMenu()') || html.includes('mobile-toggle')) && !js.includes('function toggleMenu')) {
      js += `\nfunction toggleMenu() {
  const menu = document.querySelector('.nav-menu') || document.querySelector('nav ul') || document.getElementById('menu');
  if (menu) {
    menu.classList.toggle('active');
  }
}\n`;
    }
    
    // Fix 3: Ensure form submit handlers exist
    if (html.includes('onsubmit=') && !js.includes('function handleSubmit')) {
      js += `\nfunction handleSubmit(event) {
  event.preventDefault();
  alert('✅ Thank you! Your message has been submitted successfully.');
  event.target.reset();
  return false;
}\n`;
    }
    
    // Fix 4: Fix broken image URLs
    html = html.replace(/src="https?:\/\/source\.unsplash\.com\/random/g, 'src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80');
    html = html.replace(/src="images\//g, 'src="https://via.placeholder.com/800x600/667eea/ffffff?text=Image');
    html = html.replace(/src="assets\//g, 'src="https://via.placeholder.com/800x600/667eea/ffffff?text=Image');
    html = html.replace(/src="\.\.\/images\//g, 'src="https://via.placeholder.com/800x600/667eea/ffffff?text=Image');
    
    // Fix 5: Convert href="#" to working links
    html = html.replace(/href="#"([^>]*?)>/g, (match) => {
      if (!match.includes('onclick') && !match.includes('data-')) {
        return match.replace('href="#"', 'href="javascript:void(0)" onclick="alert(\'Coming soon!\')"');
      }
      return match;
    });
    
    // Fix 6: Add DOMContentLoaded wrapper if JavaScript exists and doesn't have it
    if (js && !js.includes('DOMContentLoaded') && !js.includes('window.onload')) {
      const functionsOnly = js.match(/function\s+\w+/g);
      if (!functionsOnly || functionsOnly.length < 3) {
        js = `document.addEventListener('DOMContentLoaded', function() {\n${js}\n});\n`;
      }
    }
    
    // Fix 7: Ensure mobile responsiveness in CSS
    if (css && !css.includes('@media') && !css.includes('max-width')) {
      css += `\n\n@media (max-width: 768px) {
  .nav-menu { display: none; flex-direction: column; }
  .nav-menu.active { display: flex !important; }
  .mobile-toggle { display: block !important; }
  .container { padding: 1rem; }
  h1 { font-size: 2rem !important; }
}\n`;
    }
    
    return { html, css, javascript: js };
  }

  extractDescription(html, originalRequest) {
    // Try to extract title or first heading
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) return `Created: ${titleMatch[1]}`;
    
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) return `Created: ${h1Match[1].replace(/<[^>]*>/g, '')}`;
    
    return `Created website: ${originalRequest.substring(0, 50)}`;
  }
}

module.exports = new AIService();
