const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log('Token verified:', decoded); 
    next();
  } catch (err) {
    console.log('Invalid token');
    res.status(403).json({ error: 'Your session has expired. Please log in again.' });
  }
};
