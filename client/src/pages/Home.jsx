import React from 'react';
import '../styles/main.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Your Safe Space Awaits</h1>
        <p>Anonymous support, professional guidance, and a community that understands what you're going through</p>
        <button className="cta-button">Start Your Journey</button>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-number">10,000+</div>
          <div className="stat-label">Teens Helped</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Anonymous</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">50+</div>
          <div className="stat-label">Professional Experts</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>🔒 Anonymous Q&A</h3>
          <p>Ask sensitive questions about addiction, mental health, relationships, and more without ever revealing your identity</p>
        </div>
        <div className="feature-card">
          <h3>👥 Professional Support</h3>
          <p>Connect with licensed counselors, therapists, and addiction specialists who understand teen-specific challenges</p>
        </div>
        <div className="feature-card">
          <h3>📚 Educational Resources</h3>
          <p>Access curated content, daily wellness tips, and interactive tools to build healthy coping mechanisms</p>
        </div>
        <div className="feature-card">
          <h3>💬 Live Community</h3>
          <p>Join a supportive community of peers who are facing similar challenges and working toward recovery</p>
        </div>
        <div className="feature-card">
          <h3>🚨 Crisis Support</h3>
          <p>Immediate access to emergency resources and hotlines when you need help right away</p>
        </div>
        <div className="feature-card">
          <h3>📱 Always Accessible</h3>
          <p>Get help anytime, anywhere through our secure mobile-friendly platform</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <h2>Our Promise to You</h2>
        <p>
          We believe every teenager deserves a safe space to seek help without judgment. 
          Our platform combines cutting-edge technology with human compassion to provide 
          education, support, and empowerment for teens facing drug abuse, pornography addiction, 
          mental health challenges, and the complexities of modern adolescence.
        </p>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Voices of Hope</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "This platform saved my life. I finally found the courage to ask for help with my addiction."
            </p>
            <div className="testimonial-author">- Anonymous, 17</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "The anonymous feature made me feel safe enough to open up about things I've never told anyone."
            </p>
            <div className="testimonial-author">- M., 16</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "Professional help that actually understands what it's like to be a teen today."
            </p>
            <div className="testimonial-author">- J., 15</div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="emergency-banner">
        <h3>🚨 Need Immediate Help?</h3>
        <p>If you're in crisis or having thoughts of self-harm, please reach out now:</p>
        <div className="emergency-number">1-800-273-TALK (8255)</div>
        <p>Available 24/7 • Confidential • Free</p>
      </section>
    </div>
  );
};

export default Home;