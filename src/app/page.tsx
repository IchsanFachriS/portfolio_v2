import { asc, eq } from "drizzle-orm";
import { db, schema as t } from "@/lib/db";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowUpRight, Download, Mail, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

const nav = [
  ["#about", "About"],
  ["#experience", "Experience"],
  ["#projects", "Projects"],
  ["#skills", "Skills"],
  ["#awards", "Awards"],
  ["#contact", "Contact"],
];

const split = (s: string, sep: string | RegExp) =>
  s.split(sep).map((x) => x.trim()).filter(Boolean);

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
    </svg>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-16">
      <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">{title}</h2>
      {children}
    </section>
  );
}

export default async function Home() {
  const [profile, experiences, projects, awards, skills] = await Promise.all([
    db.query.profile.findFirst({ where: eq(t.profile.id, "main") }),
    db.select().from(t.experience).where(eq(t.experience.published, true)).orderBy(asc(t.experience.order)),
    db.select().from(t.project).where(eq(t.project.published, true)).orderBy(asc(t.project.order)),
    db.select().from(t.award).where(eq(t.award.published, true)).orderBy(asc(t.award.order)),
    db.select().from(t.skillGroup).orderBy(asc(t.skillGroup.order)),
  ]);

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center p-8 text-center text-muted">
        Konten belum tersedia. Jalankan <code className="font-mono">npm run db:seed</code>.
      </main>
    );
  }

  const initials = profile.name.split(" ").slice(0, 2).map((w) => w[0]).join("");

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="#" className="font-mono text-sm font-semibold tracking-tight">
            {profile.name.split(" ")[0].toLowerCase()}
            <span className="text-accent">.</span>
          </a>
          <nav className="hidden gap-6 text-sm text-muted md:flex">
            {nav.map(([href, label]) => (
              <a key={href} href={href} className="transition hover:text-fg">{label}</a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section className="flex flex-col-reverse items-start gap-10 py-20 md:flex-row md:items-center md:justify-between md:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} /> {profile.location}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{profile.name}</h1>
            <p className="mt-3 text-lg text-accent">{profile.headline}</p>
            <p className="mt-6 leading-relaxed text-muted">{profile.summary.split(/(?<=\.)\s/)[0]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="btn"><Mail size={16} /> Hubungi Saya</a>
              {profile.cvUrl && (
                <a href={profile.cvUrl} target="_blank" className="btn-ghost"><Download size={16} /> Download CV</a>
              )}
              {profile.github && <a href={profile.github} target="_blank" aria-label="GitHub" className="btn-ghost"><GithubIcon /></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" aria-label="LinkedIn" className="btn-ghost"><LinkedinIcon /></a>}
            </div>
          </div>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={profile.name} className="h-36 w-36 rounded-2xl border border-border object-cover md:h-44 md:w-44" />
          ) : (
            <div className="grid h-36 w-36 place-items-center rounded-2xl bg-navy text-4xl font-semibold text-white md:h-44 md:w-44">
              {initials}
            </div>
          )}
        </section>

        <Section id="about" title="About">
          <div className="grid gap-8 md:grid-cols-2">
            <p className="leading-relaxed text-muted">{profile.summary}</p>
            {profile.education && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="mb-2 text-sm font-medium">Education</p>
                {split(profile.education, "\n").map((l, i) => (
                  <p key={i} className={i === 0 ? "font-semibold" : "text-sm text-muted"}>{l}</p>
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="space-y-8">
            {experiences.map((e) => (
              <li key={e.id} className="grid gap-2 md:grid-cols-[180px_1fr] md:gap-8">
                <p className="font-mono text-xs text-muted md:pt-1">{e.period}</p>
                <div>
                  <h3 className="font-semibold">{e.role}</h3>
                  <p className="text-sm text-accent">{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted marker:text-border">
                    {split(e.bullets, "\n").map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p) => (
              <article key={p.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.title} className="aspect-video w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{p.title}</h3>
                    {(p.link || p.repo) && (
                      <a href={p.link || p.repo!} target="_blank" aria-label="Buka project" className="text-muted transition group-hover:text-accent">
                        <ArrowUpRight size={18} />
                      </a>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {split(p.techStack, ",").map((t) => (
                      <span key={t} className="rounded bg-accent-soft px-2 py-0.5 font-mono text-[11px] text-accent">{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <dl className="grid gap-6 md:grid-cols-2">
            {skills.map((s) => (
              <div key={s.id}>
                <dt className="mb-2 text-sm font-medium">{s.name}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {split(s.items, ",").map((t) => (
                    <span key={t} className="rounded-md border border-border px-2 py-1 text-xs text-muted">{t}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="awards" title="Awards & Publications">
          <ul className="divide-y divide-border">
            {awards.map((a) => (
              <li key={a.id} className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted">{a.issuer}{a.note ? ` — ${a.note}` : ""}</p>
                </div>
                <p className="shrink-0 font-mono text-xs text-muted">{a.date}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="contact" title="Contact">
          <div className="rounded-2xl bg-navy p-8 text-white md:p-12">
            <h3 className="text-2xl font-semibold">Mari berkolaborasi.</h3>
            <p className="mt-2 max-w-xl text-white/70">
              Terbuka untuk peluang GIS / WebGIS Developer, Full-Stack, maupun Solution Architecture.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-navy hover:opacity-90">
                <Mail size={16} /> {profile.email}
              </a>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2 text-sm hover:bg-white/10">
                  <LinkedinIcon /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
