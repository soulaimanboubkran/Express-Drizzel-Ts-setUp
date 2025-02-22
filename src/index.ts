import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { testDatabaseConnection, pool } from './db/client';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Test the database connection on startup (without exiting on failure)
testDatabaseConnection();

// Middleware to enable CORS
app.use(cors());

// Middleware to set security headers
app.use(helmet());

// Middleware to parse JSON
app.use(express.json());

// Middleware for logging HTTP requests
app.use(morgan('combined'));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Example route
app.get('/', async (req: Request, res: Response) => {
  try {
    // Check if the database connection is available
    await pool.query('SELECT NOW()');
    res.send('Hello, Express with TypeScript!');
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database is unavailable' });
  }
});

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test the database connection
    await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// Middleware to handle errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});