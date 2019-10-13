const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const withAuth = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}

const User = require("./models/User")
const withHouse = function(req, res, next) {
  const { email } = req;
  if (!email) res.status(401).send('Unauthorized: No user found')
  User.foundOne({ email })
    .populate('house')
    .exec((err, user) => {
      if(err) res.status(404).send("Couldn't find user")
      req.house = user.house._id;
      next();
    });
}
module.exports = { withAuth, withHouse };