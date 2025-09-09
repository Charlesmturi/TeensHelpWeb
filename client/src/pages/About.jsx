import React from 'react';
import '../styles/pages.css';

const About = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>About TeenHelp Web</h1>
        
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            TeenHelp Web was created by students who recognized the growing challenges 
            facing today's youth. We saw friends and peers struggling silently with 
            issues like addiction, mental health, and social pressures, often without 
            access to safe, judgment-free support.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-item">
              <h3>✅ Educate</h3>
              <p>Show the real dangers of drugs, porn, and other teen struggles</p>
            </div>
            <div className="mission-item">
              <h3>💙 Support</h3>
              <p>Provide anonymous help for those too scared to speak up</p>
            </div>
            <div className="mission-item">
              <h3>🚀 Empower</h3>
              <p>Offer real solutions, not just warnings</p>
            </div>
            <div className="mission-item">
              <h3>🌐 Innovate</h3>
              <p>Use technology to fix problems, not create more</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            We're a diverse group of student developers, mental health advocates, 
            and educators committed to making a difference. Our team includes 
            certified counselors and professionals who verify all content and 
            provide expert guidance.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Trust Us?</h2>
          <ul className="trust-list">
            <li>🔒 100% anonymous and confidential</li>
            <li>👥 Verified professional counselors</li>
            <li>📚 Evidence-based resources</li>
            <li>🎯 Youth-friendly approach</li>
            <li>🌍 Available 24/7</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;