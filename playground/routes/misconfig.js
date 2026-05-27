// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

const FAKE_ENV_SNAPSHOT = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  DATABASE_PATH: process.env.DATABASE_PATH || '/app/playground/data/lab.db',
  SESSION_SECRET: 'lab-placeholder-not-the-real-secret',
  AWS_ACCESS_KEY_ID: 'AKIAFAKEEXAMPLE000',
  AWS_SECRET_ACCESS_KEY: 'fake-secret-key-for-lab-only',
  STRIPE_API_KEY: 'sk_test_lab_placeholder_000000',
  INTERNAL_API_TOKEN: 'lab-internal-token-not-real',
};

function isDebugEnabled() {
  const value = String(process.env.DEBUG || '').toLowerCase();
  return value === 'true' || value === '1' || value === 'yes';
}

router.get('/', (req, res) => {
  res.render('misconfig/index', {
    title: 'Security Misconfiguration',
    debugEnabled: isDebugEnabled(),
  });
});

router.get('/debug', (req, res) => {
  const debugEnabled = isDebugEnabled();

  if (!debugEnabled) {
    return res.render('misconfig/debug', {
      title: 'Debug endpoint',
      debugEnabled: false,
      fakeEnv: null,
      stack: null,
      hint: 'Set environment variable DEBUG=true to enable verbose errors in this lab.',
    });
  }

  const probeError = new Error('Intentional debug probe — stack trace exposed for training');
  res.render('misconfig/debug', {
    title: 'Debug endpoint',
    debugEnabled: true,
    fakeEnv: FAKE_ENV_SNAPSHOT,
    stack: probeError.stack,
    hint: null,
  });
});

module.exports = router;
