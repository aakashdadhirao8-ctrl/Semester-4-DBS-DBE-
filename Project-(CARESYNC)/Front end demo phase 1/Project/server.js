import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// Fixes __dirname so it works flawlessly with modern ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Points directly to your project's data folder
const DATA_FILE = path.join(__dirname, 'src', 'data', 'initialData.json');

// 1. Send data to the React app when it loads
app.get('/api/patients', (req, res) => {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(rawData));
  } catch (err) {
    res.status(500).json({ error: "Failed to read database file" });
  }
});

// 2. Instantly overwrite the JSON file when React makes a change
app.post('/api/patients', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    console.log("Database file updated successfully!");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save to database file" });
  }
});

app.listen(3001, () => {
  console.log('MediDocs Auto-Save Server running on http://localhost:3001');
});