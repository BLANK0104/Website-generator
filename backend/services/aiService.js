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
        conversation.messages.push({ role: 'assistant', content: `✅ Created ${result.description}` });
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

  async generateWebsite(description) {
    try {
      const contentPrompt = `Generate content for: "${description}"

Return JSON with:
{
  "businessName": "business name",
  "heroHeadline": "catchy headline",
  "heroSubheadline": "subheadline",
  "aboutText": "2-3 paragraphs about the business",
  "services": [
    {"name": "Service 1", "description": "details", "price": "$99"},
    {"name": "Service 2", "description": "details", "price": "$149"},
    {"name": "Service 3", "description": "details", "price": "$199"}
  ],
  "phone": "(555) 123-4567",
  "email": "contact@business.com",
  "address": "123 Main St, City, State",
  "category": "restaurant|jewelry|photography|gym|spa|business"
}`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: contentPrompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const content = JSON.parse(completion.choices[0].message.content);
      const website = this.buildTemplate(content);
      
      return {
        ...website,
        content,
        description: `professional website for ${content.businessName}`
      };
    } catch (error) {
      console.error('Generation Error:', error);
      throw new Error(`Failed to generate: ${error.message}`);
    }
  }

  async modifyWebsite(currentWebsite, modification) {
    try {
      const modificationPrompt = `You are an expert web developer. The user wants to modify their website.

CURRENT WEBSITE CODE:

HTML:
${currentWebsite.html}

CSS:
${currentWebsite.css}

JAVASCRIPT:
${currentWebsite.javascript || 'none'}

USER REQUEST: "${modification}"

INSTRUCTIONS:
1. Make the EXACT changes the user requested
2. Common requests: change colors, change text, add/remove sections, change layout, update images
3. For color changes: Find and replace hex codes in CSS (background, color properties)
4. For text changes: Update the specific text in HTML
5. For structure changes: Modify HTML structure and CSS accordingly
6. KEEP all working buttons and JavaScript functions intact unless specifically asked to change them
7. Return COMPLETE modified HTML, CSS, and JavaScript (not snippets)

Return JSON:
{
  "html": "complete updated HTML code",
  "css": "complete updated CSS code", 
  "javascript": "complete JavaScript code (keep existing if not changed)",
  "description": "brief description of what was changed"
}`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: modificationPrompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const modified = JSON.parse(completion.choices[0].message.content);
      
      return {
        html: modified.html || currentWebsite.html,
        css: modified.css || currentWebsite.css,
        javascript: modified.javascript || currentWebsite.javascript || '',
        components: currentWebsite.components,
        content: currentWebsite.content,
        description: modified.description || 'Updated website'
      };
    } catch (error) {
      console.error('Modification Error:', error);
      throw new Error(`Failed to modify: ${error.message}`);
    }
  }

  buildTemplate(content) {
    const imageMap = {
      restaurant: ['photo-1504674900247-0877df9cc836', 'photo-1555939594-58d7cb561ad1', 'photo-1540189549336-e6e99c3679fe'],
      jewelry: ['photo-1515562141207-7a88fb7ce338', 'photo-1535632066927-ab7c9ab60908', 'photo-1599643478518-a784e5dc4c8f'],
      photography: ['photo-1542038784456-1ea8e935640e', 'photo-1471341971476-ae15ff5dd4ea', 'photo-1452587925148-ce544e77e70d'],
      gym: ['photo-1534438327276-14e5300c3a48', 'photo-1517836357463-d25dfeac3438', 'photo-1571019614242-c5c5dee9f50b'],
      spa: ['photo-1544161515-4ab6ce6db874', 'photo-1552693673-1bf958298935', 'photo-1540555700478-4be289fbecef'],
      business: ['photo-1557804506-669a67965ba0', 'photo-1516802273409-68526ee1bdd6', 'photo-1497366216548-37526070297c']
    };

    const images = imageMap[content.category] || imageMap.business;
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.businessName}</title>
</head>
<body>
  <header>
    <nav>
      <div class="logo">${content.businessName}</div>
      <button class="mobile-toggle" onclick="toggleMenu()">☰</button>
      <div class="nav-menu" id="navMenu">
        <a onclick="smoothScroll('hero')">Home</a>
        <a onclick="smoothScroll('about')">About</a>
        <a onclick="smoothScroll('services')">Services</a>
        <a onclick="smoothScroll('contact')">Contact</a>
      </div>
    </nav>
  </header>

  <section id="hero" class="hero">
    <div class="hero-content">
      <h1>${content.heroHeadline}</h1>
      <p>${content.heroSubheadline}</p>
      <button onclick="smoothScroll('services')" class="cta-btn">Explore Services</button>
      <button onclick="smoothScroll('contact')" class="cta-btn secondary">Contact Us</button>
    </div>
    <img src="https://images.unsplash.com/${images[0]}?w=800&q=80" alt="Hero" class="hero-image">
  </section>

  <section id="about" class="about">
    <h2>About Us</h2>
    <div class="about-content">
      <img src="https://images.unsplash.com/${images[1]}?w=800&q=80" alt="About" class="about-image">
      <div class="about-text">
        <p>${content.aboutText}</p>
      </div>
    </div>
  </section>

  <section id="services" class="services">
    <h2>Our Services</h2>
    <div class="services-grid">
      ${content.services.map((service, i) => `
        <div class="service-card">
          <img src="https://images.unsplash.com/${images[i % images.length]}?w=800&q=80" alt="${service.name}">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <p class="price">${service.price}</p>
          <button class="service-btn" onclick="smoothScroll('contact')">Learn More</button>
        </div>
      `).join('')}
    </div>
  </section>

  <section id="contact" class="contact">
    <h2>Contact Us</h2>
    <div class="contact-container">
      <form onsubmit="handleSubmit(event)">
        <input type="text" placeholder="Your Name" required>
        <input type="email" placeholder="Your Email" required>
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
      
      <div class="contact-info">
        <h3>Get In Touch</h3>
        <p><strong>Phone:</strong> <a href="tel:${content.phone.replace(/[^\d]/g, '')}">${content.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${content.email}">${content.email}</a></p>
        <p><strong>Address:</strong> ${content.address}</p>
        
        <div class="social-links">
          <button class="social-btn" onclick="alert('Follow us on Facebook!')">Facebook</button>
          <button class="social-btn" onclick="alert('Follow us on Instagram!')">Instagram</button>
          <button class="social-btn" onclick="alert('Follow us on Twitter!')">Twitter</button>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <p>&copy; 2026 ${content.businessName}. All rights reserved.</p>
  </footer>
</body>
</html>`;

    const css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #fff;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
}

.nav-menu a:hover {
  opacity: 0.8;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}

.hero-image {
  max-width: 800px;
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.cta-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  margin: 0.5rem;
  font-weight: bold;
  transition: transform 0.3s;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.cta-btn.secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.about, .services, .contact {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
}

.about h2, .services h2, .contact h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #667eea;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.about-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.about-text p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.service-card h3 {
  padding: 1rem;
  color: #667eea;
}

.service-card p {
  padding: 0 1rem 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #764ba2;
}

.service-btn {
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 0.8rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, textarea {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.contact-info {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
}

.contact-info h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.contact-info p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.contact-info a {
  color: #667eea;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.social-btn {
  padding: 0.8rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.social-btn:hover {
  background: #764ba2;
}

footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }
  
  .nav-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #667eea;
    padding: 1rem;
  }
  
  .nav-menu.active {
    display: flex !important;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .about-content, .contact-container {
    grid-template-columns: 1fr;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}`;

    const javascript = `function smoothScroll(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleMenu() {
  const menu = document.getElementById('navMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

function handleSubmit(event) {
  event.preventDefault();
  alert('✅ Thank you! Your message has been sent successfully. We will get back to you soon!');
  event.target.reset();
}

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navMenu');
      if (menu) {
        menu.classList.remove('active');
      }
    });
  });
});`;

    return { html, css, javascript, components: ['Single Page Website'] };
  }
}

module.exports = new AIService();
