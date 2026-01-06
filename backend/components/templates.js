// Component templates that AI can use as references
const componentTemplates = {
  navbar: {
    name: 'Navigation Bar',
    description: 'Responsive navigation with logo and menu items',
    category: 'navigation',
    template: {
      html: `<nav class="navbar">
  <div class="nav-container">
    <a href="#" class="nav-logo">Logo</a>
    <button class="nav-toggle" aria-label="Toggle navigation">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <ul class="nav-menu">
      <li class="nav-item"><a href="#home" class="nav-link">Home</a></li>
      <li class="nav-item"><a href="#about" class="nav-link">About</a></li>
      <li class="nav-item"><a href="#services" class="nav-link">Services</a></li>
      <li class="nav-item"><a href="#contact" class="nav-link">Contact</a></li>
    </ul>
  </div>
</nav>`,
      css: `.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #007bff;
}

.nav-toggle {
  display: none;
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    gap: 4px;
  }
  
  .nav-toggle span {
    width: 25px;
    height: 3px;
    background: #333;
    transition: 0.3s;
  }
  
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    padding: 2rem;
    display: none;
  }
  
  .nav-menu.active {
    display: flex;
  }
}`
    }
  },

  hero: {
    name: 'Hero Section',
    description: 'Full-width hero section with heading, description, and CTA',
    category: 'header',
    template: {
      html: `<section class="hero">
  <div class="hero-container">
    <h1 class="hero-title">Welcome to Our Website</h1>
    <p class="hero-description">Create something amazing today</p>
    <button class="hero-cta">Get Started</button>
  </div>
</section>`,
      css: `.hero {
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
  animation: fadeInUp 0.8s ease-out;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-cta {
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`
    }
  },

  features: {
    name: 'Features Grid',
    description: 'Grid layout showcasing features or services',
    category: 'content',
    template: {
      html: `<section class="features">
  <div class="features-container">
    <h2 class="section-title">Our Features</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🚀</div>
        <h3 class="feature-title">Fast Performance</h3>
        <p class="feature-description">Lightning-fast load times and optimal performance</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3 class="feature-title">Beautiful Design</h3>
        <p class="feature-description">Modern and aesthetically pleasing interfaces</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3 class="feature-title">Responsive</h3>
        <p class="feature-description">Works perfectly on all devices and screen sizes</p>
      </div>
    </div>
  </div>
</section>`,
      css: `.features {
  padding: 5rem 2rem;
  background: #f8f9fa;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}`
    }
  },

  gallery: {
    name: 'Image Gallery',
    description: 'Responsive image gallery with grid layout',
    category: 'media',
    template: {
      html: `<section class="gallery">
  <div class="gallery-container">
    <h2 class="section-title">Gallery</h2>
    <div class="gallery-grid">
      <div class="gallery-item">
        <img src="https://via.placeholder.com/400x300" alt="Gallery image 1">
        <div class="gallery-overlay">
          <span class="gallery-title">Image 1</span>
        </div>
      </div>
      <div class="gallery-item">
        <img src="https://via.placeholder.com/400x300" alt="Gallery image 2">
        <div class="gallery-overlay">
          <span class="gallery-title">Image 2</span>
        </div>
      </div>
      <div class="gallery-item">
        <img src="https://via.placeholder.com/400x300" alt="Gallery image 3">
        <div class="gallery-overlay">
          <span class="gallery-title">Image 3</span>
        </div>
      </div>
      <div class="gallery-item">
        <img src="https://via.placeholder.com/400x300" alt="Gallery image 4">
        <div class="gallery-overlay">
          <span class="gallery-title">Image 4</span>
        </div>
      </div>
    </div>
  </div>
</section>`,
      css: `.gallery {
  padding: 5rem 2rem;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-title {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
}`
    }
  },

  contactForm: {
    name: 'Contact Form',
    description: 'Contact form with validation',
    category: 'form',
    template: {
      html: `<section class="contact">
  <div class="contact-container">
    <h2 class="section-title">Contact Us</h2>
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
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      <button type="submit" class="submit-btn">Send Message</button>
    </form>
  </div>
</section>`,
      css: `.contact {
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
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
  border-color: #667eea;
}

.submit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #5568d3;
}`,
      javascript: `document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you for your message! We will get back to you soon.');
  this.reset();
});`
    }
  },

  footer: {
    name: 'Footer',
    description: 'Website footer with links and social media',
    category: 'footer',
    template: {
      html: `<footer class="footer">
  <div class="footer-container">
    <div class="footer-section">
      <h3>About Us</h3>
      <p>We create amazing websites that help businesses grow.</p>
    </div>
    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3>Follow Us</h3>
      <div class="social-links">
        <a href="#" aria-label="Facebook">📘</a>
        <a href="#" aria-label="Twitter">🐦</a>
        <a href="#" aria-label="Instagram">📷</a>
        <a href="#" aria-label="LinkedIn">💼</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 Your Company. All rights reserved.</p>
  </div>
</footer>`,
      css: `.footer {
  background: #2c3e50;
  color: white;
  padding: 3rem 2rem 1rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  color: #fff;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #fff;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.social-links a:hover {
  transform: translateY(-3px);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #34495e;
  color: #bdc3c7;
}`
    }
  }
};

module.exports = componentTemplates;
