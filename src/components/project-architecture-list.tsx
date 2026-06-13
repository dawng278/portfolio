"use client";

import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useState, type CSSProperties, type MouseEvent } from "react";
import {
  slowSpring,
  spring,
  SpringButton,
  SyntaxSnippet,
} from "@/components/dark-primitives";
import type { Project } from "@/types/portfolio";

type ProjectArchitectureListProps = {
  projects: Project[];
};

type SpotlightStyle = CSSProperties & {
  "--spotlight-x": MotionValue<string>;
  "--spotlight-y": MotionValue<string>;
};

function MotionAccordion({
  isOpen,
  project,
}: {
  isOpen: boolean;
  project: Project;
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
          className="overflow-hidden"
          exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
          initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
          transition={spring}
        >
          <motion.div
            className="pt-5"
            layoutId={`${project.id}-architecture-panel`}
            transition={spring}
          >
            <div className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
              [ Architecture Snippet ]
            </div>
            <SyntaxSnippet snippet={project.architectureSnippet} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SpotlightProjectCard({
  index,
  isOpen,
  onToggle,
  project,
}: {
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  project: Project;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, spring);
  const smoothY = useSpring(mouseY, spring);
  const spotlightX = useMotionTemplate`${smoothX}px`;
  const spotlightY = useMotionTemplate`${smoothY}px`;
  const unit = String(index + 1).padStart(2, "0");

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <motion.article
      className="spotlight-card group"
      layout
      onMouseMove={handleMouseMove}
      style={
        {
          "--spotlight-x": spotlightX,
          "--spotlight-y": spotlightY,
        } as SpotlightStyle
      }
      transition={slowSpring}
      whileHover={{
        y: -4,
        scale: 1.004,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -1px 0 rgba(5,5,5,0.08), 0 28px 80px rgba(5,5,5,0.18)",
      }}
      whileTap={{ scale: 0.997, y: -2 }}
    >
      <div className="relative z-10 grid min-w-0 gap-6 md:grid-cols-[5rem_1fr]">
        <div className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
          <data value={project.date}>UNIT / {unit}</data>
          <div className="mt-2 text-neutral-700">{project.date}</div>
        </div>

        <div className="min-w-0">
          <div className="grid min-w-0 gap-5 md:grid-cols-[1fr_auto] md:items-start">
            <div className="min-w-0">
              <h3 className="break-words text-xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#050505] sm:text-2xl md:text-3xl">
                {project.title}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">
                {project.outcome}
              </p>
            </div>

            <a
              className="secondary-link mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em]"
              href={project.githubUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>

          <dl className="mt-6 grid gap-3 border-t border-black/10 pt-5 sm:grid-cols-[5rem_1fr]">
            <dt className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
              Focus
            </dt>
            <dd className="flex min-w-0 flex-wrap gap-2">
              {project.focus.map((item) => (
                <samp className="tech-tag" key={item}>
                  {item}
                </samp>
              ))}
            </dd>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <SpringButton
              aria-controls={`${project.id}-architecture`}
              aria-expanded={isOpen}
              onClick={onToggle}
              type="button"
            >
              [{isOpen ? "Hide Architecture" : "View Architecture"}]
            </SpringButton>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-neutral-500">
              Layout projection / spring 400-30
            </span>
          </div>

          <div id={`${project.id}-architecture`}>
            <MotionAccordion isOpen={isOpen} project={project} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectArchitectureList({
  projects,
}: ProjectArchitectureListProps) {
  const [openProjectId, setOpenProjectId] = useState<string | null>(
    projects[0]?.id ?? null,
  );

  return (
    <motion.div className="space-y-4" layout>
      {projects.map((project, index) => (
        <SpotlightProjectCard
          index={index}
          isOpen={openProjectId === project.id}
          key={project.id}
          onToggle={() =>
            setOpenProjectId((current) =>
              current === project.id ? null : project.id,
            )
          }
          project={project}
        />
      ))}
    </motion.div>
  );
}
