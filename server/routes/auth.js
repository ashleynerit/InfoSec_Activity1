import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Store from '../models/Store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, { subject: userId.toString(), expiresIn: '7d' });
}

function setAuthCookie(res, userId) {
  res.cookie('auth_token', createToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

router.post('/signup', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!name || !email || password.length < 8) {
      return res.status(400).json({ error: 'Name, email, and an 8-character password are required.' });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    await Store.create({ owner: user._id });
    setAuthCookie(res, user._id);

    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return res.status(500).json({ error: 'Account creation failed.', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  setAuthCookie(res, user._id);
  return res.json({ user: { id: user._id, name: user.name, email: user.email } });
});

router.post('/logout', requireAuth, (req, res) => {
  res.clearCookie('auth_token');
  res.status(204).end();
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: 'User no longer exists.' });
  return res.json({ user: { id: user._id, name: user.name, email: user.email } });
});

export default router;
