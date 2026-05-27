// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

const LAB_USERS = ['alice', 'bob', 'admin'];
const DEFAULT_BALANCES = { alice: 1000, bob: 500, admin: 100 };

function ensureWallet(req) {
  if (!req.session.wallet) {
    req.session.wallet = { ...DEFAULT_BALANCES };
  }
}

function currentAccount(req) {
  if (req.session.user && req.session.user.username) {
    return req.session.user.username;
  }
  return 'alice';
}

router.get('/', (req, res) => {
  res.render('csrf/index', {
    title: 'Cross-Site Request Forgery',
    sessionUser: req.session.user || null,
  });
});

router.get('/transfer', (req, res) => {
  ensureWallet(req);
  const from = currentAccount(req);
  res.render('csrf/transfer', {
    title: 'Balance transfer (no CSRF token)',
    from,
    wallet: req.session.wallet,
    labUsers: LAB_USERS,
    message: req.query.msg || null,
    error: null,
    sessionUser: req.session.user || null,
  });
});

router.post('/transfer', (req, res) => {
  ensureWallet(req);
  const from = currentAccount(req);
  const to = String(req.body.to || '').trim().toLowerCase();
  const amount = parseInt(req.body.amount, 10);
  const wallet = req.session.wallet;

  if (!LAB_USERS.includes(to)) {
    return res.status(400).render('csrf/transfer', {
      title: 'Balance transfer (no CSRF token)',
      from,
      wallet,
      labUsers: LAB_USERS,
      message: null,
      error: `Unknown recipient "${to}". Use alice, bob, or admin.`,
      sessionUser: req.session.user || null,
    });
  }

  if (to === from) {
    return res.status(400).render('csrf/transfer', {
      title: 'Balance transfer (no CSRF token)',
      from,
      wallet,
      labUsers: LAB_USERS,
      message: null,
      error: 'Cannot transfer to yourself.',
      sessionUser: req.session.user || null,
    });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).render('csrf/transfer', {
      title: 'Balance transfer (no CSRF token)',
      from,
      wallet,
      labUsers: LAB_USERS,
      message: null,
      error: 'Amount must be a positive number.',
      sessionUser: req.session.user || null,
    });
  }

  if ((wallet[from] || 0) < amount) {
    return res.status(400).render('csrf/transfer', {
      title: 'Balance transfer (no CSRF token)',
      from,
      wallet,
      labUsers: LAB_USERS,
      message: null,
      error: `Insufficient balance for ${from}.`,
      sessionUser: req.session.user || null,
    });
  }

  wallet[from] -= amount;
  wallet[to] = (wallet[to] || 0) + amount;
  req.session.wallet = wallet;

  res.status(200).render('csrf/transfer', {
    title: 'Balance transfer (no CSRF token)',
    from,
    wallet: req.session.wallet,
    labUsers: LAB_USERS,
    message: `Transferred ${amount} lab credits from ${from} to ${to}. No CSRF token was required.`,
    error: null,
    sessionUser: req.session.user || null,
  });
});

module.exports = router;
