const setRateLimit = require("express-rate-limit");

const rateLimiter = setRateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: "You have exceeded your 15 requests per minute limit.",
  headers: true,
});

module.exports = rateLimiter;