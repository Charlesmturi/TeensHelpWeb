const auth = async (req, res, next) => {
  // your authentication logic
  next();
};

module.exports = auth;