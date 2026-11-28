import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { tables } from "@/lib/tables";
import { resources, type ResourceKey } from "@/lib/resources";
import { deleteResource, saveResource } from "@/app/admin/actions";
import { EntityForm } from "./entity-form";

export async function ResourcePage({ resource }: { resource: ResourceKey }) {
  const cfg = resources[resource];
  const table = tables[resource];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: Record<string, any>[] = await db.select().from(table).orderBy(asc(table.order));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight">{cfg.title}</h1>

      <details className="rounded-2xl border-2 border-dashed border-accent bg-accent-soft/50 p-4 sm:p-5">
        <summary className="cursor-pointer text-sm font-bold text-accent">＋ Add new</summary>
        <div className="mt-5">
          <EntityForm fields={cfg.fields} action={saveResource.bind(null, resource, null)} submitLabel="Add" resetOnSuccess />
        </div>
      </details>

      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.id} className="card p-4 sm:p-5">
            <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm">
              <span className="font-bold">{item[cfg.titleField]}</span>
              <span className="font-mono text-xs text-muted">
                #{item.order}{item.published === false ? " · hidden" : ""}
              </span>
            </summary>
            <div className="mt-5">
              <EntityForm fields={cfg.fields} values={item} action={saveResource.bind(null, resource, item.id)} />
              <form action={deleteResource.bind(null, resource, item.id)} className="mt-3">
                <button className="text-xs font-semibold text-red-500 hover:underline">Delete this item</button>
              </form>
            </div>
          </details>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">No items yet.</p>}
      </div>
    </div>
  );
}
