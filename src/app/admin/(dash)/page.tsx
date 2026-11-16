import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { profileFields } from "@/lib/resources";
import { saveProfile } from "../actions";
import { EntityForm } from "@/components/admin/entity-form";

export default async function ProfilePage() {
  const profile = await db.query.profile.findFirst({ where: eq(schema.profile.id, "main") });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <div className="rounded-xl border border-border bg-surface p-6">
        <EntityForm fields={profileFields} values={profile ?? undefined} action={saveProfile} />
      </div>
    </div>
  );
}
