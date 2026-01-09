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
      const prompt = `You are a world-class web designer and developer. Create a STUNNING, MODERN, FULLY FUNCTIONAL website for: "${description}"

🎨 DESIGN EXCELLENCE - Make it VISUALLY SPECTACULAR:
- **Modern Gradients**: Use vibrant color gradients (linear-gradient(135deg, #667eea 0%, #764ba2 100%))
- **Glass Morphism**: backdrop-filter: blur(10px), semi-transparent backgrounds
- **Smooth Animations**: CSS transitions, transform effects, fade-in on scroll
- **Professional Shadows**: box-shadow: 0 10px 40px rgba(0,0,0,0.1)
- **Hover Effects**: Scale, lift, glow effects on interactive elements
- **Hero Section**: Full-screen with impressive background, bold typography
- **Modern Typography**: Large headings (3-4rem), clear hierarchy, line-height 1.6
- **Spacing**: Generous padding/margin, breathing room, max-width 1200px containers
- **Color Schemes**: Professional palettes - blues/purples OR orange/red OR green/teal

🚀 IMPRESSIVE FEATURES TO INCLUDE:
- Sticky navigation with backdrop blur on scroll
- Smooth scroll navigation between sections
- Animated counters or stats section
- Image cards with hover zoom effects
- Testimonial slider or carousel
- Contact form with validation
- Footer with social links
- Mobile hamburger menu
- Parallax scroll effects (CSS only, no external libs)
- Loading animations for images

⚠️ CRITICAL RULES - NO EXTERNAL LIBRARIES:
- **NO particles.js, THREE.js, or ANY external JS libraries**
- **Use ONLY vanilla JavaScript** - no jQuery, no frameworks
- **Use ONLY CSS animations** - no GSAP, no anime.js
- **Self-contained code** - everything must work standalone
- If you want particle effects, create them with vanilla JS canvas

✅ WORKING CODE REQUIREMENTS:

1. **HTML Structure**:
   - Include <!DOCTYPE html>, proper head with meta tags
   - Semantic HTML5 (header, nav, main, section, footer)
   - All sections with clear IDs for navigation

2. **ALL BUTTONS MUST WORK**:
   \`\`\`html
   <button onclick="smoothScroll('contact')">Contact</button>
   <a href="tel:+15551234567">📞 Call</a>
   <a href="mailto:email@example.com">✉️ Email</a>
   \`\`\`

3. **REAL IMAGES** - Use actual working URLs:
   \`\`\`html
   <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Food">
   <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80" alt="Jewelry">
   <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80" alt="Camera">
   \`\`\`

4. **COMPLETE JAVASCRIPT** - Define ALL functions used:
   \`\`\`javascript
   function smoothScroll(id) {
     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
   }
   
   function toggleMenu() {
     const menu = document.querySelector('.nav-menu');
     menu?.classList.toggle('active');
   }
   
   function handleSubmit(e) {
     e.preventDefault();
     alert('✅ Thank you! We will contact you soon.');
     e.target.reset();
   }
   
   // Add scroll animations
   document.addEventListener('DOMContentLoaded', () => {
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('fade-in');
         }
       });
     });
     document.querySelectorAll('section').forEach(el => observer.observe(el));
   });
   \`\`\`

5. **MODERN CSS** - Include these effects:
   \`\`\`css
   .fade-in {
     animation: fadeInUp 0.8s ease;
   }
   
   @keyframes fadeInUp {
     from { opacity: 0; transform: translateY(30px); }
     to { opacity: 1; transform: translateY(0); }
   }
   
   .card {
     transition: transform 0.3s, box-shadow 0.3s;
   }
   
   .card:hover {
     transform: translateY(-10px);
     box-shadow: 0 20px 40px rgba(0,0,0,0.2);
   }
   \`\`\`

🎨 RETURN FORMAT (JSON ONLY):
{
  "html": "complete HTML with <!DOCTYPE html>, head, body, ALL content",
  "css": "complete CSS with modern effects, gradients, animations",
  "javascript": "complete vanilla JS with ALL functions defined"
}

⚠️ Return ONLY pure JSON, no markdown, no \`\`\`json tags!

CREATE AN AMAZING WEBSITE NOW!`;

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
