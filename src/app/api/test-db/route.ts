import { db } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This sends a simple "Hello" to your MySQL database
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    return NextResponse.json({ 
      status: "Success", 
      message: "Database Connected!", 
      data: rows 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "Error", 
      message: "Database Connection Failed", 
      details: error 
    }, { status: 500 });
  }
}