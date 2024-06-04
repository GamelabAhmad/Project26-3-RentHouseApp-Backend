const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret', (err, user) => {
      if (err) res.status(403).json('Token is not valid!');
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json('You are not authenticated!');
  }
};

const verifyIsPemilik = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === 'pemilik') {
      next();
    } else {
      res.status(403).json('You are not pemilik!');
    }
  });
};

module.exports = { verifyToken, verifyIsPemilik };
