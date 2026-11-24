import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import storeRoutes from './routes/store.js';
import cors from 'cors';

dotenv.config();
dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

const app = express();
const port = Number(process.env.PORT || 5000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '12mb' }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.accepts('html')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    return next();
  });
}

async function start() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is not configured.');
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
  await mongoose.connect(mongoUri);
  app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
