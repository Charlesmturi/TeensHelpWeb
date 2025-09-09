import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ask.css';

const AskAnonymously = () => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/questions/all');
      setSubmittedQuestions(response.data.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question.trim()) {
      setLoading(true);
      setError('');

      try {
        const response = await axios.post('http://localhost:5000/api/questions/submit', {
          question: question.trim(),
          category
        });

        if (response.data.success) {
          setQuestion('');
          setCategory('general');
          // Refresh questions list
          fetchQuestions();
          
          // Show success message
          alert('Question submitted successfully! It will be answered soon.');
        }
      } catch (error) {
        console.error('Error submitting question:', error);
        setError('Failed to submit question. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const categories = [
    { value: 'general', label: 'General Questions' },
    { value: 'addiction', label: 'Addiction & Recovery' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'school', label: 'School & Education' },
    { value: 'family', label: 'Family Issues' }
  ];

  return (
    <div className="page-container">
      <div className="ask-container">
        <div className="ask-header">
          <h1>Ask Anonymously</h1>
          <p>Ask sensitive questions without revealing your identity. Get answers from verified professionals.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="ask-content">
          <div className="question-form-section">
            <form className="question-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category">Question Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={loading}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="question">Your Question (Anonymous)</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here... Remember, this is completely anonymous."
                  rows="6"
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="submit-question-btn"
                disabled={loading || !question.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Question'}
              </button>
            </form>

            <div className="safety-info">
              <h3>🔒 Your Privacy Matters</h3>
              <ul>
                <li>No personal information is collected</li>
                <li>Questions are answered by verified professionals</li>
                <li>All data is encrypted and secure</li>
                <li>You can delete your questions anytime</li>
              </ul>
            </div>
          </div>

          <div className="questions-list">
            <h2>Recent Questions & Answers</h2>
            
            {submittedQuestions.length === 0 ? (
              <div className="empty-state">
                <p>No questions yet. Be the first to ask!</p>
              </div>
            ) : (
              submittedQuestions.map((q) => (
                <div key={q._id} className="question-item">
                  <div className="question-meta">
                    <span className="category-badge">
                      {categories.find(c => c.value === q.category)?.label}
                    </span>
                    <span className="timestamp">
                      {new Date(q.createdAt).toLocaleString()}
                    </span>
                    <span className={`status ${q.status}`}>
                      {q.status}
                    </span>
                  </div>
                  
                  <div className="question-content">
                    <p><strong>Q:</strong> {q.question}</p>
                  </div>

                  {q.status === 'answered' && q.answer && (
                    <div className="answer-content">
                      <p><strong>A:</strong> {q.answer}</p>
                      <small className="answered-at">
                        Answered on {new Date(q.answeredAt).toLocaleString()}
                      </small>
                    </div>
                  )}

                  {q.status === 'pending' && (
                    <div className="pending-message">
                      <p>⏳ Your question is being reviewed by our team...</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="ask-footer">
          <div className="disclaimer">
            <h3>⚠️ Important Disclaimer</h3>
            <p>
              This service provides general advice and support. It is not a substitute for 
              professional medical or psychological care. If you're in crisis, please contact 
              emergency services or a mental health professional immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAnonymously;