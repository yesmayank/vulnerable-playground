// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const express = require('express');

/**
 * Shared stub router for lab modules not yet implemented.
 * @param {string} moduleName
 * @param {string[]} topics
 */
function createStubRouter(moduleName, topics = []) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('coming-soon', {
      title: moduleName,
      moduleName,
      message: `${moduleName} exercises are coming soon.`,
      path: req.baseUrl,
      topics,
    });
  });

  router.get(/.*/, (req, res) => {
    res.render('coming-soon', {
      title: moduleName,
      moduleName,
      message: 'This exercise is not implemented yet.',
      path: req.originalUrl,
      topics,
    });
  });

  return router;
}

module.exports = { createStubRouter };
