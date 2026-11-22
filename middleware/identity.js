const jwt = require('jsonwebtoken');
const { Role } = require('./roles');

const SECRET = process.env.INTERNAL_JWT_SECRET;
if (!SECRET) throw new Error('INTERNAL_JWT_SECRET is not set');

const AUDIENCE = 'chat';

/// Requires all requests to be logged in
function identity(req, res, next) {
  const t = req.get('x-internal-auth');
  if (!t) return res.status(401).json({ message: 'Missing identity' });
  try {
    const p = jwt.verify(t, SECRET, {
      algorithms: ['HS256'],
      audience: AUDIENCE,
      issuer: 'gateway',
    });
    req.user = { id: p.id, email: p.email, role: p.role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid identity' });
  }
}

/// Requires the user to have exactly this role
const requireRole = (role) => (req, res, next) =>
  req.user?.role === role ? next() : res.status(403).json({ message: 'Forbidden' });

/// Requires admin (shortcut for the common case)
const requireAdmin = requireRole(Role.ADMIN);

module.exports = { identity, requireRole, requireAdmin, Role };
