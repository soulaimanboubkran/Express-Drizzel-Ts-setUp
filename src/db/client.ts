import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Initialize Drizzle ORM with the connection pool and schema
export const db = drizzle(pool, { schema });

// Test the database connection
export const testDatabaseConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL database:', err);
    // Do not exit the process; let the server start without a database connection
  }
};