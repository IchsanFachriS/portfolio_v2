import { requireSession } from "@/lib/auth";
import { logout } from "../actions";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  ["/", "Profil"],
  ["/experience", "Experience"],
  ["/projects", "Projects"],
  ["/skills", "Skills"],
  ["/awards", "Awards"],
  ["/media", "Media"],
  ["/account", "Akun"],
];

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://ichsanfachri.my.id";
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-border bg-surface p-5 md:min-h-screen md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold">admin<span className="text-accent">.</span></span>
          <ThemeToggle />
        </div>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="rounded-md px-3 py-2 text-sm text-muted hover:bg-bg hover:text-fg">{label}</a>
          ))}
        </nav>
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <a href={site} target="_blank" className="block px-3 text-accent hover:underline">Lihat website ↗</a>
          <form action={logout}><button className="px-3 text-muted hover:text-fg">Keluar</button></form>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-4xl p-6 md:p-10">{children}</main>
    </div>
  );
}
