import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or has expired.' });
  }
}
