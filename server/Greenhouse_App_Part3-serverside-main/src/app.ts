import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import plantRoutes from './routes/plantRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) return next();

  express.json()(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true })(req, res, next);
  });
});

// API routes
app.use('/users', userRoutes);
app.use('/plants', plantRoutes);
app.use('/admin', adminRoutes);

// Healthcheck
app.get('/health', (req, res) => {
  res.send('Server is up and running');
});

// Simple debug endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Greenhouse API is running',
    endpoints: ['/users', '/plants', '/admin'],
    server_time: new Date().toISOString()
  });
});

// Angular path setup - FINAL FIX
const clientPath = path.join(__dirname, 'client/browser');
console.log('Looking for Angular frontend at:', clientPath);

// Static files from Angular build
app.use(express.static(clientPath));

// Angular fallback route
app.get('*', (req, res) => {
  const indexPath = path.join(clientPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Angular build missing');
  }
});

// Debug path viewer
app.get('/debug-paths', (req, res) => {
  const indexPath = path.join(clientPath, 'index.html');
  const clientExists = fs.existsSync(clientPath);
  const indexExists = fs.existsSync(indexPath);

  res.json({
    currentDir: __dirname,
    clientPath,
    indexPath,
    clientExists,
    indexExists,
    files: clientExists ? fs.readdirSync(clientPath) : []
  });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
