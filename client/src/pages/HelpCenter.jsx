import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/helpcenter.css';

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('counselors');
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyResources, setNearbyResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Categories for different types of help
  const categories = [
    { id: 'counselors', label: '👥 Counselors', icon: '👥' },
    { id: 'hospitals', label: '🏥 Hospitals', icon: '🏥' },
    { id: 'rehab', label: '🏛️ Rehab Centers', icon: '🏛️' },
    { id: 'supportGroups', label: '🤝 Support Groups', icon: '🤝' },
    { id: 'crisis', label: '🚨 Crisis Centers', icon: '🚨' },
    { id: 'youth', label: '🎓 Youth Centers', icon: '🎓' }
  ];

  // Get user's current location
  const getLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchNearbyResources(latitude, longitude, activeCategory);
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Fetch nearby resources from backend
  const fetchNearbyResources = async (lat, lng, category) => {
    try {
      const response = await axios.get(`/api/help-center/nearby`, {
        params: { lat, lng, category, radius: 20 } // 20km radius
      });
      setNearbyResources(response.data.data);
    } catch (error) {
      setError('Failed to fetch nearby resources');
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (userLocation) {
      fetchNearbyResources(userLocation.latitude, userLocation.longitude, categoryId);
    }
  };

  // Sample resources data (will be replaced with actual API data)
  const sampleResources = {
    counselors: [
      { 
        name: "Youth Counseling Center", 
        distance: "1.2 km", 
        address: "123 Main St, City", 
        phone: "(555) 123-4567",
        hours: "Mon-Fri: 9AM-6PM",
        rating: 4.8,
        services: ["Individual Therapy", "Group Sessions", "Teen Support"]
      }
    ],
    hospitals: [
      { 
        name: "City General Hospital", 
        distance: "2.5 km", 
        address: "456 Hospital Rd, City", 
        phone: "(555) 911-HELP",
        hours: "24/7 Emergency",
        rating: 4.5,
        services: ["Emergency Care", "Mental Health Unit", "Crisis Intervention"]
      }
    ]
  };

  const resources = sampleResources[activeCategory] || [];

  return (
    <div className="page-container">
      <div className="help-center-container">
        {/* Header Section */}
        <div className="help-center-header">
          <h1>📍 Find Help Near You</h1>
          <p className="page-subtitle">
            Discover local support services, counselors, and emergency resources in your area
          </p>
          
          <button 
            className="location-btn"
            onClick={getLocation}
            disabled={loading}
          >
            {loading ? '🔍 Finding Location...' : '📍 Use My Location'}
          </button>

          {error && <div className="error-message">{error}</div>}
          {userLocation && (
            <div className="location-success">
              ✅ Location found! Showing resources within 20km
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className="tab-icon">{category.icon}</span>
              <span className="tab-label">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="resources-section">
          <h2>{categories.find(cat => cat.id === activeCategory)?.label} Nearby</h2>
          
          {loading ? (
            <div className="loading-spinner">🔄 Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <p>No resources found. Try enabling location services or search a different area.</p>
            </div>
          ) : (
            <div className="resources-grid">
              {resources.map((resource, index) => (
                <div key={index} className="resource-card">
                  <div className="resource-header">
                    <h3>{resource.name}</h3>
                    <span className="distance-badge">{resource.distance} away</span>
                  </div>
                  
                  <div className="resource-info">
                    <p className="address">📍 {resource.address}</p>
                    <p className="phone">📞 {resource.phone}</p>
                    <p className="hours">🕒 {resource.hours}</p>
                    
                    {resource.rating && (
                      <div className="rating">
                        ⭐ {resource.rating}/5.0
                      </div>
                    )}
                  </div>

                  {resource.services && (
                    <div className="services-list">
                      <h4>Services Offered:</h4>
                      <div className="services-tags">
                        {resource.services.map((service, i) => (
                          <span key={i} className="service-tag">{service}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="resource-actions">
                    <button className="action-btn directions">
                      🗺️ Get Directions
                    </button>
                    <button className="action-btn call">
                      📞 Call Now
                    </button>
                    <button className="action-btn website">
                      🌐 Visit Website
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Section */}
        <section className="emergency-section">
          <div className="emergency-header">
            <h2>🚨 Immediate Crisis Support</h2>
            <p>Available 24/7 • Confidential • Free</p>
          </div>
          
          <div className="emergency-grid">
            <div className="emergency-card critical">
              <h3>🆘 Emergency Services</h3>
              <p className="emergency-number">911</p>
              <p>For life-threatening emergencies</p>
            </div>
            
            <div className="emergency-card">
              <h3>📱 Crisis Text Line</h3>
              <p className="emergency-number">Text HOME to 741741</p>
              <p>Free, 24/7 text support</p>
            </div>
            
            <div className="emergency-card">
              <h3>📞 Suicide Prevention</h3>
              <p className="emergency-number">988</p>
              <p>National suicide prevention lifeline</p>
            </div>
            
            <div className="emergency-card">
              <h3>👥 Teen Helpline</h3>
              <p className="emergency-number">1-800-852-8336</p>
              <p>Specialized teen support</p>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="additional-resources">
          <h2>📚 Additional Support Resources</h2>
          <div className="resource-links">
            <a href="#" className="resource-link">📖 Addiction Recovery Guides</a>
            <a href="#" className="resource-link">💭 Mental Health Worksheets</a>
            <a href="#" className="resource-link">👨‍👩‍👧‍👦 Family Support Resources</a>
            <a href="#" className="resource-link">🎓 Educational Materials</a>
            <a href="#" className="resource-link">🔄 Self-Help Tools</a>
            <a href="#" className="resource-link">📅 Event Calendar</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;