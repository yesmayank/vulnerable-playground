// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

function getDb(req) {
  return req.app.locals.db;
}

router.get('/', (req, res) => {
  res.render('idor/index', {
    title: 'Insecure Direct Object Reference',
    sessionUser: req.session.user || null,
  });
});

router.get('/profile', (req, res) => {
  const userId = req.query.userId;
  const db = getDb(req);

  if (userId === undefined || userId === '') {
    return res.status(400).render('idor/profile', {
      title: 'Profile (IDOR)',
      error: 'Provide ?userId= (e.g. 1, 2, 3) — no ownership check is performed.',
      profile: null,
      requestedUserId: null,
      sessionUser: req.session.user || null,
    });
  }

  const profile = db
    .prepare(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    )
    .get(userId);

  if (!profile) {
    return res.status(404).render('idor/profile', {
      title: 'Profile (IDOR)',
      error: `No user with id=${userId}`,
      profile: null,
      requestedUserId: userId,
      sessionUser: req.session.user || null,
    });
  }

  res.render('idor/profile', {
    title: 'Profile (IDOR)',
    error: null,
    profile,
    requestedUserId: userId,
    sessionUser: req.session.user || null,
  });
});

module.exports = router;
