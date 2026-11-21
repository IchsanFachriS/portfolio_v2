import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { profileFields } from "@/lib/resources";
import { saveProfile } from "../actions";
import { EntityForm } from "@/components/admin/entity-form";

export default async function ProfilePage() {
  const profile = await db.query.profile.findFirst({ where: eq(schema.profile.id, "main") });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Profil</h1>
      <div className="card p-5 md:p-6">
        <EntityForm fields={profileFields} values={profile ?? undefined} action={saveProfile} />
      </div>
    </div>
  );
}
