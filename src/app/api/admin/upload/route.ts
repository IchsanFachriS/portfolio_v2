import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { uploadObject } from "@/lib/storage";
import { db, schema } from "@/lib/db";

const MAX = 20 * 1024 * 1024; // 20 MB
const ALLOWED = /^(image\/(png|jpe?g|webp|gif|svg\+xml|avif)|application\/pdf)$/;

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ada" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Maksimal 20 MB" }, { status: 400 });
  if (!ALLOWED.test(file.type)) return NextResponse.json({ error: "Hanya gambar atau PDF" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const folder = file.type.startsWith("image/") ? "images" : "files";
  const key = `${process.env.S3_PREFIX || "portfolio"}/${folder}/${new Date().getFullYear()}/${randomUUID()}.${ext}`;

  try {
    const url = await uploadObject(key, Buffer.from(await file.arrayBuffer()), file.type);
    const [media] = await db.insert(schema.media)
      .values({ key, url, filename: file.name, contentType: file.type, size: file.size })
      .returning({ id: schema.media.id });
    return NextResponse.json({ url, id: media.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload gagal — cek konfigurasi object storage" }, { status: 500 });
  }
}
