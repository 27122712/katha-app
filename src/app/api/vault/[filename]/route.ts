import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// 1. Setup the same algorithm and key as your actions.ts
const ALGORITHM = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; 

// 2. The Decryption Helper (Unscrambles the file bits)
function decrypt(buffer: Buffer) {
    // The first 16 bytes are the IV (Initialization Vector) we saved during upload
    const iv = buffer.slice(0, 16);
    const encryptedData = buffer.slice(16);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    const result = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return result;
}

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
    const { filename } = params;
    
    // Check if the user wants to download or just view
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get('download') === 'true';

    try {
        // 3. Locate the file in the hidden "vault_storage" folder
        const filePath = path.join(process.cwd(), 'vault_storage', filename);
        
        // 4. Read the scrambled bits from the disk
        const encryptedBuffer = await readFile(filePath);
        
        // 5. Unscramble them in the server's memory
        const decryptedBuffer = decrypt(encryptedBuffer);

        // 6. Determine the file type for the browser
        const extension = filename.split('.').pop()?.toLowerCase();
        const contentType = extension === 'pdf' ? 'application/pdf' : 
                          ['png', 'jpg', 'jpeg', 'gif'].includes(extension!) ? `image/${extension}` :
                          extension === 'mp4' ? 'video/mp4' : 'application/octet-stream';

        // 7. Send the "unlocked" file to the user
        return new NextResponse(decryptedBuffer, {
            headers: {
                'Content-Type': contentType,
                // If download=true, force the browser to save the file
                ...(isDownload && {
                    'Content-Disposition': `attachment; filename="${filename}"`,
                }),
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error("Vault Access Error:", error);
        return NextResponse.json({ error: "File not found or access denied" }, { status: 404 });
    }
}