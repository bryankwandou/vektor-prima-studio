/*
 * PAGE CHOREOGRAPHY TIMELINE (Absolute from mount)
 * ------------------------------------------------------------------------
 *    0ms : KernelBootSequence mounts, counter 00 -> 100% & 4 stage gates
 * 1350ms : Counter reaches 100%, bottom telemetry bar fills 100%
 * 1450ms : Boot curtain lifts (yPercent: -100, power4.inOut, 760ms)
 * 2210ms : Hero badge, kinetic headline, & 3D Geodesic Topology stagger in
 * 2480ms : Live node inspector & rolling metric counters activate
 * ------------------------------------------------------------------------
 */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CheckCircle2, Cpu } from 'lucide-react';
import { VektorLogo } from './TopologyCanvas';
import { useAppSettings } from '../context/AppSettingsContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const MOTION_TIMING = {
  BOOT_COUNT_DURATION: 1.35,
  BOOT_EXIT_DELAY: 0.1,
  BOOT_EXIT_DURATION: 0.76,
  HERO_STAGGER: 0.09,
  HERO_DURATION: 0.88,
  MAGNETIC_DURATION: 0.3,
  MAGNETIC_RETURN: 0.48,
  CURSOR_LERP: 0.18,
  LENIS_LERP: 0.09,
} as const;

let lenisInstance: Lenis | null = null;

export function scrollToSection(id: string) {
  const selector = `#${id}`;
  if (lenisInstance) {
    lenisInstance.scrollTo(selector, { offset: -72 });
    return;
  }
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

export function SmoothScrollWrapper({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  useEffect(() => {
    if (disabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const lenis = new Lenis({
      autoRaf: false,
      lerp: MOTION_TIMING.LENIS_LERP,
      smoothWheel: true,
    });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [disabled]);

  return <>{children}</>;
}

export function KernelBootSequence({ onComplete }: { onComplete: () => void }) {
  const { t, locale } = useAppSettings();
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  const bootStages =
    locale === 'id'
      ? [
          'KALIBRASI_TOKEN_DESAIN_SEMANTIK',
          'INISIALISASI_MESIN_3D_ISOMETRIK',
          'SINKRONISASI_JARINGAN_ANYCAST_EDGE',
          'VERIFIKASI_KEAMANAN_ZERO_TRUST',
        ]
      : [
          'SEMANTIC_DESIGN_TOKEN_CALIBRATION',
          'ISOMETRIC_3D_ENGINE_INITIALIZATION',
          'ANYCAST_EDGE_MESH_SYNCHRONIZATION',
          'ZERO_TRUST_SECURITY_VERIFICATION',
        ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doneRef.current();
      return;
    }

    document.body.style.overflow = 'hidden';
    const state = { val: 0 };

    const tween = gsap.to(state, {
      val: 100,
      duration: MOTION_TIMING.BOOT_COUNT_DURATION,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.round(state.val);
        setProgress(rounded);
        if (barRef.current) {
          barRef.current.style.width = `${rounded}%`;
        }
      },
      onComplete: () => {
        gsap.to('[data-boot-overlay]', {
          yPercent: -100,
          duration: MOTION_TIMING.BOOT_EXIT_DURATION,
          ease: 'power4.inOut',
          delay: MOTION_TIMING.BOOT_EXIT_DELAY,
          onComplete: () => {
            document.body.style.overflow = '';
            doneRef.current();
          },
        });
      },
    });

    return () => {
      tween.kill();
      document.body.style.overflow = '';
    };
  }, []);

  const handleSkip = () => {
    document.body.style.overflow = '';
    doneRef.current();
  };

  return (
    <div
      data-boot-overlay="true"
      className="tech-grid-bg fixed inset-0 z-[100] flex flex-col justify-between bg-bg px-6 py-8 text-fg md:px-12"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <VektorLogo className="size-8 text-fg" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            {t.brand.name} · {t.brand.code}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="min-h-12 rounded-lg border border-line bg-bg-panel px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent hover:text-fg focus-visible:ring-2 focus-visible:ring-accent"
        >
          {locale === 'id' ? 'Masuk Langsung' : 'Skip Intro'}
        </button>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-line bg-bg-panel px-3 py-1.5 font-mono text-xs text-accent">
            <Cpu className="size-3.5" aria-hidden="true" />
            <span>{t.brand.code}</span>
          </div>
          <p className="mt-4 font-display text-2xl font-bold tracking-tight md:text-4xl">
            {t.hero.title}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
            {t.brand.region}
          </p>
        </div>

        <ul className="space-y-2.5 rounded-xl border border-line-strong bg-bg-panel p-5 font-mono text-xs">
          {bootStages.map((stage, idx) => {
            const passed = progress >= (idx + 1) * 22;
            return (
              <li
                key={stage}
                className={`flex items-center justify-between gap-3 transition-opacity duration-200 ${
                  passed ? 'text-fg opacity-100' : 'text-faint opacity-45'
                }`}
              >
                <span>{stage}</span>
                <CheckCircle2
                  className={`size-4 ${passed ? 'text-accent' : 'text-faint'}`}
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span>{t.brand.status}</span>
          <span className="font-display text-5xl font-bold tracking-tight text-accent tabular-nums md:text-7xl">
            {String(progress).padStart(2, '0')}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-panel">
          <div ref={barRef} className="h-full w-0 bg-accent" />
        </div>
      </div>
    </div>
  );
}

export function PrecisionReticleCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');

    const pointer = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    let visible = false;
    let hoveringInteractive = false;

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) {
        visible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      }
      const targetEl = e.target as HTMLElement | null;
      hoveringInteractive = Boolean(
        targetEl?.closest('button, a, input, select, textarea, canvas')
      );
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    let frameId = 0;
    const update = () => {
      ring.x += (pointer.x - ring.x) * MOTION_TIMING.CURSOR_LERP;
      ring.y += (pointer.y - ring.y) * MOTION_TIMING.CURSOR_LERP;
      if (ringRef.current) {
        const scale = hoveringInteractive ? 1.45 : 1;
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) scale(${scale})`;
      }
      frameId = window.requestAnimationFrame(update);
    };
    frameId = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(frameId);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 lg:block"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden size-8 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-accent/65 opacity-0 transition-transform duration-150 ease-out lg:block"
      />
    </>
  );
}

export function TopProgressIndicator() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.2,
          start: 'top top',
          end: 'bottom bottom',
        },
      }
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-transparent">
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}

export function MagneticActionButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = btn.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    gsap.to(btn, {
      x: dx * 0.22,
      y: dy * 0.26,
      duration: MOTION_TIMING.MAGNETIC_DURATION,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: MOTION_TIMING.MAGNETIC_RETURN,
      ease: 'power3.out',
    });
  };

  const baseStyles =
    variant === 'primary'
      ? 'bg-accent text-bg font-semibold hover:opacity-95'
      : 'border border-line-strong bg-bg-panel text-fg font-medium hover:border-accent';

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm tracking-tight transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${baseStyles} ${className}`}
    >
      {children}
    </button>
  );
}

export function TiltSurfaceCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: nx * 7,
      rotateX: -ny * 7,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.55,
      ease: 'power3.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export function RevealBlock({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.style.transitionDelay = `${delay}s`;
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-block ${className}`}>
      {children}
    </div>
  );
}
