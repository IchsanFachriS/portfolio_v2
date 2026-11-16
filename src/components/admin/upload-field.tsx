"use client";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export function UploadField({ name, defaultValue, accept }: { name: string; defaultValue?: string | null; accept: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(f: File) {
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setErr(json.error || "Upload gagal");
    setValue(json.url);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input name={name} value={value} onChange={(e) => setValue(e.target.value)} className="input" placeholder="https://…" />
        <button type="button" onClick={() => ref.current?.click()} className="btn-ghost shrink-0" disabled={busy}>
          <Upload size={14} /> {busy ? "Mengunggah…" : "Upload"}
        </button>
        <input ref={ref} type="file" accept={accept} hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </div>
      {err && <p className="text-xs text-red-500">{err}</p>}
      {value && accept.startsWith("image") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 rounded border border-border object-cover" />
      )}
    </div>
  );
}
