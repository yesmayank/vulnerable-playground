// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('access/index', {
    title: 'Broken Access Control',
    sessionUser: req.session.user || null,
  });
});

router.get('/admin', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  res.render('access/admin', {
    title: 'Admin panel',
    sessionUser: req.session.user,
  });
});

module.exports = router;
