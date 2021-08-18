const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
