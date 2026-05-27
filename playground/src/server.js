// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const path = require('path');
const express = require('express');
const session = require('express-session');
const { initDatabase } = require('./db');
const registerRoutes = require('../routes/index');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-in-lab-only';

const app = express();
const db = initDatabase();

app.locals.db = db;
app.locals.labName = 'Vulnerable Playground';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use((req, res, next) => {
  res.locals.title = app.locals.labName;
  res.locals.user = req.session.user || null;
  res.locals.modules = registerRoutes.moduleList;
  next();
});

app.get('/', (req, res) => {
  const users = db.prepare('SELECT id, username, role FROM users ORDER BY id').all();
  res.render('home', {
    title: 'Security Lab Home',
    users,
    modules: registerRoutes.moduleList,
  });
});

app.use(registerRoutes.router);

app.use((req, res) => {
  res.status(404).render('coming-soon', {
    title: 'Not Found',
    moduleName: 'Unknown',
    message: 'No lab module at this path.',
    path: req.originalUrl,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Lab listening on http://127.0.0.1:${PORT} (container bind 0.0.0.0:${PORT})`);
});
