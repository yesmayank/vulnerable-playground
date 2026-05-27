// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

const EXERCISES = [
  { slug: 'sql', label: 'SQL injection', path: '/injection/sql' },
  { slug: 'html', label: 'HTML injection', path: '/injection/html' },
];

router.get('/', (req, res) => {
  res.render('injection/index', {
    title: 'Injection',
    exercises: EXERCISES,
    modules: res.locals.modules,
  });
});

router.get('/sql', (req, res) => {
  const input = req.query.id ?? req.query.q ?? '';
  const query = `SELECT id, username, email, role FROM users WHERE id = ${input}`;
  let results = [];
  let error = null;

  if (input !== '') {
    try {
      results = req.app.locals.db.prepare(query).all();
    } catch (err) {
      error = err.message;
    }
  }

  res.render('injection/sql', {
    title: 'SQL injection',
    input,
    query,
    results,
    error,
    modules: res.locals.modules,
  });
});

router.get('/html', (req, res) => {
  const html = req.query.html ?? '';
  res.render('injection/html', {
    title: 'HTML injection',
    html,
    modules: res.locals.modules,
  });
});

router.post('/html', (req, res) => {
  const html = req.body.html ?? '';
  res.render('injection/html', {
    title: 'HTML injection',
    html,
    modules: res.locals.modules,
  });
});

module.exports = router;
