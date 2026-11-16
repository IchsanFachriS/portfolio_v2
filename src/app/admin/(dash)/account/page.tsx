"use client";
import { useActionState } from "react";
import { changePassword } from "../../actions";

export default function AccountPage() {
  const [state, action, pending] = useActionState(changePassword, { error: null, ok: false });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Akun</h1>
      <form action={action} className="max-w-sm space-y-3 rounded-xl border border-border bg-surface p-6">
        <input name="current" type="password" placeholder="Password lama" className="input" required />
        <input name="next" type="password" placeholder="Password baru (min. 10 karakter)" className="input" required />
        <button className="btn" disabled={pending}>Ganti password</button>
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        {state.ok && <p className="text-sm text-green-600">Password diganti ✓</p>}
      </form>
    </div>
  );
}
