export type FieldType = "text" | "textarea" | "number" | "checkbox" | "image" | "file";
export type Field = { name: string; label: string; type: FieldType; required?: boolean; hint?: string };
export type ResourceKey = "experience" | "project" | "award" | "skillGroup";

export const resources: Record<ResourceKey, { title: string; path: string; titleField: string; fields: Field[] }> = {
  experience: {
    title: "Experience",
    path: "/experience",
    titleField: "role",
    fields: [
      { name: "role", label: "Posisi", type: "text", required: true },
      { name: "company", label: "Perusahaan / Instansi", type: "text", required: true },
      { name: "location", label: "Lokasi", type: "text" },
      { name: "period", label: "Periode", type: "text", required: true, hint: "cth. Aug 2026 – Present" },
      { name: "bullets", label: "Poin pekerjaan", type: "textarea", required: true, hint: "Satu poin per baris" },
      { name: "order", label: "Urutan", type: "number" },
      { name: "published", label: "Tampilkan", type: "checkbox" },
    ],
  },
  project: {
    title: "Projects",
    path: "/projects",
    titleField: "title",
    fields: [
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "description", label: "Deskripsi", type: "textarea", required: true },
      { name: "techStack", label: "Tech stack", type: "text", required: true, hint: "Pisahkan dengan koma" },
      { name: "imageUrl", label: "Gambar", type: "image" },
      { name: "link", label: "Link demo", type: "text" },
      { name: "repo", label: "Link repo", type: "text" },
      { name: "order", label: "Urutan", type: "number" },
      { name: "published", label: "Tampilkan", type: "checkbox" },
    ],
  },
  award: {
    title: "Awards",
    path: "/awards",
    titleField: "title",
    fields: [
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "issuer", label: "Penyelenggara", type: "text", required: true },
      { name: "date", label: "Tanggal", type: "text", required: true },
      { name: "note", label: "Keterangan", type: "text" },
      { name: "order", label: "Urutan", type: "number" },
      { name: "published", label: "Tampilkan", type: "checkbox" },
    ],
  },
  skillGroup: {
    title: "Skills",
    path: "/skills",
    titleField: "name",
    fields: [
      { name: "name", label: "Kategori", type: "text", required: true },
      { name: "items", label: "Skill", type: "textarea", required: true, hint: "Pisahkan dengan koma" },
      { name: "order", label: "Urutan", type: "number" },
    ],
  },
};

export const profileFields: Field[] = [
  { name: "name", label: "Nama", type: "text", required: true },
  { name: "headline", label: "Headline", type: "text", required: true },
  { name: "location", label: "Lokasi", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Telepon", type: "text" },
  { name: "linkedin", label: "LinkedIn URL", type: "text" },
  { name: "github", label: "GitHub URL", type: "text" },
  { name: "summary", label: "Ringkasan", type: "textarea", required: true },
  { name: "education", label: "Pendidikan", type: "textarea", hint: "Baris pertama = nama kampus" },
  { name: "avatarUrl", label: "Foto profil", type: "image" },
  { name: "cvUrl", label: "File CV (PDF)", type: "file" },
];

export function parseForm(fields: Field[], fd: FormData) {
  const data: Record<string, string | number | boolean | null> = {};
  for (const f of fields) {
    const raw = fd.get(f.name);
    if (f.type === "checkbox") data[f.name] = raw === "on";
    else if (f.type === "number") data[f.name] = Number(raw) || 0;
    else {
      const v = (raw as string | null)?.trim() ?? "";
      if (f.required && !v) throw new Error(`${f.label} wajib diisi`);
      data[f.name] = v || null;
    }
  }
  return data;
}
