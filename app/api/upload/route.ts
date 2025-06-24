import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing Vercel Blob token" }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 1024 * 1024) {
    return NextResponse.json({ error: "File size must be less than 1 MB" }, { status: 400 });
  }

  try {
    const { url } = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      token,
    });
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
