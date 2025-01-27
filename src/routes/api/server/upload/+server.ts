import fs from "fs/promises";
import path from "path";

export async function POST({ request }: { request: Request }) {
    try {
        const data = await request.formData();
        const file = data.get("file");
        if (!(file instanceof File)) {
            return new Response(JSON.stringify({ success: false, message: "Invalid file upload" }), { status: 400 });
        }
        const tempDir = path.resolve("temp");
        await fs.mkdir(tempDir, { recursive: true });

        const filename = "profile-image.jpeg";
        const filePath = path.join(tempDir, filename);

        const fileData = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, fileData);

        return new Response(JSON.stringify({ success: true, filePath: `/temp/${filename}` }), { status: 200 });
    } catch (error) {
        console.error("Error handling file upload:", error);
        return new Response(JSON.stringify({ success: false, message: "File upload failed" }), { status: 500 });
    }
}
