import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

// Utility function to generate JWT
const generateToken = (payload, secret, expiresIn = '1h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Function to generate token and set it in a cookie
export const generateTokenAndSetCookie = (userId, res) => {
  const token = generateToken({ userId }, ENV_VARS.JWT_SECRET, '15d');

  res.cookie('jwt-chat-token', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in ms
    httpOnly: true,
    sameSite: 'strict',
    secure: ENV_VARS.NODE_ENV !== 'development',
  });

  return token;
};

export default generateToken;
