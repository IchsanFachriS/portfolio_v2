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
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b-2 border-fg bg-surface p-4 dark:border-border md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r-2 md:p-5">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <span className="rounded-xl border-2 border-fg bg-pop-yellow px-3 py-1 font-mono text-sm font-bold text-[#16122b] shadow-[3px_3px_0_0_var(--shadow)] dark:border-border">admin.panel</span>
          <ThemeToggle />
        </div>
        <nav className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-accent-soft hover:text-accent">{label}</a>
          ))}
        </nav>
        <div className="mt-3 flex items-center gap-3 border-t-2 border-border/30 pt-3 text-sm md:mt-6 md:block md:space-y-2 md:pt-4">
          <a href={site} target="_blank" className="block px-3 font-semibold text-accent hover:underline">Lihat website ↗</a>
          <form action={logout}><button className="px-3 font-semibold text-muted hover:text-fg">Keluar</button></form>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-4xl p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
