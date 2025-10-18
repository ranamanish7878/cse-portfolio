const express = require('express');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow CORS for local testing (be conservative in production)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const CSV_PATH = path.join(__dirname, 'subscriber.csv');

// Ensure CSV file exists with header
if (!fs.existsSync(CSV_PATH)) {
  const header = 'timestamp,name,email\n';
  fs.writeFileSync(CSV_PATH, header, { encoding: 'utf8' });
}

const csvWriter = createObjectCsvWriter({
  path: CSV_PATH,
  header: [
    { id: 'timestamp', title: 'timestamp' },
    { id: 'name', title: 'name' },
    { id: 'email', title: 'email' }
  ],
  append: true
});

app.post('/subscribe', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ ok: false, message: 'Email is required' });
    }

    const record = [{ timestamp: new Date().toISOString(), name: name || '', email }];
    await csvWriter.writeRecords(record);

    return res.json({ ok: true, message: 'Thanks for subscribing!' });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

// Simple health endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

// Serve static files (optional) — keep existing static index.html served by live-server in dev
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Subscription server listening on http://localhost:${PORT}`);
});
