import React, { useState } from 'react';
import '../styles/pages.css';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    {
      category: 'Addiction Recovery',
      items: [
        { title: 'Understanding Substance Abuse', type: 'Article', length: '10 min' },
        { title: 'Recovery Journey Guide', type: 'PDF', length: '25 min' },
        { title: 'Coping with Cravings', type: 'Video', length: '15 min' }
      ]
    },
    {
      category: 'Mental Health',
      items: [
        { title: 'Anxiety Management Techniques', type: 'Article', length: '8 min' },
        { title: 'Mindfulness Meditation', type: 'Audio', length: '20 min' },
        { title: 'Building Self-Esteem', type: 'Article', length: '12 min' }
      ]
    },
    {
      category: 'Healthy Relationships',
      items: [
        { title: 'Setting Boundaries', type: 'Article', length: '7 min' },
        { title: 'Communication Skills', type: 'Video', length: '18 min' },
        { title: 'Recognizing Toxic Relationships', type: 'Article', length: '9 min' }
      ]
    }
  ];

  const filteredResources = resources.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Educational Resources</h1>
        <p className="page-subtitle">Trusted information to support your journey</p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="resources-container">
          {filteredResources.map((category, index) => (
            <div key={index} className="resource-category">
              <h2>{category.category}</h2>
              <div className="resource-items">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="resource-item">
                    <h3>{item.title}</h3>
                    <div className="resource-meta">
                      <span className="resource-type">{item.type}</span>
                      <span className="resource-length">{item.length}</span>
                    </div>
                    <button className="view-resource-btn">View Resource</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="resource-request">
          <h2>Can't find what you need?</h2>
          <p>Request specific resources or suggest topics you'd like us to cover.</p>
          <button className="request-btn">Request Resource</button>
        </section>
      </div>
    </div>
  );
};

export default Resources;