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
  if (contentType.includes('multipart/form-data')) {
    return next();
  }

  express.json()(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true })(req, res, next);
  });
});

// API routes
app.use('/users', userRoutes);
app.use('/plants', plantRoutes);
app.use('/admin', adminRoutes);

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

app.get('/health', (req, res) => {
  res.send('Server is up and running');
});

// Root path handler
app.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>Greenhouse API</title>
        <style>
          body { font-family: Arial; margin: 40px; line-height: 1.6; }
          h1 { color: #2e8b57; }
          .container { max-width: 800px; margin: 0 auto; }
          code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Greenhouse API</h1>
          <p>Your server is running successfully!</p>
          <p>Available endpoints:</p>
          <ul>
            <li><code>/users</code> - User management</li>
            <li><code>/plants</code> - Plant management</li>
            <li><code>/admin</code> - Admin functions</li>
            <li><code>/debug-paths</code> - Debug information</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Greenhouse API is running',
    endpoints: ['/users', '/plants', '/admin'],
    server_time: new Date().toISOString()
  });
});

app.get('/debug-paths', (req, res) => {
  const clientPath = path.join(__dirname, '../dist/client/browser');
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

// Serve Angular static files
const clientPath = path.join(__dirname, '../dist/client/browser');
console.log('Looking for client files at:', clientPath);
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  const indexPath = path.join(clientPath, 'index.html');
  console.log('Trying to serve:', indexPath);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.redirect('/');
  }
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
