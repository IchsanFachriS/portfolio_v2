import "server-only";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Compatible with any S3 provider: AWS S3, Cloudflare R2, MinIO, IDCloudHost, Biznet Neo, etc.
const client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

const bucket = () => process.env.S3_BUCKET || "";

export function publicUrl(key: string) {
  const base = (process.env.S3_PUBLIC_URL || "").replace(/\/$/, "");
  return `${base}/${key}`;
}

export async function uploadObject(key: string, body: Buffer, contentType: string) {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: process.env.S3_PUBLIC_ACL === "true" ? "public-read" : undefined,
    }),
  );
  return publicUrl(key);
}

export async function deleteObject(key: string) {
  await client.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
