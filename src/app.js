const express = require('express');
const { createDatabase } = require('./database');

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createApp(db = createDatabase()) {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/tasks', (req, res) => {
    const rows = db.prepare('SELECT * FROM tasks ORDER BY id').all();
    res.json(rows.map(mapTask));
  });

  app.get('/api/tasks/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    if (!row) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json(mapTask(row));
  });

  app.post('/api/tasks', (req, res) => {
    const { title, completed = false } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = db
      .prepare('INSERT INTO tasks (title, completed) VALUES (?, ?)')
      .run(title.trim(), completed ? 1 : 0);
    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json(mapTask(row));
  });

  app.put('/api/tasks/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const title = req.body.title ?? existing.title;
    const completed = req.body.completed ?? Boolean(existing.completed);

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }

    db.prepare(
      `UPDATE tasks
       SET title = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(title.trim(), completed ? 1 : 0, req.params.id);

    const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    return res.json(mapTask(row));
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}

module.exports = { createApp };
