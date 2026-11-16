"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { tables } from "@/lib/tables";
import { createSession, destroySession, requireSession } from "@/lib/auth";
import { deleteObject } from "@/lib/storage";
import { parseForm, profileFields, resources, type ResourceKey } from "@/lib/resources";

// --- simple in-memory rate limit untuk login ---
const attempts = new Map<string, { n: number; t: number }>();

export async function login(_: unknown, fd: FormData) {
  const email = String(fd.get("email") || "").toLowerCase().trim();
  const password = String(fd.get("password") || "");
  const a = attempts.get(email);
  if (a && a.n >= 5 && Date.now() - a.t < 15 * 60_000) return { error: "Terlalu banyak percobaan. Coba lagi 15 menit." };

  const user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    attempts.set(email, { n: (a?.n ?? 0) + 1, t: Date.now() });
    return { error: "Email atau password salah." };
  }
  attempts.delete(email);
  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}


export async function saveResource(key: ResourceKey, id: string | null, _: unknown, fd: FormData) {
  await requireSession();
  try {
    const data = parseForm(resources[key].fields, fd);
    const table = tables[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (id) await db.update(table).set(data as any).where(eq(table.id, id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else await db.insert(table).values(data as any);
  } catch (e) {
    return { error: (e as Error).message, ok: false };
  }
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

export async function deleteResource(key: ResourceKey, id: string) {
  await requireSession();
  const table = tables[key];
  await db.delete(table).where(eq(table.id, id));
  revalidatePath("/", "layout");
}

export async function saveProfile(_: unknown, fd: FormData) {
  await requireSession();
  try {
    const data = parseForm(profileFields, fd) as Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(schema.profile).values({ id: "main", ...(data as any) }).onConflictDoUpdate({ target: schema.profile.id, set: data });
  } catch (e) {
    return { error: (e as Error).message, ok: false };
  }
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

export async function deleteMedia(id: string) {
  await requireSession();
  const m = await db.query.media.findFirst({ where: eq(schema.media.id, id) });
  if (!m) return;
  await deleteObject(m.key).catch(() => {});
  await db.delete(schema.media).where(eq(schema.media.id, id));
  revalidatePath("/", "layout");
}

export async function changePassword(_: unknown, fd: FormData) {
  const uid = await requireSession();
  const current = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  if (next.length < 10) return { error: "Password baru minimal 10 karakter.", ok: false };
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, uid) });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Password lama salah.", ok: false };
  await db.update(schema.users).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(schema.users.id, uid));
  return { error: null, ok: true };
}
