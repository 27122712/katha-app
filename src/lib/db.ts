import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  // Use 'uri' instead of host/user/password
  uri: process.env.DATABASE_URL, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    // Railway needs this to avoid handshake errors
    rejectUnauthorized: false 
  }
});