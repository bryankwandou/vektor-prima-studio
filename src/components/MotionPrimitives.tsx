/*
 * PAGE CHOREOGRAPHY TIMELINE (Absolute from mount)
 * ------------------------------------------------------------------------
 *    0ms : Command bar & Top header mount
 *   80ms : Hero badge & Headline stagger in (GSAP power3.out)
 *  240ms : 3D Isometric Topology Canvas scales in (0.94 -> 1.00)
 *  420ms : Live telemetry node inspector cards stagger in
 * ------------------------------------------------------------------------
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const MOTION_TIMING = {
  HERO_STAGGER: 0.09,
  HERO_DURATION: 0.85,
  MAGNETIC_DURATION: 0.32,
  MAGNETIC_RETURN: 0.5,
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

export function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  }, []);

  return <>{children}</>;
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
      x: dx * 0.2,
      y: dy * 0.25,
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm tracking-tight transition-transform duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${baseStyles} ${className}`}
    >
      {children}
    </button>
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
