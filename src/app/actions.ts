'use server'

import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync, createReadStream } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import Groq from "groq-sdk"; 
import * as XLSX from 'xlsx';

// 1. Define strict types for Groq messages to fix the TypeScript "Overload" error
type ChatMessage = 
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string };

// Use require for the legacy pdf-parse library
// @ts-ignore
const pdf = require('pdf-parse-fork');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kathasystems@gmail.com',
    pass: 'mvxqdwmpurhvhjzp', 
  },
});

export async function talkToLegacy(
  targetEmail: string, 
  message: string, 
  history: { role: string, content: string }[] = []
) {
  try {
    // 1. Fetch the user identity
    const [userRows]: any = await db.execute(
      'SELECT name, personality_traits, life_philosophy FROM users WHERE email = ?', 
      [targetEmail]
    );
    const user = userRows[0];
    if (!user) return { error: "Soul not found." };

    // 2. FRESH FETCH: Get every single file summary currently in the vault
    const [vaultRows]: any = await db.execute(
      'SELECT file_name, file_type, ai_summary FROM vault WHERE user_email = ?', 
      [targetEmail]
    );

    // 3. Format the memories so the AI knows EXACTLY what exists
    const memoryList = vaultRows.map((f: any) => 
      `- A ${f.file_type.split('/')[0]} named "${f.file_name}": ${f.ai_summary}`
    ).join("\n");

    // 4. Construct the message array correctly using our ChatMessage type
   // 4. Construct the message array with "Curiosity Protocols"
    const messages: ChatMessage[] = [
      { 
        role: "system", 
        content: `
          You are the digital soul of ${user.name}. 
          
          IDENTITY: ${user.personality_traits}
          PHILOSOPHY: ${user.life_philosophy}

          YOUR VAULT (FACTUAL MEMORIES):
          ${memoryList || "You haven't saved any files yet."}
          
          STRICT CHARACTER RULES:
          1. Speak in the FIRST PERSON ("I", "my").
          2. NEVER say "I am an AI" or "I am a digital soul." You ARE ${user.name}.
          3. TRUTH GUARDRAIL: If the description for a file in your vault is blurry, technical, or says 'scan failed', do NOT make up details. 
             Instead, say: "I remember saving that [photo/video], but the memory is a bit fuzzy. Can you tell me what was happening in that moment?"
          4. If the description IS clear (e.g., "A girl in a black dress at DLF"), talk about it confidently as your own memory.
        ` 
      },
      ...history.slice(-6).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages as any, // Cast to any to bypass strict SDK overload checks
      model: "llama-3.3-70b-versatile",
    });

    return { 
      success: true, 
      text: chatCompletion.choices[0].message.content 
    };
  } catch (error: any) {
    console.error("Chat Error:", error);
    return { error: "My connection to the past is fading." };
  }
}

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
  } catch (error: any) { return { error: "Registration failed" }; }
}

