// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

const EXERCISES = [
  { slug: 'reflected', label: 'Reflected XSS', path: '/xss/reflected' },
  { slug: 'stored', label: 'Stored XSS (guestbook)', path: '/xss/stored' },
];

router.get('/', (req, res) => {
  res.render('xss/index', {
    title: 'Cross-Site Scripting (XSS)',
    exercises: EXERCISES,
    modules: res.locals.modules,
  });
});

router.get('/reflected', (req, res) => {
  const q = req.query.q ?? '';
  res.render('xss/reflected', {
    title: 'Reflected XSS',
    q,
    modules: res.locals.modules,
  });
});

router.get('/stored', (req, res) => {
  const comments = req.app.locals.db
    .prepare('SELECT id, author, body, created_at FROM comments ORDER BY id DESC')
    .all();

  res.render('xss/stored', {
    title: 'Stored XSS',
    comments,
    modules: res.locals.modules,
  });
});

router.post('/stored', (req, res) => {
  const comment = req.body.comment ?? '';
  const author = req.body.author ?? 'guest';

  if (comment.trim() !== '') {
    req.app.locals.db
      .prepare('INSERT INTO comments (author, body) VALUES (?, ?)')
      .run(author, comment);
  }

  res.redirect(302, '/xss/stored');
});

module.exports = router;
