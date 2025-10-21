
const express = require('express');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 8081;

// Serve static files (index.html, etc.) from the project root
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// CSV Writer setup
const csvWriter = createCsvWriter({
  path: path.join(__dirname, 'subscriber.csv'),
  header: [
    {id: 'name', title: 'Name'},
    {id: 'email', title: 'Email'},
    {id: 'timestamp', title: 'Timestamp'}
  ],
  append: true
});

app.post('/subscribe', async (req, res) => {
  const { name, email } = req.body;
  if (!email) {
    return res.status(400).json({ ok: false, message: 'Email is required' });
  }
  
  try {
    // Check if email already exists in CSV
    const csvPath = path.join(__dirname, 'subscriber.csv');
    let existingEmails = [];
    
    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').slice(1); // Skip header
      existingEmails = lines
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',');
          return parts[1]?.trim(); // Email is in second column
        });
    }
    
    // Check for duplicate
    if (existingEmails.includes(email)) {
      return res.status(409).json({ ok: false, message: 'This email is already subscribed!' });
    }
    
    // Save new subscription
    await csvWriter.writeRecords([
      { name: name || '', email, timestamp: new Date().toISOString() }
    ]);
    res.status(200).json({ ok: true, message: 'Thanks for subscribing!' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ ok: false, message: 'Failed to subscribe' });
  }
});

app.get('/health', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Static site and subscription API running on http://localhost:${PORT}`);
});
