import mysql from 'mysql2/promise';

// This uses the single DATABASE_URL you just added to Vercel
export const db = mysql.createPool({
  uri: process.env.DATABASE_URL, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Railway MySQL usually works fine without strict SSL, 
  // but keeping it 'true' is safer for cloud connections.
  ssl: {
    rejectUnauthorized: false // Change to false if you have connection issues
  }
});