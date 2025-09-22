import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Teens Help Web</h3>
            <p>Providing a safe space for teenagers to find support, resources, and community.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/wellness-tips">Wellness Tips</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/live-chat">Live Chat</Link></li>
              <li><Link to="/ask-anonymously">Ask Anonymously</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Emergency Resources</h4>
            <ul className="emergency-contacts">
              <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
              <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
              <li><strong>Trevor Project:</strong> 1-866-488-7386</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Subscribe to Our Newsletter</h4>
            <p>Get updates on new resources and events</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} Teens Help Web. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;