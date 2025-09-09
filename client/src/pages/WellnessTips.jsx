// WellnessTips.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/wellness.css';

const WellnessTips = () => {
  const [tips, setTips] = useState([]);
  const [currentTip, setCurrentTip] = useState(null);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeTipId, setActiveTipId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [savedTips, setSavedTips] = useState([]);
  const [completedTips, setCompletedTips] = useState([]);
  const [streak, setStreak] = useState(0);
  
  const [newTip, setNewTip] = useState({
    title: '',
    content: '',
    category: 'mental-health',
    duration: '',
    difficulty: 'Beginner',
    tags: []
  });

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  useEffect(() => {
    fetchTips();
    fetchRandomTip();
    if (isAuthenticated) {
      fetchSavedTips();
      fetchCompletedTips();
    }
  }, [category, isAuthenticated]);

  const fetchTips = async () => {
    try {
      let url = `http://localhost:5000/api/wellness-tips?category=${category}`;
      if (searchQuery) {
        url = `http://localhost:5000/api/wellness-tips/search?q=${searchQuery}&category=${category}`;
        if (selectedTags.length > 0) {
          url += `&tags=${selectedTags.join(',')}`;
        }
      }
      
      const response = await axios.get(url);
      setTips(response.data.data);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomTip = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wellness-tips/random');
      setCurrentTip(response.data.data);
    } catch (error) {
      console.error('Error fetching random tip:', error);
    }
  };

  const fetchSavedTips = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wellness-tips/saved/tips', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedTips(response.data.data);
    } catch (error) {
      console.error('Error fetching saved tips:', error);
    }
  };

  const fetchCompletedTips = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wellness-tips/completed/tips', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompletedTips(response.data.data.completedTips);
      setStreak(response.data.data.streak.current);
    } catch (error) {
      console.error('Error fetching completed tips:', error);
    }
  };

  const handleLike = async (tipId) => {
    if (!isAuthenticated) {
      alert('Please login to like tips');
      return;
    }
    
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/wellness-tips/${tipId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the tip in the list
      setTips(tips.map(tip => 
        tip._id === tipId 
          ? { ...tip, likes: response.data.data.likes, isLiked: response.data.data.isLiked } 
          : tip
      ));
      
      // Update current tip if it's the one being liked
      if (currentTip && currentTip._id === tipId) {
        setCurrentTip({ 
          ...currentTip, 
          likes: response.data.data.likes,
          isLiked: response.data.data.isLiked 
        });
      }
    } catch (error) {
      console.error('Error liking tip:', error);
    }
  };

  const handleSave = async (tipId) => {
    if (!isAuthenticated) {
      alert('Please login to save tips');
      return;
    }
    
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/wellness-tips/${tipId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.data.isSaved) {
        setSavedTips([...savedTips, tipId]);
      } else {
        setSavedTips(savedTips.filter(id => id !== tipId));
      }
      
      // Update the tip in the list
      setTips(tips.map(tip => 
        tip._id === tipId 
          ? { ...tip, isSaved: response.data.data.isSaved } 
          : tip
      ));
    } catch (error) {
      console.error('Error saving tip:', error);
    }
  };

  const handleComplete = async (tipId) => {
    if (!isAuthenticated) {
      alert('Please login to track your progress');
      return;
    }
    
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/wellness-tips/${tipId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStreak(response.data.data.streak);
      setCompletedTips([...completedTips, { tipId, completedAt: new Date() }]);
      alert(`Great job! Your current streak: ${response.data.data.streak} days`);
    } catch (error) {
      console.error('Error completing tip:', error);
      alert(error.response?.data?.message || 'Error marking tip as completed');
    }
  };

  const handleCommentSubmit = async (tipId) => {
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    
    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }
    
    try {
      await axios.post(
        `http://localhost:5000/api/wellness-tips/${tipId}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCommentText('');
      alert('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSubmitTip = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/wellness-tips/submit', newTip, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Tip submitted successfully! It will be reviewed by our team.');
      setNewTip({
        title: '',
        content: '',
        category: 'mental-health',
        duration: '',
        difficulty: 'Beginner',
        tags: []
      });
      setShowSubmitForm(false);
      fetchTips();
    } catch (error) {
      console.error('Error submitting tip:', error);
      alert('Please login to submit a tip');
    }
  };

  const isTipSaved = (tipId) => savedTips.includes(tipId);
  const isTipCompletedToday = (tipId) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return completedTips.some(ct => 
      ct.tipId === tipId && 
      new Date(ct.completedAt).setHours(0, 0, 0, 0) === today
    );
  };

  const categories = [
    { value: 'all', label: 'All Tips' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'addiction', label: 'Addiction Recovery' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'physical-health', label: 'Physical Health' },
    { value: 'general', label: 'General Wellness' }
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const popularTags = ['mindfulness', 'exercise', 'sleep', 'nutrition', 'stress', 'anxiety', 'depression', 'recovery'];

  if (loading) {
    return <div className="page-container">Loading wellness tips...</div>;
  }

  return (
    <div className="page-container">
      <div className="wellness-container">
        <div className="wellness-header">
          <h1>Daily Wellness Tips</h1>
          <p>Small steps every day can lead to big changes in your well-being</p>
          
          {isAuthenticated && streak > 0 && (
            <div className="streak-counter">
              🔥 Current Streak: {streak} days
            </div>
          )}
          
          <button 
            className="submit-tip-btn"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
          >
            {showSubmitForm ? 'Cancel' : '➕ Suggest a Tip'}
          </button>
        </div>

        {showSubmitForm && (
          <div className="submit-tip-form">
            <h3>Suggest a Wellness Tip</h3>
            <form onSubmit={handleSubmitTip}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Tip Title"
                  value={newTip.title}
                  onChange={(e) => setNewTip({...newTip, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea
                  placeholder="Tip Content"
                  value={newTip.content}
                  onChange={(e) => setNewTip({...newTip, content: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <select
                    value={newTip.category}
                    onChange={(e) => setNewTip({...newTip, category: e.target.value})}
                  >
                    {categories.filter(c => c.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <select
                    value={newTip.difficulty}
                    onChange={(e) => setNewTip({...newTip, difficulty: e.target.value})}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Duration (e.g., 5 min)"
                    value={newTip.duration}
                    onChange={(e) => setNewTip({...newTip, duration: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma separated):</label>
                <input
                  type="text"
                  placeholder="e.g., mindfulness, stress-relief"
                  value={newTip.tags.join(', ')}
                  onChange={(e) => setNewTip({...newTip, tags: e.target.value.split(',').map(t => t.trim())})}
                />
                <div className="tag-suggestions">
                  {popularTags.map(tag => (
                    <span 
                      key={tag} 
                      className="tag-suggestion"
                      onClick={() => {
                        const updatedTags = newTip.tags.includes(tag) 
                          ? newTip.tags.filter(t => t !== tag)
                          : [...newTip.tags, tag];
                        setNewTip({...newTip, tags: updatedTags});
                      }}
                    >
                      {tag} {newTip.tags.includes(tag) ? '✓' : '+'}
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Submit for Review
              </button>
            </form>
          </div>
        )}

        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={fetchTips}>🔍 Search</button>
          </div>
          
          <div className="tags-filter">
            {popularTags.map(tag => (
              <span 
                key={tag}
                className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="tip-of-the-day">
          <h2>🌟 Tip of the Day</h2>
          {currentTip ? (
            <div className="current-tip">
              <h3>{currentTip.title}</h3>
              <p>{currentTip.content}</p>
              <div className="tip-meta">
                <span>⏱️ {currentTip.duration}</span>
                <span>📊 {currentTip.difficulty}</span>
                <span>🏷️ {categories.find(c => c.value === currentTip.category)?.label}</span>
                {currentTip.tags && currentTip.tags.length > 0 && (
                  <div className="tip-tags">
                    {currentTip.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="tip-actions">
                <button 
                  className={currentTip.isLiked ? 'liked' : ''}
                  onClick={() => handleLike(currentTip._id)}
                >
                  👍 {currentTip.likes?.length || 0}
                </button>
                {isAuthenticated && (
                  <>
                    <button 
                      className={isTipSaved(currentTip._id) ? 'saved' : ''}
                      onClick={() => handleSave(currentTip._id)}
                    >
                      ⭐ {isTipSaved(currentTip._id) ? 'Saved' : 'Save'}
                    </button>
                    <button 
                      className={isTipCompletedToday(currentTip._id) ? 'completed' : ''}
                      onClick={() => handleComplete(currentTip._id)}
                      disabled={isTipCompletedToday(currentTip._id)}
                    >
                      {isTipCompletedToday(currentTip._id) ? '✅ Completed' : 'Mark as Done'}
                    </button>
                  </>
                )}
              </div>
              
              {isAuthenticated && (
                <div className="comment-section">
                  <h4>Comments</h4>
                  <div className="comment-input">
                    <textarea
                      placeholder="Share your thoughts..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows="2"
                    />
                    <button onClick={() => handleCommentSubmit(currentTip._id)}>
                      Post Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading daily tip...</p>
          )}
          <button className="new-tip-btn" onClick={fetchRandomTip}>
            Get Another Tip
          </button>
        </div>

        <div className="wellness-content">
          <div className="categories-sidebar">
            <h3>Categories</h3>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={category === cat.value ? 'category-btn active' : 'category-btn'}
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
            
            {isAuthenticated && (
              <>
                <h3>My Wellness</h3>
                <button className="category-btn" onClick={fetchSavedTips}>
                  💾 Saved Tips ({savedTips.length})
                </button>
                <button className="category-btn" onClick={fetchCompletedTips}>
                  ✅ Completed Tips ({completedTips.length})
                </button>
              </>
            )}
          </div>

          <div className="tips-grid">
            <h2>Wellness Tips Library ({tips.length} tips)</h2>
            
            {tips.length === 0 ? (
              <div className="empty-state">
                <p>No tips found in this category.</p>
              </div>
            ) : (
              <div className="tips-list">
                {tips.map((tip) => (
                  <div key={tip._id} className={`tip-card ${tip.submittedBy?.role === 'counselor' || tip.submittedBy?.role === 'therapist' ? 'expert-tip' : ''}`}>
                    {tip.submittedBy?.role === 'counselor' || tip.submittedBy?.role === 'therapist' ? (
                      <div className="expert-badge">👑 Expert Tip</div>
                    ) : null}
                    
                    <div className="tip-header">
                      <h3>{tip.title}</h3>
                      <span className="category-badge">
                        {categories.find(c => c.value === tip.category)?.label}
                      </span>
                    </div>
                    <p>{tip.content}</p>
                    
                    {tip.tags && tip.tags.length > 0 && (
                      <div className="tip-tags">
                        {tip.tags.map(tag => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="tip-footer">
                      <span>⏱️ {tip.duration}</span>
                      <span>📊 {tip.difficulty}</span>
                      <span className="submitted-by">
                        By: {tip.submittedBy?.username || 'Anonymous'}
                        {tip.submittedBy?.role === 'counselor' || tip.submittedBy?.role === 'therapist' ? ' (Expert)' : ''}
                      </span>
                    </div>
                    
                    <div className="tip-actions">
                      <button 
                        className={tip.isLiked ? 'liked' : ''}
                        onClick={() => handleLike(tip._id)}
                      >
                        👍 {tip.likes?.length || 0}
                      </button>
                      
                      {isAuthenticated && (
                        <>
                          <button 
                            className={isTipSaved(tip._id) ? 'saved' : ''}
                            onClick={() => handleSave(tip._id)}
                          >
                            ⭐ {isTipSaved(tip._id) ? 'Saved' : 'Save'}
                          </button>
                          
                          <button 
                            className={isTipCompletedToday(tip._id) ? 'completed' : ''}
                            onClick={() => handleComplete(tip._id)}
                            disabled={isTipCompletedToday(tip._id)}
                          >
                            {isTipCompletedToday(tip._id) ? '✅' : 'Mark Done'}
                          </button>
                          
                          <button onClick={() => setActiveTipId(activeTipId === tip._id ? null : tip._id)}>
                            💬 Discuss
                          </button>
                        </>
                      )}
                    </div>
                    
                    {activeTipId === tip._id && (
                      <div className="comment-section">
                        <div className="comment-input">
                          <textarea
                            placeholder="Share your thoughts..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows="2"
                          />
                          <button onClick={() => handleCommentSubmit(tip._id)}>
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessTips;