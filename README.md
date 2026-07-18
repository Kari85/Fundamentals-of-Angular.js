# Node.js Express SQLite REST API

This project contains a small REST API built with Node.js, Express, and SQLite. It manages a simple `tasks` resource and stores data in a local SQLite database.

## Setup

```bash
npm install
```

## Run the API

```bash
npm start
```

The server starts on `http://localhost:3000` by default. Set `PORT` to use a different port and `DATABASE_FILE` to choose a different SQLite file.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Check whether the API is running. |
| GET | `/api/tasks` | List all tasks. |
| GET | `/api/tasks/:id` | Fetch one task. |
| POST | `/api/tasks` | Create a task with `title` and optional `completed`. |
| PUT | `/api/tasks/:id` | Update a task's `title` and/or `completed` state. |
| DELETE | `/api/tasks/:id` | Delete a task. |

## Example request

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn SQLite","completed":false}'
```

## Tests

```bash
npm test
```
