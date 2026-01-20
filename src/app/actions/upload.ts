"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

import sharp from "sharp";

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file uploaded" };
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // 2MB limit
    const MAX_SIZE = 2 * 1024 * 1024;

    // Generate unique filename
    let ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    let filename = `${uuidv4()}.${ext}`;

    if (file.size > MAX_SIZE) {
        try {
            // Compress image if larger than 2MB
            // Resize to max width 1920px, convert to JPEG with 80% quality
            const outputBuffer = await sharp(buffer)
                .resize(1920, null, { withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toBuffer();

            buffer = Buffer.from(outputBuffer);

            // Force extension to jpg since we converted it
            ext = "jpg";
            filename = `${uuidv4()}.${ext}`;
            console.log(`Image compressed. Original size: ${file.size}, New size: ${buffer.length}`);
        } catch (error) {
            console.error("Compression failed:", error);
            // Fallback to original buffer if compression fails, or you could return error
        }
    }

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore error if it already exists
    }

    const filepath = join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);
        return { url: `/uploads/${filename}` };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Upload failed" };
    }
}
