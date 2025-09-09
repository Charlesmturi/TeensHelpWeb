import React, { useState } from 'react';
import '../styles/pages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Contact Us</h1>
        <p className="page-subtitle">We're here to help and listen</p>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>support@teenhelpweb.com</p>
            </div>
            <div className="contact-item">
              <h3>📞 Phone</h3>
              <p>(555) 123-HELP</p>
            </div>
            <div className="contact-item">
              <h3>🕒 Hours</h3>
              <p>24/7 Support Available</p>
            </div>
            <div className="contact-item">
              <h3>📍 Address</h3>
              <p>123 Help Street<br />Support City, ST 12345</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;