// Component Library - Reusable UI Components for Website Generation

const componentLibrary = {
  // Navigation Components
  navbar: {
    modern: {
      html: `
        <nav class="navbar">
          <div class="nav-container">
            <div class="nav-logo">{{siteName}}</div>
            <ul class="nav-menu">
              {{#navLinks}}
              <li class="nav-item"><a href="{{href}}" class="nav-link">{{text}}</a></li>
              {{/navLinks}}
            </ul>
            <div class="nav-toggle">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      `,
      css: `
        .navbar {
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }
        .nav-menu {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          text-decoration: none;
          color: #555;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: #007bff;
        }
        .nav-toggle {
          display: none;
          flex-direction: column;
          cursor: pointer;
        }
        .nav-toggle span {
          width: 25px;
          height: 3px;
          background: #333;
          margin: 3px 0;
          transition: 0.3s;
        }
        @media (max-width: 768px) {
          .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: #fff;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0,0,0,0.05);
            padding: 2rem 0;
          }
          .nav-menu.active {
            left: 0;
          }
          .nav-toggle {
            display: flex;
          }
        }
      `,
      js: `
        document.querySelector('.nav-toggle').addEventListener('click', function() {
          document.querySelector('.nav-menu').classList.toggle('active');
        });
      `
    }
  },

  // Hero Section Components
  hero: {
    centered: {
      html: `
        <section class="hero">
          <div class="hero-container">
            <h1 class="hero-title">{{title}}</h1>
            <p class="hero-subtitle">{{subtitle}}</p>
            <div class="hero-cta">
              {{#buttons}}
              <a href="{{href}}" class="btn btn-{{style}}">{{text}}</a>
              {{/buttons}}
            </div>
          </div>
        </section>
      `,
      css: `
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8rem 2rem;
          text-align: center;
        }
        .hero-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .hero {
            padding: 4rem 1rem;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
        }
      `
    },
    withImage: {
      html: `
        <section class="hero-image">
          <div class="hero-content">
            <div class="hero-text">
              <h1>{{title}}</h1>
              <p>{{subtitle}}</p>
              <div class="hero-cta">
                {{#buttons}}
                <a href="{{href}}" class="btn btn-{{style}}">{{text}}</a>
                {{/buttons}}
              </div>
            </div>
            <div class="hero-visual">
              <img src="{{imageUrl}}" alt="{{imageAlt}}">
            </div>
          </div>
        </section>
      `,
      css: `
        .hero-image {
          padding: 4rem 2rem;
          background: #f8f9fa;
        }
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-text h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        .hero-text p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
        }
        .hero-visual img {
          width: 100%;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .hero-text h1 {
            font-size: 1.8rem;
          }
        }
      `
    }
  },

  // Feature/Services Section
  features: {
    grid: {
      html: `
        <section class="features">
          <div class="features-container">
            <h2 class="section-title">{{title}}</h2>
            <p class="section-subtitle">{{subtitle}}</p>
            <div class="features-grid">
              {{#items}}
              <div class="feature-card">
                <div class="feature-icon">{{icon}}</div>
                <h3>{{title}}</h3>
                <p>{{description}}</p>
              </div>
              {{/items}}
            </div>
          </div>
        </section>
      `,
      css: `
        .features {
          padding: 5rem 2rem;
          background: #ffffff;
        }
        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        .section-subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 3rem;
          font-size: 1.1rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 10px;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .feature-card h3 {
          margin-bottom: 1rem;
          color: #333;
        }
        .feature-card p {
          color: #666;
          line-height: 1.6;
        }
      `
    }
  },

  // Contact Form Component
  contactForm: {
    standard: {
      html: `
        <section class="contact">
          <div class="contact-container">
            <h2 class="section-title">{{title}}</h2>
            <p class="section-subtitle">{{subtitle}}</p>
            <form class="contact-form" id="contactForm">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" required>
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
            <div id="formMessage" class="form-message"></div>
          </div>
        </section>
      `,
      css: `
        .contact {
          padding: 5rem 2rem;
          background: #f8f9fa;
        }
        .contact-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }
        .form-message {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 5px;
          display: none;
        }
        .form-message.success {
          background: #d4edda;
          color: #155724;
          display: block;
        }
        .form-message.error {
          background: #f8d7da;
          color: #721c24;
          display: block;
        }
      `,
      js: `
        document.getElementById('contactForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
          };
          
          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            });
            
            const messageDiv = document.getElementById('formMessage');
            if (response.ok) {
              messageDiv.className = 'form-message success';
              messageDiv.textContent = 'Message sent successfully!';
              document.getElementById('contactForm').reset();
            } else {
              messageDiv.className = 'form-message error';
              messageDiv.textContent = 'Failed to send message. Please try again.';
            }
          } catch (error) {
            document.getElementById('formMessage').className = 'form-message error';
            document.getElementById('formMessage').textContent = 'An error occurred. Please try again.';
          }
        });
      `,
      backend: {
        route: `
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Save to database
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      submittedAt: new Date()
    });
    
    await contact.save();
    
    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});
        `,
        model: `
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
        `
      }
    }
  },

  // Gallery Component
  gallery: {
    grid: {
      html: `
        <section class="gallery">
          <div class="gallery-container">
            <h2 class="section-title">{{title}}</h2>
            <div class="gallery-grid">
              {{#images}}
              <div class="gallery-item">
                <img src="{{url}}" alt="{{alt}}">
                <div class="gallery-overlay">
                  <p>{{caption}}</p>
                </div>
              </div>
              {{/images}}
            </div>
          </div>
        </section>
      `,
      css: `
        .gallery {
          padding: 5rem 2rem;
          background: #ffffff;
        }
        .gallery-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          cursor: pointer;
        }
        .gallery-item img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: white;
          padding: 2rem 1rem 1rem;
          transform: translateY(100%);
          transition: transform 0.3s;
        }
        .gallery-item:hover .gallery-overlay {
          transform: translateY(0);
        }
      `
    }
  },

  // Footer Component
  footer: {
    standard: {
      html: `
        <footer class="footer">
          <div class="footer-container">
            <div class="footer-content">
              <div class="footer-section">
                <h3>{{siteName}}</h3>
                <p>{{description}}</p>
              </div>
              <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  {{#links}}
                  <li><a href="{{href}}">{{text}}</a></li>
                  {{/links}}
                </ul>
              </div>
              <div class="footer-section">
                <h4>Contact</h4>
                <p>{{contact.email}}</p>
                <p>{{contact.phone}}</p>
              </div>
            </div>
            <div class="footer-bottom">
              <p>&copy; {{year}} {{siteName}}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      `,
      css: `
        .footer {
          background: #2c3e50;
          color: white;
          padding: 3rem 2rem 1rem;
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .footer-section h3,
        .footer-section h4 {
          margin-bottom: 1rem;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
        }
        .footer-section a {
          color: #bdc3c7;
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-section a:hover {
          color: white;
        }
        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
      `
    }
  },

  // Button Styles
  buttons: {
    css: `
      .btn {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-primary:hover {
        background: #0056b3;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,123,255,0.3);
      }
      .btn-secondary {
        background: transparent;
        color: white;
        border: 2px solid white;
      }
      .btn-secondary:hover {
        background: white;
        color: #007bff;
      }
      .btn-outline {
        background: transparent;
        color: #007bff;
        border: 2px solid #007bff;
      }
      .btn-outline:hover {
        background: #007bff;
        color: white;
      }
    `
  },

  // Base/Global Styles
  global: {
    css: `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }
    `
  }
};

module.exports = componentLibrary;
