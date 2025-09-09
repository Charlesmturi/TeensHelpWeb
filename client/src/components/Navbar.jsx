import React, { useState } from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items data
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Help Center', path: '/help-center' },
    { name: 'Resources', path: '/resources' },
    { name: 'Wellness Tips', path: '/wellness-tips' },
    { name: 'Ask Anonymously', path: '/ask-anonymously' },
    { name: 'Live Chat', path: '/live-chat' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login/Register', path: '/login' }
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <div className="navbar-brand">
              <span className="brand-text">Teens Help Web</span>
            </div>
            <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div className="navbar-center">
            <div className="search-bar">
              <input type="text" placeholder="Search resources, help topics..." />
              <button className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          
          <div className="navbar-right">
            <button className="emergency-button">
              <i className="fas fa-exclamation-circle"></i>
              Emergency Help
            </button>
          </div>
        </div>
      </nav>

      <div className={`navbar-secondary ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-tabs-container">
          <div className="nav-tabs">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`tab ${activeTab === item.name ? 'active' : ''}`}
                onClick={() => handleTabClick(item.name)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;