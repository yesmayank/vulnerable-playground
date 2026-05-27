// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

const LAB_CREDENTIALS = [
  { username: 'alice', password: 'password', role: 'user' },
  { username: 'bob', password: 'password', role: 'user' },
  { username: 'admin', password: 'admin123', role: 'admin' },
];

function getDb(req) {
  return req.app.locals.db;
}

router.get('/', (req, res) => {
  res.render('auth/index', {
    title: 'Broken Authentication',
    sessionUser: req.session.user || null,
  });
});

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: null,
    success: req.query.ok === '1',
    labCredentials: LAB_CREDENTIALS,
    sessionUser: req.session.user || null,
  });
});

router.post('/login', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const db = getDb(req);

  const user = db
    .prepare('SELECT id, username, password, email, role FROM users WHERE username = ?')
    .get(username);

  if (!user || user.password !== password) {
    return res.status(401).render('auth/login', {
      title: 'Login',
      error: 'Invalid username or password. No lockout — try again.',
      success: false,
      labCredentials: LAB_CREDENTIALS,
      sessionUser: req.session.user || null,
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
  };

  res.redirect('/auth/login?ok=1');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.get('/register', (req, res) => {
  res.render('auth/register', {
    title: 'Register (stub)',
  });
});

module.exports = router;
