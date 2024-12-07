import rateLimit from 'express-rate-limit';

const friendRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `window` (here, per minute)
  message: 'Too many friend requests from this IP, please try again after a minute',
});

export default friendRequestLimiter;
