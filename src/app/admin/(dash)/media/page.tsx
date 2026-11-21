import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteMedia } from "../../actions";
import { UploadField } from "@/components/admin/upload-field";

export default async function MediaPage() {
  const media = await db.select().from(schema.media).orderBy(desc(schema.media.createdAt));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Media</h1>
      <div className="rounded-2xl border-2 border-dashed border-accent bg-accent-soft/50 p-5">
        <p className="mb-3 text-sm text-muted">Upload foto/PDF ke object storage, lalu salin URL-nya. Refresh halaman untuk melihat di daftar.</p>
        <UploadField name="_tmp" accept="image/*,application/pdf" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((m) => (
          <div key={m.id} className="card overflow-hidden text-xs">
            {m.contentType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.filename} className="aspect-video w-full border-b-2 border-fg object-cover dark:border-border" />
            ) : (
              <div className="grid aspect-video place-items-center border-b-2 border-fg bg-pop-sky font-mono font-bold text-[#16122b] dark:border-border">PDF</div>
            )}
            <div className="space-y-2 p-3">
              <p className="truncate font-medium">{m.filename}</p>
              <input readOnly value={m.url} className="input font-mono text-[11px]" />
              <div className="flex justify-between text-muted">
                <span>{(m.size / 1024).toFixed(0)} KB</span>
                <form action={deleteMedia.bind(null, m.id)}><button className="font-semibold text-red-500 hover:underline">Hapus</button></form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
