"use client";
import { useActionState } from "react";
import { changePassword } from "../../actions";

export default function AccountPage() {
  const [state, action, pending] = useActionState(changePassword, { error: null, ok: false });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Account</h1>
      <form action={action} className="card max-w-sm space-y-3 p-6">
        <input name="current" type="password" placeholder="Current password" className="input" required />
        <input name="next" type="password" placeholder="New password (min. 10 characters)" className="input" required />
        <button className="btn" disabled={pending}>Change password</button>
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        {state.ok && <p className="text-sm text-green-600">Password updated ✓</p>}
      </form>
    </div>
  );
}
