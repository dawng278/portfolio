"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
  type ReactNode,
} from "react";
import { slowSpring, spring } from "@/components/dark-primitives";
import type { Profile } from "@/types/portfolio";
import GlassSurface from "./GlassSurface";

type IsometricHeroProps = { profile: Profile };

/* ── Palette ───────────────────────────────── */
const palette = [
  { color: "rgb(60 236 255)",  glow: "rgb(60 236 255 / 0.5)"  },
  { color: "rgb(191 114 255)", glow: "rgb(191 114 255 / 0.46)" },
  { color: "rgb(255 191 52)",  glow: "rgb(255 191 52 / 0.48)"  },
  { color: "rgb(78 255 142)",  glow: "rgb(78 255 142 / 0.46)"  },
  { color: "rgb(255 117 161)", glow: "rgb(255 117 161 / 0.42)" },
];

const WORDMARK_LAYER_COUNT = 10;
const wordmarkLayers = Array.from({ length: WORDMARK_LAYER_COUNT }, (_, i) => i);
const GRID_CELL_COUNT = 48;
const SUBCELLS_PER_CELL = 2;
const TRAIL_CELL_COUNT = 10;
const TRAIL_FADE_MS = 560;
const trailCells = Array.from({ length: TRAIL_CELL_COUNT }, (_, i) => i);
const hoverCellStyle = {
  width: "var(--plane-subcell)",
  height: "var(--plane-subcell)",
  background:
    "linear-gradient(135deg, rgb(255 255 255 / 0.2), transparent 54%), linear-gradient(var(--pixel-hover, rgb(60 236 255)), var(--pixel-hover, rgb(60 236 255)))",
  boxShadow:
    "inset 0 0 0 1px rgb(255 255 255 / 0.34), 0 0 0 1px rgb(255 255 255 / 0.18), 0 0 12px var(--pixel-glow, rgb(60 236 255 / 0.5))",
} satisfies CSSProperties;

