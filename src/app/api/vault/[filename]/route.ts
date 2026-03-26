import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; 

function decrypt(buffer: Buffer) {
    const iv = buffer.slice(0, 16);
    const encryptedData = buffer.slice(16);
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    const result = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return result;
}

// 1. Updated the type for params to be a Promise
export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ filename: string }> } 
) {
    // 2. We MUST await the params now
    const { filename } = await params;
    
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get('download') === 'true';

    try {
        const filePath = path.join(process.cwd(), 'vault_storage', filename);
        const encryptedBuffer = await readFile(filePath);
        const decryptedBuffer = decrypt(encryptedBuffer);

        const extension = filename.split('.').pop()?.toLowerCase();
        const contentType = extension === 'pdf' ? 'application/pdf' : 
                          ['png', 'jpg', 'jpeg', 'gif'].includes(extension!) ? `image/${extension}` :
                          extension === 'mp4' ? 'video/mp4' : 'application/octet-stream';

        return new NextResponse(decryptedBuffer, {
            headers: {
                'Content-Type': contentType,
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