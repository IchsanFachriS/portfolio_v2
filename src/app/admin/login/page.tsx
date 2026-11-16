"use client";
import { useActionState } from "react";
import { login } from "../actions";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <form action={action} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-bg p-8">
        <div>
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <p className="text-sm text-muted">Masuk untuk mengelola website.</p>
        </div>
        <input name="email" type="email" placeholder="Email" required autoComplete="email" className="input" />
        <input name="password" type="password" placeholder="Password" required autoComplete="current-password" className="input" />
        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
        <button className="btn w-full" disabled={pending}>{pending ? "Memproses…" : "Masuk"}</button>
      </form>
    </main>
  );
}
