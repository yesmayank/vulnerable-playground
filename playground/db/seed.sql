-- Lab fiction credentials only — not real accounts
INSERT OR IGNORE INTO users (id, username, password, email, role) VALUES
  (1, 'alice', 'password', 'alice@lab.local', 'user'),
  (2, 'bob', 'password', 'bob@lab.local', 'user'),
  (3, 'admin', 'admin123', 'admin@lab.local', 'admin');

INSERT OR IGNORE INTO notes (id, user_id, title, body) VALUES
  (1, 1, 'Alice note', 'Private note for alice'),
  (2, 2, 'Bob note', 'Private note for bob');
