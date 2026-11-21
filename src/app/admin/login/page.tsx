"use client";
import { useActionState } from "react";
import { login } from "../actions";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <form action={action} className="card w-full max-w-sm space-y-4 p-6 sm:p-8">
        <div>
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl border-2 border-fg bg-pop-yellow text-2xl shadow-[3px_3px_0_0_var(--shadow)] dark:border-border">🔐</div>
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
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
