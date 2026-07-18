const test = require('node:test');
const assert = require('node:assert/strict');
const { createDatabase } = require('../src/database');

test('initializes a SQLite tasks table', () => {
  const db = createDatabase(':memory:');

  try {
    const result = db
      .prepare('INSERT INTO tasks (title, completed) VALUES (?, ?)')
      .run('Learn SQLite', 0);
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    assert.equal(row.title, 'Learn SQLite');
    assert.equal(row.completed, 0);
  } finally {
    db.close();
  }
});
