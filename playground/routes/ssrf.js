// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

const router = express.Router();

const MAX_BODY_CHARS = 8000;
const SAFE_TARGETS = [
  { label: 'Lab home', url: 'http://127.0.0.1:3000/' },
  { label: 'Exposure config (JSON)', url: 'http://127.0.0.1:3000/exposure/config' },
  { label: 'Health via same host', url: 'http://localhost:3000/' },
];

router.get('/', (req, res) => {
  res.render('ssrf/index', {
    title: 'Server-Side Request Forgery',
    safeTargets: SAFE_TARGETS,
  });
});

router.get('/fetch', async (req, res) => {
  const url = String(req.query.url || '').trim();

  if (!url) {
    return res.render('ssrf/fetch', {
      title: 'SSRF fetch',
      url: '',
      safeTargets: SAFE_TARGETS,
      status: null,
      contentType: null,
      bodyPreview: null,
      error: null,
    });
  }

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'VulnerablePlayground-SSRF-Lab/1.0' },
    });
    const text = await response.text();
    const preview =
      text.length > MAX_BODY_CHARS
        ? `${text.slice(0, MAX_BODY_CHARS)}\n\n… [truncated]`
        : text;

    res.render('ssrf/fetch', {
      title: 'SSRF fetch',
      url,
      safeTargets: SAFE_TARGETS,
      status: response.status,
      contentType: response.headers.get('content-type'),
      bodyPreview: preview,
      error: null,
    });
  } catch (err) {
    res.status(502).render('ssrf/fetch', {
      title: 'SSRF fetch',
      url,
      safeTargets: SAFE_TARGETS,
      status: null,
      contentType: null,
      bodyPreview: null,
      error: err.message,
    });
  }
});

module.exports = router;
