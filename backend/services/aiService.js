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
      const modificationPrompt = `Current website content:
${JSON.stringify(currentWebsite.content, null, 2)}

User wants to modify: "${modification}"

Return updated content JSON with same structure but incorporating the changes. Keep all existing fields unless specifically modified.`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: modificationPrompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const updatedContent = JSON.parse(completion.choices[0].message.content);
      const website = this.buildFromTemplate(updatedContent);
      website.content = updatedContent;
      
      return website;
    } catch (error) {
      throw new Error(`Failed to modify website: ${error.message}`);
    }
  }

  async generateWebsite(description) {
    try {
      const contentPrompt = `Based on this business: "${description}"

Generate realistic content (no HTML, just text):
1. Business name (e.g., "Marco's Italian Kitchen")
2. Hero headline (1 sentence)
3. Hero subheadline (1 sentence)
4. About text (2-3 paragraphs)
5. Three services/items: name, description, price
6. Phone: (555) XXX-XXXX
7. Email: businessname@example.com
8. Address: full address
9. Category: restaurant|jewelry|photography|gym|spa

Return JSON with these fields: businessName, heroHeadline, heroSubheadline, aboutText, services (array of {name, description, price}), phone, email, address, category`;

      const contentCompletion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: contentPrompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const content = JSON.parse(contentCompletion.choices[0].message.content);
      console.log('✅ Content generated:', content.businessName);

      const website = this.buildFromTemplate(content);
      website.content = content;
      return website;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate website: ${error.message}`);
    }
  }

  buildFromTemplate(content) {
    const imageMap = {
      restaurant: ['photo-1504674900247-0877df9cc836', 'photo-1555939594-58d7cb561ad1', 'photo-1540189549336-e6e99c3679fe'],
      jewelry: ['photo-1515562141207-7a88fb7ce338', 'photo-1535632066927-ab7c9ab60908', 'photo-1599643478518-a784e5dc4c8f'],
      photography: ['photo-1542038784456-1ea8e935640e', 'photo-1471341971476-ae15ff5dd4ea', 'photo-1452587925148-ce544e77e70d'],
      gym: ['photo-1534438327276-14e5300c3a48', 'photo-1517836357463-d25dfeac3438', 'photo-1571019614242-c5c5dee9f50b'],
      spa: ['photo-1544161515-4ab6ce6db874', 'photo-1552693673-1bf958298935', 'photo-1540555700478-4be289fbecef'],
      default: ['photo-1557804506-669a67965ba0', 'photo-1516802273409-68526ee1bdd6', 'photo-1518173946687-a4c8892bbd9f']
    };

    const images = imageMap[content.category] || imageMap.default;
    
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
        <a href="#hero" onclick="smoothScroll('hero')">Home</a>
        <a href="#about" onclick="smoothScroll('about')">About</a>
        <a href="#services" onclick="smoothScroll('services')">Services</a>
        <a href="#contact" onclick="smoothScroll('contact')">Contact</a>
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
    <img src="https://images.unsplash.com/${images[0]}?w=1200&q=80" alt="${content.businessName}" class="hero-image">
  </section>

  <section id="about" class="about">
    <h2>About Us</h2>
    <div class="about-content">
      <img src="https://images.unsplash.com/${images[1]}?w=600&q=80" alt="About" class="about-image">
      <div class="about-text">
        <p>${content.aboutText}</p>
      </div>
    </div>
  </section>

  <section id="services" class="services">
    <h2>Our Services</h2>
    <div class="services-grid">
      ${content.services.map((service, index) => `
        <div class="service-card">
          <img src="https://images.unsplash.com/${images[index % images.length]}?w=400&q=80" alt="${service.name}">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <p class="price">${service.price}</p>
          <button onclick="smoothScroll('contact')" class="service-btn">Book Now</button>
        </div>
      `).join('')}
    </div>
  </section>

  <section id="contact" class="contact">
    <h2>Get In Touch</h2>
    <div class="contact-container">
      <form id="contactForm" onsubmit="handleSubmit(event)">
        <input type="text" placeholder="Your Name" required>
        <input type="email" placeholder="Your Email" required>
        <input type="tel" placeholder="Your Phone" required>
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
      <div class="contact-info">
        <h3>Contact Information</h3>
        <p><strong>📞 Phone:</strong> <a href="tel:${content.phone.replace(/[^0-9]/g, '')}">${content.phone}</a></p>
        <p><strong>📧 Email:</strong> <a href="mailto:${content.email}">${content.email}</a></p>
        <p><strong>📍 Address:</strong> ${content.address}</p>
        <div class="social-links">
          <a href="#" onclick="alert('Connect with us on Facebook!'); return false;" class="social-btn">📘 Facebook</a>
          <a href="#" onclick="alert('Follow us on Instagram!'); return false;" class="social-btn">📷 Instagram</a>
          <a href="#" onclick="alert('Follow us on Twitter!'); return false;" class="social-btn">🐦 Twitter</a>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <p>&copy; 2026 ${content.businessName}. All rights reserved.</p>
  </footer>
</body>
</html>`;

    const css = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 0; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
nav { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; }
.logo { font-size: 1.5rem; font-weight: bold; }
.mobile-toggle { display: none; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.nav-menu { display: flex; gap: 2rem; }
.nav-menu a { color: white; text-decoration: none; font-weight: 500; cursor: pointer; transition: opacity 0.3s; }
.nav-menu a:hover { opacity: 0.8; }
.hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center; min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.hero p { font-size: 1.3rem; margin-bottom: 2rem; }
.hero-image { max-width: 800px; width: 100%; height: 400px; object-fit: cover; border-radius: 10px; margin-top: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.cta-btn { background: white; color: #667eea; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 50px; cursor: pointer; margin: 0.5rem; font-weight: bold; transition: transform 0.3s; }
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
.cta-btn.secondary { background: transparent; border: 2px solid white; color: white; }
.about, .services, .contact { max-width: 1200px; margin: 4rem auto; padding: 2rem; }
.about h2, .services h2, .contact h2 { text-align: center; font-size: 2.5rem; margin-bottom: 2rem; color: #667eea; }
.about-content { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.about-image { width: 100%; height: 400px; object-fit: cover; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
.about-text p { font-size: 1.1rem; margin-bottom: 1rem; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.service-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1); transition: transform 0.3s; }
.service-card:hover { transform: translateY(-5px); }
.service-card img { width: 100%; height: 250px; object-fit: cover; }
.service-card h3 { padding: 1rem; color: #667eea; }
.service-card p { padding: 0 1rem 1rem; }
.price { font-size: 1.5rem; font-weight: bold; color: #764ba2; }
.service-btn { width: calc(100% - 2rem); margin: 1rem; padding: 0.8rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: bold; }
.contact-container { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
form { display: flex; flex-direction: column; gap: 1rem; }
input, textarea { padding: 1rem; border: 2px solid #ddd; border-radius: 5px; font-size: 1rem; font-family: inherit; }
input:focus, textarea:focus { outline: none; border-color: #667eea; }
.submit-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 1rem; font-size: 1.1rem; border-radius: 5px; cursor: pointer; font-weight: bold; }
.contact-info { background: #f8f9fa; padding: 2rem; border-radius: 10px; }
.contact-info h3 { color: #667eea; margin-bottom: 1rem; }
.contact-info p { margin-bottom: 1rem; font-size: 1.1rem; }
.contact-info a { color: #667eea; text-decoration: none; }
.contact-info a:hover { text-decoration: underline; }
.social-links { display: flex; gap: 1rem; margin-top: 2rem; }
.social-btn { padding: 0.8rem 1.5rem; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
.social-btn:hover { background: #764ba2; }
footer { background: #333; color: white; text-align: center; padding: 2rem; margin-top: 4rem; }
@media (max-width: 768px) {
  .mobile-toggle { display: block; }
  .nav-menu { display: none; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: #667eea; padding: 1rem; }
  .nav-menu.active { display: flex !important; }
  .hero h1 { font-size: 2rem; }
  .about-content, .contact-container { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: 1fr; }
}`;

    const javascript = `function smoothScroll(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleMenu() {
  document.getElementById('navMenu').classList.toggle('active');
}

function handleSubmit(event) {
  event.preventDefault();
  alert('✅ Thank you! Your message has been sent successfully. We will get back to you soon!');
  event.target.reset();
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('navMenu').classList.remove('active'));
  });
});`;

    return {
      html,
      css,
      javascript,
      components: ['Single Page Website'],
      description: `Professional website for ${content.businessName}`
    };
  }
}

module.exports = new AIService();
