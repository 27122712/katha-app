'use server'

import { db } from '@/lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync, createReadStream } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import Groq from "groq-sdk"; 
import * as XLSX from 'xlsx';
// @ts-ignore
import pdf from 'pdf-parse-fork';
import { put } from '@vercel/blob';

// 1. Types for AI Chat
type ChatMessage = 
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string };

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'kathasystems@gmail.com',
    pass: process.env.EMAIL_PASS, 
  },
  // This prevents Vercel from killing the function too early
  connectionTimeout: 10000, 
});

/* --- 1. USER AUTH & REGISTRATION --- */

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const traits = formData.get('traits') as string;
  const philosophy = formData.get('philosophy') as string;

  try {
    await db.execute(
      'INSERT INTO users (name, email, password, personality_traits, life_philosophy) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, traits, philosophy]
    );
    return { success: true };
  } catch (error: any) { 
    console.error("Reg Error:", error);
    return { error: "Registration failed. Email might already exist." }; 
  }
}
export async function getUserDetails(email: string) {
  try {
    // 1. Get user basic info
    const [userRows]: any = await db.execute(
      'SELECT name, email, role FROM users WHERE email = ?', 
      [email]
    );
    
    // 2. Get user vault files
    const [fileRows]: any = await db.execute(
      'SELECT id, file_name, file_type, ai_summary FROM vault WHERE user_email = ?', 
      [email]
    );

    if (!userRows[0]) return { error: "User not found" };

    return { 
      success: true, 
      user: userRows[0], 
      files: fileRows 
    };
  } catch (error) {
    return { error: "Failed to fetch user details" };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  try {
    const [rows]: any = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows[0]) return { success: true, user: { name: rows[0].name, email: rows[0].email } };
    return { error: "Invalid credentials" };
  } catch (error) { return { error: "Login failed" }; }
}

/* --- 2. VAULT MANAGEMENT --- */

export async function uploadToVault(formData: FormData, userEmail: string) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: "No file selected" };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; 
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File too large. Max 5MB." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // --- NEW: Upload directly to Vercel Blob ---
    const blob = await put(file.name, buffer, {
      access: 'public',
    });
    // --------------------------------------------

    let extractedText = "";

    if (file.type === "application/pdf") {
      try {
        const data = await pdf(buffer);
        extractedText = data.text.trim().substring(0, 3000) || `A document named ${file.name}`;
      } catch (pdfErr) {
        extractedText = `I saved a document titled ${file.name}.`;
      }
    }
    else if (file.type.includes("sheet") || file.type.includes("csv")) {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      extractedText = XLSX.utils.sheet_to_txt(workbook.Sheets[sheetName]);
    }
    else if (file.type.startsWith("image/")) {
      const base64Image = buffer.toString('base64');
      try {
        const vision = await groq.chat.completions.create({
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "What is in this image? Describe for a memory vault in 1st person." },
              { type: "image_url", image_url: { url: `data:${file.type};base64,${base64Image}` } }
            ],
          }],
          model: "llama-3.2-11b-vision-preview", 
        });
        extractedText = vision.choices[0].message.content || "";
      } catch (visionErr) {
        extractedText = `A photo I preserved called ${file.name}.`;
      }
    }
    else if (file.type.startsWith("video/")) {
      // Note: Video processing still uses /tmp briefly for Whisper API
      const tempPath = path.join('/tmp', file.name);
      await writeFile(tempPath, buffer);
      try {
        const transcription = await groq.audio.transcriptions.create({
          file: createReadStream(tempPath),
          model: "whisper-large-v3",
        });
        extractedText = transcription.text || `A video named ${file.name}`;
      } catch (err) {
        extractedText = `I preserved a video titled ${file.name}`;
      }
      await unlink(tempPath);
    }

    const summaryResponse = await groq.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: `Summarize this as a first-person memory (max 25 words): ${extractedText.substring(0, 1500)}` 
      }],
      model: "llama-3.1-8b-instant",
    });

    const aiSummary = summaryResponse.choices[0].message.content || `I saved: ${file.name}`;

    // --- UPDATED: Save the blob.url to the database ---
    await db.execute(
      'INSERT INTO vault (user_email, file_name, file_type, ai_summary, file_url) VALUES (?, ?, ?, ?, ?)',
      [userEmail, file.name, file.type, aiSummary, blob.url]
    );

    return { success: true, fileName: file.name };
  } catch (error: any) { 
    console.error("Vault Error:", error);
    return { error: `Upload failed: ${error.message}` }; 
  }
}

export async function getUserVault(email: string) {
  try {
    const [rows]: any = await db.execute(
      // Added file_url to the query
      'SELECT id, file_name, file_type, ai_summary, file_url, uploaded_at FROM vault WHERE user_email = ? ORDER BY uploaded_at DESC', 
      [email]
    );
    return { success: true, files: rows };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { error: "Failed to load vault." };
  }
}

