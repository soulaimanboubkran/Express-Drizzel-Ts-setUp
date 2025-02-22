import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { testDatabaseConnection } from './db/client';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Test the database connection on startup
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
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
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