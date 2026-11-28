export type FieldType = "text" | "textarea" | "number" | "checkbox" | "image" | "file";
export type Field = { name: string; label: string; type: FieldType; required?: boolean; hint?: string };
export type ResourceKey = "experience" | "project" | "award" | "skillGroup";

export const resources: Record<ResourceKey, { title: string; path: string; titleField: string; fields: Field[] }> = {
  experience: {
    title: "Experience",
    path: "/experience",
    titleField: "role",
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company / Organization", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "period", label: "Period", type: "text", required: true, hint: "e.g. Aug 2026 – Present" },
      { name: "bullets", label: "Highlights", type: "textarea", required: true, hint: "One point per line" },
      { name: "order", label: "Order", type: "number" },
      { name: "published", label: "Visible", type: "checkbox" },
    ],
  },
  project: {
    title: "Projects",
    path: "/projects",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "techStack", label: "Tech stack", type: "text", required: true, hint: "Separate with commas" },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "link", label: "Demo link", type: "text" },
      { name: "repo", label: "Repository link", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "published", label: "Visible", type: "checkbox" },
    ],
  },
  award: {
    title: "Awards",
    path: "/awards",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text", required: true },
      { name: "date", label: "Date", type: "text", required: true },
      { name: "note", label: "Note", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "published", label: "Visible", type: "checkbox" },
    ],
  },
  skillGroup: {
    title: "Skills",
    path: "/skills",
    titleField: "name",
    fields: [
      { name: "name", label: "Category", type: "text", required: true },
      { name: "items", label: "Skill", type: "textarea", required: true, hint: "Separate with commas" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
};

export const profileFields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "headline", label: "Headline", type: "text", required: true },
  { name: "location", label: "Location", type: "text", hint: "Optional — leave empty to hide it from the homepage" },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text" },
  { name: "linkedin", label: "LinkedIn URL", type: "text" },
  { name: "github", label: "GitHub URL", type: "text" },
  { name: "summary", label: "Summary", type: "textarea", required: true },
  { name: "education", label: "Education", type: "textarea", hint: "First line = institution name" },
  { name: "avatarUrl", label: "Profile photo", type: "image" },
  { name: "cvUrl", label: "CV file (PDF)", type: "file" },
];

export function parseForm(fields: Field[], fd: FormData) {
  const data: Record<string, string | number | boolean | null> = {};
  for (const f of fields) {
    const raw = fd.get(f.name);
    if (f.type === "checkbox") data[f.name] = raw === "on";
    else if (f.type === "number") data[f.name] = Number(raw) || 0;
    else {
      const v = (raw as string | null)?.trim() ?? "";
      if (f.required && !v) throw new Error(`${f.label} is required`);
      data[f.name] = v || null;
    }
  }
  return data;
}