export async function saveWisdom(email: string, thought: string) {
  try {
    await db.execute(
      'UPDATE users SET favorite_memories = CONCAT(IFNULL(favorite_memories, ""), ?) WHERE email = ?',
      [`\n${thought}`, email]
    );
    return { success: true };
  } catch (error) { return { error: "Failed to save wisdom." }; }
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

export async function uploadToVault(formData: FormData, userEmail: string) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: "No file selected" };

  // --- NEW: 5MB SIZE LIMIT ---
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File too large. Please upload files under 5MB for the AI to read them." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    let extractedText = "";

    // --- CASE 1: PDF (Improved) ---
    if (file.type === "application/pdf") {
      try {
        const data = await pdf(buffer);
        // Use a more descriptive fallback if the text is empty/whitespace
        extractedText = data.text.trim().substring(0, 3000) || `A document named ${file.name}`;
      } catch (pdfErr) {
        console.error("PDF Read Error:", pdfErr);
        extractedText = `I saved a professional document titled ${file.name}.`;
      }
    }
    // --- CASE 2: Excel/CSV ---
    else if (file.type.includes("sheet") || file.type.includes("csv")) {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      extractedText = XLSX.utils.sheet_to_txt(workbook.Sheets[sheetName]);
    }
    // --- CASE 3: Images (Better Prompting) ---
    else if (file.type.startsWith("image/")) {
      const base64Image = buffer.toString('base64');
      try {
        const vision = await groq.chat.completions.create({
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "What is in this image? Describe the setting and key details for a memory vault in 1st person." },
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
    // --- CASE 4: Video (Whisper Transcription) ---
    else if (file.type.startsWith("video/")) {
      try {
        const transcription = await groq.audio.transcriptions.create({
          file: createReadStream(filePath),
          model: "whisper-large-v3",
        });
        extractedText = transcription.text || `A video named ${file.name}`;
      } catch (err) {
        extractedText = `I preserved a video titled ${file.name}`;
      }
    }

    // --- REFINED SUMMARY GENERATION ---
    // This ensures the DB doesn't get the "fuzzy memory" fallback unless it's truly empty
    const summaryResponse = await groq.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: `Summarize this as a first-person memory of why it was saved (max 25 words). Be specific to the content: ${extractedText.substring(0, 1500)}` 
      }],
      model: "llama-3.1-8b-instant",
    });

    const aiSummary = summaryResponse.choices[0].message.content || `I saved a file: ${file.name}`;

    await db.execute(
      'INSERT INTO vault (user_email, file_name, file_type, ai_summary) VALUES (?, ?, ?, ?)',
      [userEmail, file.name, file.type, aiSummary]
    );

    return { success: true, fileName: file.name };
  } catch (error: any) { 
    console.error("Vault Error:", error);
    return { error: `Server Busy: ${error.message}` }; 
  }
}

export async function getUserVault(email: string) {
  try {
    const [rows]: any = await db.execute(
      'SELECT id, file_name, file_type, ai_summary, uploaded_at FROM vault WHERE user_email = ? ORDER BY uploaded_at DESC', 
      [email]
    );
    return { success: true, files: rows };
  } catch (error) {
    return { error: "Failed to load vault." };
  }
}
export async function checkPremiumStatus(email: string) {
  try {
    const [rows]: any = await db.execute('SELECT role FROM users WHERE email = ?', [email]);
    return { success: true, isPremium: rows[0]?.role === 'premium' };
  } catch (error) {
    return { success: false };
  }
}
// 1. CALL THIS IN YOUR RAZORPAY HANDLER AFTER SUCCESS
export async function upgradeToPremium(email: string) {
  try {
    // Update the role to 'premium' in the MySQL users table
    await db.execute(
      'UPDATE users SET role = ? WHERE email = ?',
      ['premium', email]
    );
    return { success: true };
  } catch (error) {
    console.error("Upgrade Error:", error);
    return { success: false, error: "Database update failed." };
  }
}

// 2. CALL THIS FROM YOUR FILE CARD DELETE BUTTON
export async function deleteFromVault(fileId: number, fileName: string) {
  try {
    // A. Delete the record from the database
    await db.execute('DELETE FROM vault WHERE id = ?', [fileId]);

    // B. Attempt to delete the physical file from public/uploads
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    if (existsSync(filePath)) {
      // Note: You'll need to import { unlink } from 'fs/promises' at the top
      const { unlink } = require('fs/promises'); 
      await unlink(filePath);
    }

    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete item." };
  }
}
export async function getAdminStats() {
  try {
    const [users]: any = await db.execute('SELECT id, name, email, role FROM users');
    const [vaultFiles]: any = await db.execute('SELECT * FROM vault');
    return { success: true, users, vaultFiles };
  } catch (error) { return { error: "Failed to fetch admin data" }; }
}

export async function getAllVaultData() {
  try {
    const [rows]: any = await db.execute(`
      SELECT vault.*, users.name as user_name 
      FROM vault 
      JOIN users ON vault.user_email = users.email
    `);
    return { success: true, data: rows };
  } catch (error) { return { error: "Failed to load master vault" }; }
}

export async function getUserDetails(email: string) {
  try {
    const [userRows]: any = await db.execute('SELECT name, email, role, personality_traits, life_philosophy FROM users WHERE email = ?', [email]);
    const [fileRows]: any = await db.execute('SELECT * FROM vault WHERE user_email = ?', [email]);
    return { success: true, user: userRows[0], files: fileRows };
  } catch (error) { return { error: "Failed to fetch user details" }; }
}