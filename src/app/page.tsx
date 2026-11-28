import { asc, eq } from "drizzle-orm";
import { db, schema as t } from "@/lib/db";
import { ThemeToggle } from "@/components/theme-toggle";
import { Reveal } from "@/components/reveal";
import {
  ArrowUpRight, Award, Briefcase, Download, GraduationCap, Hand, Handshake,
  Mail, MapPin, Rocket, Sparkles, Trophy, User, Wrench, Zap, type LucideIcon,
} from "lucide-react";

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

const tints = ["bg-pop-yellow", "bg-pop-pink", "bg-pop-mint", "bg-pop-sky"];

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 py-12 md:py-16">
      <Reveal>
        <h2 className="mb-8 flex items-center gap-3 text-3xl font-extrabold tracking-tight md:text-4xl">
          <span className="grid h-11 w-11 place-items-center rounded-xl border-2 border-fg bg-pop-yellow text-xl shadow-[3px_3px_0_0_var(--shadow)] dark:border-border text-[#16122b]"><Icon size={22} aria-hidden /></span>
          <span className="underline decoration-accent decoration-4 underline-offset-8">{title}</span>
        </h2>
      </Reveal>
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
        No content yet. Run <code className="font-mono">npm run db:seed</code>.
      </main>
    );
  }

  const initials = profile.name.split(" ").slice(0, 2).map((w) => w[0]).join("");
  const allSkills = skills.flatMap((s) => split(s.items, ","));

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-fg bg-bg/90 backdrop-blur dark:border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#" className="rounded-xl border-2 border-fg bg-pop-yellow px-3 py-1 font-mono text-sm font-bold text-[#16122b] shadow-[3px_3px_0_0_var(--shadow)] dark:border-border">
            &lt;ichsan /&gt;
          </a>
          <nav className="hidden gap-1 text-sm font-semibold md:flex">
            {nav.map(([href, label]) => (
              <a key={href} href={href} className="rounded-lg px-3 py-1.5 transition hover:bg-accent-soft hover:text-accent">{label}</a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto border-t-2 border-fg/10 px-4 py-2 text-xs font-semibold md:hidden">
          {nav.map(([href, label]) => (
            <a key={href} href={href} className="chip shrink-0 bg-surface">{label}</a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Hero */}
        <section className="relative flex flex-col-reverse items-start gap-10 py-14 md:flex-row md:items-center md:justify-between md:py-24">
          <div className="hero-in max-w-2xl">
            {profile.location && (
              <p className="chip mb-5 inline-flex items-center gap-1.5 bg-pop-mint text-[#16122b]">
                <MapPin size={13} aria-hidden /> {profile.location}
              </p>
            )}
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Hi, I&apos;m <Hand aria-hidden className="wiggle ml-1 inline-block align-[-0.1em] text-pop-pink" size={40} strokeWidth={2.5} />
              <br />
              <span className="relative inline-block text-accent">
                {profile.name}
                <span aria-hidden className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-1 bg-pop-yellow/80 dark:bg-accent/30" />
              </span>
            </h1>
            <p className="mt-5 text-lg font-semibold sm:text-xl">{profile.headline}</p>
            <p className="mt-4 leading-relaxed text-muted">{profile.summary.split(/(?<=\.)\s/)[0]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="btn"><Mail size={16} /> Get in touch</a>
              {profile.cvUrl && (
                <a href={profile.cvUrl} target="_blank" className="btn-ghost"><Download size={16} /> Download CV</a>
              )}
              {profile.github && <a href={profile.github} target="_blank" aria-label="GitHub" className="btn-ghost"><GithubIcon /></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" aria-label="LinkedIn" className="btn-ghost"><LinkedinIcon /></a>}
            </div>
          </div>
          <div className="relative mx-auto shrink-0 md:mx-0">
            <div className="float absolute -left-6 -top-6 h-14 w-14 rounded-full border-2 border-fg bg-pop-pink dark:border-border" style={{ ["--r" as string]: "0deg" }} />
            <div className="float absolute -bottom-5 -right-5 h-12 w-12 rotate-12 rounded-xl border-2 border-fg bg-pop-sky dark:border-border" style={{ ["--r" as string]: "12deg", animationDelay: "1s" }} />
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.name} className="relative h-44 w-44 rotate-3 rounded-3xl border-2 border-fg object-cover shadow-[8px_8px_0_0_var(--shadow)] dark:border-border md:h-56 md:w-56" />
            ) : (
              <div className="relative grid h-44 w-44 rotate-3 place-items-center rounded-3xl border-2 border-fg bg-accent text-6xl font-extrabold text-white shadow-[8px_8px_0_0_var(--shadow)] dark:border-border dark:text-[#0f0c1f] md:h-56 md:w-56">
                {initials}
              </div>
            )}
          </div>
        </section>

        {allSkills.length > 0 && (
          <div className="marquee -mx-4 my-4 -rotate-1 overflow-hidden border-y-2 border-fg bg-accent py-3 text-white dark:border-border dark:text-[#0f0c1f] sm:-mx-6">
            <div className="marquee-track gap-8 font-mono text-sm font-bold uppercase tracking-wider">
              {[...allSkills, ...allSkills].map((s, i) => (
                <span key={i} className="flex items-center gap-8 whitespace-nowrap">{s} <Sparkles size={16} aria-hidden /></span>
              ))}
            </div>
          </div>
        )}

        <Section id="about" title="About" icon={User}>
          <Reveal>
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <p className="card p-6 leading-relaxed text-muted">{profile.summary}</p>
              {profile.education && (
                <div className="card bg-pop-sky p-6 text-[#16122b]">
                  <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider"><GraduationCap size={16} aria-hidden /> Education</p>
                  {split(profile.education, "\n").map((l, i) => (
                    <p key={i} className={i === 0 ? "text-lg font-extrabold" : "text-sm opacity-80"}>{l}</p>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </Section>

        <Section id="experience" title="Experience" icon={Briefcase}>
          <ol className="relative space-y-6 border-l-4 border-dashed border-accent/40 pl-6 md:pl-8">
            {experiences.map((e, i) => (
              <Reveal key={e.id} delay={i * 60}>
                <li className="relative">
                  <span className={`absolute -left-[38px] top-5 h-5 w-5 rounded-full border-2 border-fg md:-left-[46px] dark:border-border ${tints[i % tints.length]}`} />
                  <div className="card card-hover p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-extrabold">{e.role}</h3>
                        <p className="text-sm font-semibold text-accent">{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                      </div>
                      <span className={`chip ${tints[i % tints.length]} text-[#16122b]`}>{e.period}</span>
                    </div>
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-accent">
                      {split(e.bullets, "\n").map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Section>

        <Section id="projects" title="Projects" icon={Rocket}>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 80} className="h-full">
                <article className="card card-hover group flex h-full flex-col overflow-hidden">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title} className="aspect-video w-full border-b-2 border-fg object-cover dark:border-border" />
                  ) : (
                    <div className={`grid aspect-video place-items-center border-b-2 border-fg text-[#16122b] dark:border-border ${tints[i % tints.length]}`}><Wrench size={44} aria-hidden /></div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-extrabold">{p.title}</h3>
                      {(p.link || p.repo) && (
                        <a href={p.link || p.repo!} target="_blank" aria-label="Open project" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-fg bg-pop-yellow text-[#16122b] transition group-hover:rotate-12 dark:border-border">
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {split(p.techStack, ",").map((s) => (
                        <span key={s} className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">{s}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills" icon={Zap}>
          <div className="grid gap-6 md:grid-cols-2">
            {skills.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 80}>
                <div className="card h-full p-5">
                  <h3 className={`chip mb-3 text-[#16122b] ${tints[i % tints.length]}`}>{s.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {split(s.items, ",").map((x) => (
                      <span key={x} className="rounded-lg border-2 border-border/60 bg-bg px-2.5 py-1 text-xs font-medium transition hover:-translate-y-0.5 hover:border-accent hover:text-accent">{x}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="awards" title="Awards & Publications" icon={Trophy}>
          <div className="grid gap-4">
            {awards.map((a, i) => (
              <Reveal key={a.id} delay={i * 50}>
                <div className="card card-hover flex flex-col gap-2 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-fg text-[#16122b] dark:border-border ${tints[i % tints.length]}`}><Award size={20} aria-hidden /></span>
                    <div>
                      <p className="font-extrabold">{a.title}</p>
                      <p className="text-sm text-muted">{a.issuer}{a.note ? ` — ${a.note}` : ""}</p>
                    </div>
                  </div>
                  <p className="chip shrink-0 self-start bg-bg font-mono md:self-center">{a.date}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact" icon={Mail}>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border-2 border-fg bg-accent p-8 text-white shadow-[8px_8px_0_0_var(--shadow)] dark:border-border dark:text-[#0f0c1f] md:p-12">
              <div className="float absolute -right-6 -top-6 h-28 w-28 rounded-full bg-pop-yellow/90" />
              <div className="float absolute -bottom-8 right-24 h-20 w-20 rotate-12 rounded-2xl bg-pop-pink/90" style={{ animationDelay: "1.5s" }} />
              <h3 className="relative flex items-center gap-3 text-3xl font-extrabold md:text-4xl">Let&apos;s work together <Handshake aria-hidden size={34} className="shrink-0" /></h3>
              <p className="relative mt-3 max-w-xl opacity-90">
                Open to GIS / WebGIS Developer, Full-Stack, and Solution Architecture opportunities.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 break-all rounded-xl border-2 border-[#16122b] bg-white px-4 py-2 text-sm font-bold text-[#16122b] shadow-[3px_3px_0_0_#16122b] transition hover:-translate-y-0.5">
                  <Mail size={16} /> {profile.email}
                </a>
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#16122b] bg-pop-yellow px-4 py-2 text-sm font-bold text-[#16122b] shadow-[3px_3px_0_0_#16122b] transition hover:-translate-y-0.5">
                    <LinkedinIcon /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </Section>
      </main>

      <footer className="mt-8 border-t-2 border-fg py-8 text-center text-sm font-medium text-muted dark:border-border">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
