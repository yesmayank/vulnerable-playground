// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

const FAKE_CONFIG = {
  app: 'vulnerable-playground-lab',
  environment: 'local-lab-only',
  version: '0.1.0',
  disclaimer: 'Fiction credentials for OWASP training — not real secrets',
  secrets: {
    aws_access_key_id: 'AKIAFAKEEXAMPLE000',
    aws_secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEKEY',
    stripe_secret_key: 'sk_test_51LabPlaceholder000000000000',
    jwt_signing_key: 'lab-jwt-signing-placeholder-do-not-use',
    database_password: 'lab_db_password_not_real',
  },
  database: {
    host: '127.0.0.1',
    port: 5432,
    name: 'playground_lab',
    user: 'lab_user',
    password: 'lab_password_placeholder',
  },
  oauth: {
    client_id: 'lab-oauth-client-id',
    client_secret: 'lab-oauth-client-secret-placeholder',
  },
};

router.get('/', (req, res) => {
  res.render('exposure/index', {
    title: 'Sensitive Data Exposure',
  });
});

router.get('/config', (req, res) => {
  res.json(FAKE_CONFIG);
});

module.exports = router;
