// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const routesDir = __dirname;
const SKIP_FILES = new Set(['index.js']);

const MODULE_LABELS = {
  injection: 'Injection',
  xss: 'Cross-Site Scripting (XSS)',
  auth: 'Broken Authentication',
  idor: 'Insecure Direct Object Reference',
  access: 'Broken Access Control',
  csrf: 'Cross-Site Request Forgery',
  ssrf: 'Server-Side Request Forgery',
  misconfig: 'Security Misconfiguration',
  exposure: 'Sensitive Data Exposure',
};

const moduleList = [];

fs.readdirSync(routesDir)
  .filter(
    (file) =>
      file.endsWith('.js') &&
      !SKIP_FILES.has(file) &&
      !file.startsWith('_'),
  )
  .sort()
  .forEach((file) => {
    const slug = file.replace(/\.js$/, '');
    const mountPath = `/${slug}`;
    const routeModule = require(path.join(routesDir, file));

    moduleList.push({
      slug,
      label: MODULE_LABELS[slug] || slug,
      basePath: mountPath,
    });

    router.use(mountPath, routeModule);
  });

module.exports = {
  router,
  moduleList,
};