/* ── Dock items ─────────────────────────────── */
const dockItems = [
  {
    label: "Home", href: "#top",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 6.5L8 2l6 4.5V14H10v-3.5H6V14H2V6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
  {
    label: "About", href: "#about",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="5.5" r="1" fill="currentColor"/><path d="M8 7.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: "Projects", href: "#projects",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="2" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="9" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: "Stack", href: "#stack",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 11h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    label: "Resume", href: "https://github.com/dawng278",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="1.5" width="10" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 5h5M5.5 7.5h5M5.5 10h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
  },
  {
    label: "Contact", href: "#contact",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="4" width="12" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
];

/* ── Floating object wrapper ─────────────────── */
function FloatingObject({
  children,
  className,
  glow,
  href,
  label,
  pathLabel,
}: {
  children: ReactNode;
  className: string;
  glow: string;
  href?: string;
  label?: string;
  pathLabel?: string;
}) {
  const classNames = `floating-object ${href ? "floating-object-link" : ""} ${className}`;
  const style = { "--object-glow": glow } as CSSProperties;
  const content = (
    <>
      {children}
      {pathLabel ? (
        <span className="object-path-label font-mono" aria-hidden="true">
          {pathLabel}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <motion.a
        aria-label={label}
        className={classNames}
        href={href}
        style={style}
        transition={slowSpring}
        whileHover={{ y: -8, scale: 1.018 }}
        whileTap={{ y: -4, scale: 0.985 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={classNames}
      style={style}
      transition={slowSpring}
      whileHover={{ y: -8, scale: 1.018 }}
      whileTap={{ y: -4, scale: 0.985 }}
    >
      {content}
    </motion.div>
  );
}

/* ── Hero pixel field: CSS grid + small hover trail pool. ── */
function PixelField({
  trailRefs,
}: {
  trailRefs: RefObject<Array<HTMLSpanElement | null>>;
}) {
  return (
    <div className="pixel-field" aria-hidden="true">
      {trailCells.map((index) => (
        <span
          className="hero-hover-cell"
          key={index}
          style={hoverCellStyle}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
        />
      ))}
    </div>
  );
}

/* ── Live clock ──────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState("--:--:-- --");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{time}</>;
}

/*
  PagePixelBackdrop — pure CSS grid (no DOM cells).
  A single spotlight <span> follows the cursor via CSS custom
  properties updated synchronously for sub-10ms hover recognition.
  Zero React re-renders.
*/
export function PagePixelBackdrop() {
  const spotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    const colors = palette;
    let lastX = -200;
    let lastY = -200;
    let cachedCell = 24;

    function syncCellSize() {
      cachedCell = Math.max(
        24,
        Math.max(window.innerWidth, window.innerHeight) / 44,
      );
    }

    function onMove(e: PointerEvent) {
      const activeSpot = spotRef.current;
      if (!activeSpot) return;

      const cell = cachedCell;
      const col = Math.floor(e.clientX / cell);
      const row = Math.floor(e.clientY / cell);
      const cx = (col + 0.5) * cell;
      const cy = (row + 0.5) * cell;

      if (cx === lastX && cy === lastY) return;
      lastX = cx; lastY = cy;

      const colorIdx = ((row * 44 + col) * 7) % colors.length;
      activeSpot.style.setProperty("--spot-x", `${cx}px`);
      activeSpot.style.setProperty("--spot-y", `${cy}px`);
      activeSpot.style.setProperty("--spot-color", colors[colorIdx].color);
      activeSpot.style.setProperty("--spot-glow", colors[colorIdx].glow);
      activeSpot.style.opacity = "1";
    }

    function onLeave() {
      if (spot) spot.style.opacity = "0";
    }

    syncCellSize();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", syncCellSize, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", syncCellSize);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className="page-pixel-backdrop" aria-hidden="true" />
      <span
        ref={spotRef}
        className="page-pixel-spotlight"
        aria-hidden="true"
        style={{
          opacity: 0,
          transition: "opacity 0ms linear",
        }}
      />
    </>
  );
}

/* ── Scroll progress rail ────────────────────── */
export function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="scroll-progress-rail" aria-hidden="true">
      <motion.span
        className="scroll-progress-fill"
        style={{ scaleY: scrollYProgress }}
        transformTemplate={(_, g) => `${g} translateZ(0)`}
      />
    </div>
  );
}

/* ── Floating shapes ─────────────────────────── */
function TerminalPlaque({ profile }: { profile: Profile }) {
  return (
    <div className="terminal-plaque object-plane">
      <div className="flex items-start justify-between gap-8 border-b border-white/20 pb-3">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/60">Systems-Minded Builder</p>
          <p className="mt-2 text-xl font-semibold uppercase leading-none tracking-[-0.03em] text-white">{profile.name}</p>
        </div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/50">REV 06</span>
      </div>
      <p className="mt-4 max-w-[18rem] font-mono text-[0.64rem] uppercase leading-5 tracking-[0.08em] text-white/70">{profile.subtitle}</p>
      <div className="mt-5 grid grid-cols-4 border border-white/20">
        {["AI", "SYS", "DATA", "FLOW"].map((item) => (
          <span key={item} className="border-r border-white/20 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/55 last:border-r-0">{item}</span>
        ))}
      </div>
    </div>
  );
}

function PyramidObject({ code }: { code: string }) {
  return (
    <div className="pyramid-object object-plane">
      <div className="pyramid-face pyramid-face-left" />
      <div className="pyramid-face pyramid-face-right" />
      <div className="pyramid-face pyramid-face-bottom" />
      <span className="pyramid-code font-mono">{code}</span>
    </div>
  );
}

function AvatarPlate({ profile }: { profile: Profile }) {
  return (
    <div className="avatar-plate object-plane">
      <Image alt={`${profile.name} avatar`} className="avatar-image" height={240} priority src="/dawng278-avatar.png" width={240} />
      <div className="avatar-scan" aria-hidden="true" />
      <span className="plate-label font-mono">{"// CODE IS DESIGN"}</span>
    </div>
  );
}

function MetalPlate() {
  return (
    <div className="metal-plate object-plane">
      <span className="bolt bolt-a" /><span className="bolt bolt-b" />
      <span className="bolt bolt-c" /><span className="bolt bolt-d" />
      <span className="metal-speaker" />
    </div>
  );
}

function NotebookPlate() {
  return (
    <div className="notebook-plate object-plane">
      <span className="plant-pot" />
      <span className="plant-leaf leaf-a" /><span className="plant-leaf leaf-b" /><span className="plant-leaf leaf-c" />
      <span className="notebook-page notebook-left" /><span className="notebook-page notebook-right" />
      <span className="notebook-spine" /><span className="notebook-pen" />
    </div>
  );
}

/* ── Main hero ───────────────────────────────── */
export function IsometricHero({ profile }: IsometricHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const heroRect = useRef({ left: 0, top: 0 });
  const fieldMetrics = useRef({
    ax: 1,
    ay: 0,
    bx: 0,
    by: 1,
    cell: 32,
    det: 1,
    height: 0,
    originScreenX: 0,
    originScreenY: 0,
    subcell: 16,
    width: 0,
  });
  const lastCell = useRef({ x: -1, y: -1 });
  const lastTrailIndex = useRef<number | null>(null);
  const nextTrailIndex = useRef(0);
  const trailAnimations = useRef<Array<Animation | null>>([]);

  function syncHeroRect() {
    const hero = heroRef.current;
    const field = trailRefs.current[0]?.parentElement;
    if (!hero || !field) return;

    const rect = hero.getBoundingClientRect();
    heroRect.current = { left: rect.left, top: rect.top };

    const width = field.offsetWidth;
    const height = field.offsetHeight;
    const cell = width / GRID_CELL_COUNT;
    const subcell = cell / SUBCELLS_PER_CELL;

    field.style.setProperty("--plane-cell", `${cell}px`);
    field.style.setProperty("--plane-subcell", `${subcell}px`);
    trailRefs.current.forEach((trailCell) => {
      trailCell?.style.setProperty("--plane-cell", `${cell}px`);
      trailCell?.style.setProperty("--plane-subcell", `${subcell}px`);
    });

    const localToScreen = (x: number, y: number) => {
      const probe = trailRefs.current[0];
      if (!probe) return { x: 0, y: 0 };

      const previousX = probe.style.getPropertyValue("--hover-x");
      const previousY = probe.style.getPropertyValue("--hover-y");

      probe.style.setProperty("--hover-x", `${x}px`);
      probe.style.setProperty("--hover-y", `${y}px`);

      const probeRect = probe.getBoundingClientRect();
      const point = {
        x: probeRect.left + probeRect.width / 2,
        y: probeRect.top + probeRect.height / 2,
      };

      if (previousX) probe.style.setProperty("--hover-x", previousX);
      if (previousY) probe.style.setProperty("--hover-y", previousY);

      return point;
    };

    const origin = localToScreen(0, 0);
    const xAxis = localToScreen(cell, 0);
    const yAxis = localToScreen(0, cell);
    const ax = xAxis.x - origin.x;
    const ay = xAxis.y - origin.y;
    const bx = yAxis.x - origin.x;
    const by = yAxis.y - origin.y;
    const det = ax * by - ay * bx || 1;

    fieldMetrics.current = {
      ax,
      ay,
      bx,
      by,
      cell,
      det,
      height,
      originScreenX: origin.x,
      originScreenY: origin.y,
      subcell,
      width,
    };
  }

  useEffect(() => {
    const hero = heroRef.current;
    const handleNativePointerMove = (event: PointerEvent) => {
      paintPointer(event.clientX, event.clientY);
    };
    const handleNativePointerLeave = () => {
      handlePointerLeave();
    };

    syncHeroRect();
    hero?.addEventListener("pointermove", handleNativePointerMove);
    hero?.addEventListener("pointerleave", handleNativePointerLeave);
    window.addEventListener("resize", syncHeroRect, { passive: true });
    return () => {
      hero?.removeEventListener("pointermove", handleNativePointerMove);
      hero?.removeEventListener("pointerleave", handleNativePointerLeave);
      window.removeEventListener("resize", syncHeroRect);
      trailAnimations.current.forEach((animation) => {
        animation?.cancel();
      });
    };
  }, []);

  function paintTrailCell(index: number, subX: number, subY: number, subcell: number) {
    const trailCell = trailRefs.current[index];
    if (!trailCell) return;

    trailAnimations.current[index]?.cancel();

    const color = palette[((subY * 53 + subX) * 7) % palette.length];
    trailCell.style.setProperty("--pixel-hover", color.color);
    trailCell.style.setProperty("--pixel-glow", color.glow);
    trailCell.style.setProperty("--hover-x", `${(subX + 0.5) * subcell}px`);
    trailCell.style.setProperty("--hover-y", `${(subY + 0.5) * subcell}px`);
    trailCell.style.transitionDuration = "0ms";
    trailCell.style.opacity = "1";

    const animation = trailCell.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 0.62, offset: 0.24 },
        { opacity: 0.28, offset: 0.55 },
        { opacity: 0.08, offset: 0.82 },
        { opacity: 0, offset: 1 },
      ],
      {
        duration: TRAIL_FADE_MS,
        easing: "linear",
        fill: "forwards",
      },
    );

    trailAnimations.current[index] = animation;
    animation.onfinish = () => {
      if (trailAnimations.current[index] !== animation) return;
      trailCell.style.opacity = "0";
      trailAnimations.current[index] = null;
    };
  }

  function paintPointer(clientX: number, clientY: number) {
    if (!trailRefs.current[0]) return;

    const metrics = fieldMetrics.current;
    const dx = clientX - metrics.originScreenX;
    const dy = clientY - metrics.originScreenY;
    const cellX = (dx * metrics.by - dy * metrics.bx) / metrics.det;
    const cellY = (metrics.ax * dy - metrics.ay * dx) / metrics.det;
    const cell = metrics.cell;
    const subcell = metrics.subcell;
    const x = cellX * cell;
    const y = cellY * cell;

    if (x < 0 || y < 0 || x > metrics.width || y > metrics.height) {
      return;
    }

    const subX = Math.floor(x / subcell);
    const subY = Math.floor(y / subcell);

    if (subX === lastCell.current.x && subY === lastCell.current.y) {
      if (lastTrailIndex.current !== null) {
        paintTrailCell(lastTrailIndex.current, subX, subY, subcell);
      }
      return;
    }

    lastCell.current = { x: subX, y: subY };
    const trailIndex = nextTrailIndex.current;
    nextTrailIndex.current = (nextTrailIndex.current + 1) % TRAIL_CELL_COUNT;
    lastTrailIndex.current = trailIndex;
    paintTrailCell(trailIndex, subX, subY, subcell);
  }

  function handlePointerLeave() {
    lastCell.current = { x: -1, y: -1 };
    lastTrailIndex.current = null;
  }

  return (
    <motion.section
      ref={heroRef}
      className="isometric-hero"
      id="top"
      onPointerEnter={() => {
        syncHeroRect();
      }}
    >
      <PixelField trailRefs={trailRefs} />

      {/* Corner metas */}
      <div className="hero-meta hero-meta-time font-mono"><LiveClock /></div>
      <div className="hero-meta hero-meta-resolution font-mono">1920×1080</div>
      <div className="hero-meta hero-meta-visit font-mono">Last visit from Ho Chi Minh, Vietnam</div>
      <div className="hero-triangle" aria-hidden="true" />

      {/* Floating objects — match reference image layout */}
      <FloatingObject
        className="floating-object-terminal"
        glow="rgb(191 114 255 / 0.55)"
        href="#projects"
        label="Jump to projects"
        pathLabel="/projects"
      >
        <TerminalPlaque profile={profile} />
      </FloatingObject>
      <FloatingObject className="floating-object-pyramid-a" glow="rgb(255 191 52 / 0.58)">
        <PyramidObject code="// 01" />
      </FloatingObject>
      <FloatingObject className="floating-object-pyramid-b" glow="rgb(255 117 161 / 0.52)">
        <PyramidObject code="// 02" />
      </FloatingObject>
      <FloatingObject
        className="floating-object-avatar"
        glow="rgb(78 255 142 / 0.52)"
        href="#about"
        label="Jump to about"
        pathLabel="/about"
      >
        <AvatarPlate profile={profile} />
      </FloatingObject>
      <FloatingObject className="floating-object-pyramid-c" glow="rgb(255 117 161 / 0.42)">
        <PyramidObject code="// 03" />
      </FloatingObject>
      <FloatingObject
        className="floating-object-metal"
        glow="rgb(60 236 255 / 0.58)"
        href="#stack"
        label="Jump to stack"
        pathLabel="/stack"
      >
        <MetalPlate />
      </FloatingObject>
      <FloatingObject
        className="floating-object-notebook"
        glow="rgb(78 255 142 / 0.54)"
        href="#contact"
        label="Jump to contact"
        pathLabel="/contact"
      >
        <NotebookPlate />
      </FloatingObject>

      {/*
        PORTFOLIO wordmark — always screen-centered.
        .hero-wordmark-shell: translate(-50%,-50%) in SCREEN space.
        .hero-wordmark:       perspective + rotateX + skewY in LOCAL space.
        This separation guarantees visual centering on all devices.
      */}
      <div className="hero-wordmark-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-wordmark">
            {/* Floor shadow layer */}
            <span className="hero-wordmark-shadow" aria-hidden="true">
              PORTFOLIO
            </span>
            {/* 3D layers */}
            {wordmarkLayers.map((i) => {
              const isBase = i === 0;
              const isTop = i === WORDMARK_LAYER_COUNT - 1;
              return (
                <span
                  key={i}
                  className={`hero-wordmark-layer${isBase ? " hero-wordmark-layer-base" : ""}${isTop ? " hero-wordmark-layer-top" : ""}`}
                  style={{ "--layer": i } as CSSProperties}
                  aria-hidden={i < WORDMARK_LAYER_COUNT - 1 ? "true" : undefined}
                >
                  PORTFOLIO
                </span>
              );
            })}
          </h1>
        </motion.div>
      </div>
    </motion.section>
  );
}

export function HeroDock() {
  return (
    <GlassSurface
      className="hero-dock"
      width="max-content"
      height="auto"
      borderRadius={999}
      borderWidth={0.06}
      brightness={72}
      opacity={0.88}
      blur={14}
      displace={1.2}
      backgroundOpacity={0.06}
      saturation={1.8}
      distortionScale={-140}
    >
      <nav aria-label="Hero navigation" style={{ display: "flex", gap: "0.12rem" }}>
        {dockItems.map((item) => {
          const isExt = item.href.startsWith("https://");
          return (
            <motion.a
              key={item.label}
              aria-label={item.label}
              className="dock-button font-mono"
              href={item.href}
              rel={isExt ? "noopener noreferrer" : undefined}
              target={isExt ? "_blank" : undefined}
              transition={spring}
              whileHover={{ y: -4, scale: 1.06 }}
              whileTap={{ y: -1, scale: 0.93 }}
            >
              <span className="dock-glyph">{item.icon}</span>
              <span className="dock-label">{item.label}</span>
            </motion.a>
          );
        })}
      </nav>
    </GlassSurface>
  );
}
