import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import plantRoutes from './routes/plantRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

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
  if (contentType.includes('multipart/form-data')) {
    return next();
  }

  express.json()(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true })(req, res, next);
  });
});

app.use('/users', userRoutes);
app.use('/plants', plantRoutes);
app.use('/admin', adminRoutes);

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

app.get('/health', (req, res) => {
  res.send('Server is up and running');
});

// Debug static file paths
app.get('/debug-paths', (req, res) => {
  const clientPath = path.join(__dirname, '../dist/client');
  const indexPath = path.join(clientPath, 'index.html');
  
  const clientExists = require('fs').existsSync(clientPath);
  const indexExists = require('fs').existsSync(indexPath);
  
  res.json({
    currentDir: __dirname,
    clientPath,
    indexPath,
    clientExists,
    indexExists,
    files: clientExists ? require('fs').readdirSync(clientPath) : []
  });
});

// Serve Angular static files
const clientPath = path.join(__dirname, '../dist/client');
console.log('Looking for client files at:', clientPath);
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  const indexPath = path.join(clientPath, 'index.html');
  console.log('Trying to serve:', indexPath);
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found at ' + indexPath);
  }
});

// Serve Angular static files
const clientPath = path.join(__dirname, '../dist/client');
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
