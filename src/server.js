const { createApp } = require('./app');
const { createDatabase } = require('./database');

const port = process.env.PORT || 3000;
const db = createDatabase();
const app = createApp(db);

app.listen(port, () => {
  console.log(`REST API listening on http://localhost:${port}`);
});
