import mysql from 'mysql2/promise';

// This pulls the "secrets" from your Vercel Environment Variables
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Cloud databases use Port 4000, local usually uses 3306/3307
  port: Number(process.env.DB_PORT) || 4000, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // CRITICAL: TiDB Cloud requires SSL for a secure connection
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});