const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.secretKey);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.secretKey);
};

module.exports = { createToken, verifyToken };
