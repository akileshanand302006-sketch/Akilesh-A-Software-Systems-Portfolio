import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import apiRoutes from './routes/api.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect Database
connectDB();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin media streaming
  })
);

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or matching client url / localhost
      if (!origin || origin === CLIENT_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, configurable for prod
      }
    },
    credentials: true,
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
  console.log(`🚀 [Portfolio Backend] Server running on http://localhost:${PORT}`);
});

export default app;