export async function deleteFromVault(fileId: number) {
  try {
    await db.execute('DELETE FROM vault WHERE id = ?', [fileId]);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete item." };
  }
}

/* --- 3. LEGACY CHAT (THE DIGITAL SOUL) --- */

export async function talkToLegacy(
  targetEmail: string, 
  message: string, 
  history: { role: string, content: string }[] = []
) {
  try {
    // 1. Get user info AND their current chat count & role
    const [userRows]: any = await db.execute(
      'SELECT name, personality_traits, life_philosophy, role, chat_count FROM users WHERE email = ?', 
      [targetEmail]
    );
    const user = userRows[0];
    
    if (!user) return { error: "Soul not found." };

    // 2. PAYWALL LOGIC: Check if user is on Free plan and has used 2 or more chats
    const isPremium = user.role === 'premium' || user.role === 'admin';
    if (!isPremium && user.chat_count >= 2) {
      return { error: "FREE_LIMIT_REACHED" };
    }

    // 3. Get Vault Memories to feed the AI context
    const [vaultRows]: any = await db.execute(
      'SELECT file_name, ai_summary FROM vault WHERE user_email = ?', 
      [targetEmail]
    );

    const memoryList = vaultRows.map((f: any) => `- ${f.file_name}: ${f.ai_summary}`).join("\n");

    // 4. Prepare the AI prompt
    const messages: ChatMessage[] = [
      { 
        role: "system", 
        content: `You are ${user.name}. Traits: ${user.personality_traits}. Philosophy: ${user.life_philosophy}. Memories: ${memoryList}. Respond in first person.` 
      },
      ...history.slice(-6).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // 5. Generate AI Response
    const chatCompletion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    // 6. SUCCESS: Increment the chat count in the database
    // This ensures reloads don't reset the free limit.
    await db.execute(
      'UPDATE users SET chat_count = chat_count + 1 WHERE email = ?',
      [targetEmail]
    );

    return { success: true, text: aiResponse };
    
  } catch (error: any) {
    console.error("Chat Error:", error);
    return { error: "The connection to the legacy is weak. Check your API keys." };
  }
}

/* --- 4. ADMIN & PREMIUM FEATURES --- */

export async function getAdminStats() {
  try {
    const [users]: any = await db.execute('SELECT id, name, email, role FROM users');
    const [vaultFiles]: any = await db.execute('SELECT * FROM vault');
    return { success: true, users, vaultFiles };
  } catch (error) { return { error: "Failed to fetch admin data" }; }
}

export async function upgradeToPremium(email: string) {
  try {
    // 1. Calculate the expiration date (Current Time + 30 Days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // 2. Update the user to 'premium' and set the expiration timestamp
    // We use the SQL format for DATETIME: YYYY-MM-DD HH:MM:SS
    const formattedDate = expiryDate.toISOString().slice(0, 19).replace('T', ' ');

    await db.execute(
      'UPDATE users SET role = ?, premium_until = ? WHERE email = ?', 
      ['premium', formattedDate, email]
    );
    
    return { success: true };
  } catch (error: any) {
    console.error("Upgrade error:", error);
    return { error: "Upgrade failed. Database connection issue." };
  }
}
export async function checkPremiumStatus(email: string) {
  try {
    const [rows]: any = await db.execute(
      'SELECT role, premium_until FROM users WHERE email = ?',
      [email]
    );
    
    const user = rows[0];
    if (!user) return { success: false, isPremium: false };

    // 1. Admins are always Premium (God Mode)
    if (user.role === 'admin') return { success: true, isPremium: true };

    // 2. If they aren't premium at all, return false
    if (user.role !== 'premium') return { success: true, isPremium: false };

    // 3. Check the Expiration Date
    const now = new Date();
    const expiry = user.premium_until ? new Date(user.premium_until) : null;

    // Logic: If they are 'premium' AND the expiry date is still in the future
    if (expiry && expiry > now) {
      return { success: true, isPremium: true };
    }

    // 4. AUTO-EXPIRE: If they were premium but time ran out
    if (expiry && expiry <= now) {
      // Demote them back to 'free' in the database automatically
      await db.execute('UPDATE users SET role = "free" WHERE email = ?', [email]);
      return { success: true, isPremium: false };
    }

    return { success: true, isPremium: false };
  } catch (error) {
    console.error("Status Check Error:", error);
    return { success: false, isPremium: false };
  }
}

export async function saveWisdom(email: string, thought: string) {
  try {
    await db.execute(
      'UPDATE users SET life_philosophy = CONCAT(IFNULL(life_philosophy, ""), ?) WHERE email = ?',
      [`\n- ${thought}`, email]
    );
    return { success: true };
  } catch (error) {
    console.error("Save Wisdom Error:", error);
    return { error: "Failed to seed wisdom." };
  }
}