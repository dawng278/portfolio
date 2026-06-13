import {
  IsometricHero,
  HeroDock,
  ScrollProgressRail,
} from "@/components/isometric-hero";
import { NoiseOverlay } from "@/components/dark-primitives";
import { ProjectArchitectureList } from "@/components/project-architecture-list";
import { profile } from "@/data/profile";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types/portfolio";

export default function Home() {
  const projects = projectsData as Project[];

  return (
    <main className="site-shell relative min-h-screen overflow-x-hidden bg-[#f4f4f0] text-[#050505]">
      <ScrollProgressRail />
      <NoiseOverlay />
      <IsometricHero profile={profile} />
      <HeroDock />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <section
          className="home-plane-section py-24 md:py-32"
          id="about"
        >
          <div className="mb-16 flex items-start justify-between gap-6 border-b border-black/10 pb-5">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
                [ Systems / Identity ]
              </p>
              <p className="mt-2 text-sm font-semibold uppercase text-neutral-900">
                {profile.name}
              </p>
            </div>
            <data
              className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500"
              value="2026-06"
            >
              REV 2026.06
            </data>
          </div>

          <div className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <div>
              <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-neutral-500">
                SE Student / Architecture / Local AI
              </p>
              <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] text-[#050505] sm:text-7xl md:text-8xl">
                {profile.headline}
              </h2>
            </div>
            <p className="text-xl leading-8 text-neutral-600">
              {profile.subtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-1 border border-black/10 bg-black/10 sm:grid-cols-3">
            {[
              "AI as multiplier",
              "Architecture for scale",
              "Low-noise execution",
            ].map((item) => (
              <div
                className="bg-[#f4f4f0] px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-600"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 py-24" id="stack">
          <div className="grid gap-10 md:grid-cols-[1fr_0.85fr]">
            <div>
              <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
                [ Positioning ]
              </p>
              <p className="text-lg leading-8 text-neutral-700">{profile.bio}</p>
            </div>
            <div>
              <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
                [ Stack ]
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.techStack.map((tech) => (
                  <samp className="tech-tag" key={tech}>
                    {tech}
                  </samp>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 py-24" id="projects">
          <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
                [ Selected Systems ]
              </p>
              <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.05em] text-[#050505] sm:text-6xl">
                Project Architecture
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
                Vertical records with cursor-aware lighting, spring elevation,
                and architecture snippets that expose the technical boundary.
              </p>
            </div>
            <data
              className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500"
              value={projects.length}
            >
              {projects.length} records indexed
            </data>
          </div>

          <ProjectArchitectureList projects={projects} />
        </section>

        <footer className="border-t border-black/10 py-12" id="contact">
          <div className="flex items-center gap-3 border-b border-black/10 pb-6">
            <span className="h-2 w-2 bg-[#050505]" aria-hidden="true" />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-600">
              {profile.status}
            </p>
          </div>

          <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex flex-wrap gap-5" aria-label="Contact links">
              {profile.contacts.map((contact) => (
                <a
                  className="secondary-link font-mono text-[0.68rem] uppercase tracking-[0.1em]"
                  href={contact.href}
                  key={contact.label}
                  rel={
                    contact.href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
                >
                  {contact.label}
                </a>
              ))}
            </nav>

            <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
              (c) 2026 {profile.handle}
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
