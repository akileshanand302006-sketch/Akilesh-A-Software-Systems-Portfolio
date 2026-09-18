import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { verifySmtpConfiguration } from './services/emailService.js';
import apiRoutes from './routes/api.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env explicitly regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Verify Gmail SMTP Configuration on startup
verifySmtpConfiguration();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Allowed Origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'https://akileshanand302006-sketch.github.io',
  'https://akileshanand302006.github.io',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or matching allowed origins
      if (
        !origin ||
        ALLOWED_ORIGINS.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Logging & Body Parsing
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// General Rate Limiting
app.use('/api', generalLimiter);

// Mount Master API Router
app.use('/api', apiRoutes);

// Root Health Ping
app.get('/', (req, res) => {
  res.json({
    name: "Akilesh's Portfolio API",
    version: '1.0.0',
    status: 'online',
    docs: '/api/health',
  });
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`⚡ [Portfolio Backend] Server running on http://localhost:${PORT}`);
});

export default app;
