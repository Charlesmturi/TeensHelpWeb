import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import LoginRegister from './pages/LoginRegister';
import Resources from './pages/Resources';
import LiveChat from './pages/LiveChat';
import AskAnonymously from './pages/AskAnonymously';
import WellnessTips from './pages/WellnessTips';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/live-chat" element={<LiveChat />} />
          <Route path="/ask-anonymously" element={<AskAnonymously />} />
          <Route path="/wellness-tips" element={<WellnessTips />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;