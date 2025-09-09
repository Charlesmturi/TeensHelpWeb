const express = require('express');
const router = express.Router();

// Placeholder auth routes
router.post('/register', (req, res) => {
  res.json({ message: 'Registration will be implemented soon' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login will be implemented soon' });
});

module.exports = router;