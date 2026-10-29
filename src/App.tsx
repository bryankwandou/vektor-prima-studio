import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Globe,
  Layers,
  Menu,
  Moon,
  Radio,
  Server,
  Shield,
  Sliders,
  Sun,
  Terminal,
  X,
} from 'lucide-react';
import { useAppSettings } from './context/AppSettingsContext';
import {
  BlueprintFlowCanvas,
  IsometricTopologyCanvas,
  SimulatorWaveCanvas,
  VektorLogo,
} from './components/TopologyCanvas';
import {
  KernelBootSequence,
  MOTION_TIMING,
  MagneticActionButton,
  PrecisionReticleCursor,
  RevealBlock,
  SmoothScrollWrapper,
  TiltSurfaceCard,
  TopProgressIndicator,
  scrollToSection,
} from './components/MotionPrimitives';

function ArchitecturalHeader({ hidden }: { hidden: boolean }) {
  const { t, theme, toggleTheme, locale, toggleLocale } = useAppSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'blueprints', label: t.nav.blueprints },
    { id: 'simulator', label: t.nav.simulator },
    { id: 'deliveries', label: t.nav.deliveries },
    { id: 'roadmap', label: t.nav.roadmap },
  ];

  const handleJump = (id: string) => {
    setMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md transition-opacity duration-500 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="border-b border-line bg-bg-panel px-4 py-1.5 font-mono text-[11px] text-muted md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-accent" />
            <span className="font-medium tracking-wider text-fg">{t.brand.code}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden tracking-wider sm:inline">{t.brand.status}</span>
          </div>
          <div className="tracking-widest text-faint">{t.brand.region}</div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-10">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t.nav.homeAria}
          className="flex min-h-12 items-center gap-3 rounded-lg pr-2 focus-visible:ring-2 focus-visible:ring-accent"
        >
          <VektorLogo className="size-8 text-fg" />
          <span className="font-display text-base font-bold tracking-tight text-fg">
            {t.brand.name}
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t.brand.name}>
          {navLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleJump(item.id)}
              className="min-h-12 rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-bg-subtle hover:text-fg focus-visible:ring-2 focus-visible:ring-accent"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.nav.switchLang}
            className="inline-flex min-h-12 items-center gap-1.5 rounded-lg border border-line bg-bg-panel px-3.5 py-2 font-mono text-xs font-semibold uppercase text-fg transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Globe className="size-4 text-accent" aria-hidden="true" />
            <span>{locale.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t.nav.switchTheme}
            className="grid size-12 place-items-center rounded-lg border border-line bg-bg-panel text-fg transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-accent"
          >
            {theme === 'dark' ? (
              <Sun className="size-4 text-accent" aria-hidden="true" />
            ) : (
              <Moon className="size-4 text-accent" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleJump('partnership')}
            className="hidden min-h-12 items-center gap-1.5 rounded-lg bg-fg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-bg transition-transform active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex"
          >
            <span>{t.nav.partnership}</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="grid size-12 place-items-center rounded-lg border border-line bg-bg-panel lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-line bg-bg-panel px-4 py-6 lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleJump(item.id)}
                className="min-h-12 rounded-lg px-3 py-3 text-left font-display text-lg font-semibold text-fg hover:bg-bg-subtle"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleJump('partnership')}
              className="mt-2 min-h-12 rounded-lg bg-accent px-4 py-3 text-center font-display text-sm font-semibold uppercase tracking-wider text-bg"
            >
              {t.nav.partnership}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroArchitectureSection({ ready }: { ready: boolean }) {
  const { t } = useAppSettings();
  const heroRef = useRef<HTMLElement | null>(null);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [burstSignal, setBurstSignal] = useState(0);

  const selectedNode = t.hero.nodes[activeNodeIndex] ?? t.hero.nodes[0];

  useEffect(() => {
    if (!ready) return;
    const el = heroRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-hero-enter]'),
        { y: 26, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: MOTION_TIMING.HERO_DURATION,
          stagger: MOTION_TIMING.HERO_STAGGER,
          ease: 'power3.out',
        }
      );
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={heroRef} className="tech-grid-bg relative border-b border-line py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <div
              data-hero-enter="true"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-bg-panel px-3 py-1.5 font-mono text-[11px] font-medium tracking-wider text-accent"
            >
              <Terminal className="size-3.5" aria-hidden="true" />
              <span>{t.hero.badge}</span>
            </div>

            <h1
              data-hero-enter="true"
              className="mt-6 font-display text-4xl font-bold leading-[1.06] tracking-tight text-fg sm:text-5xl lg:text-[3.5rem]"
            >
              {t.hero.title}
            </h1>

            <p
              data-hero-enter="true"
              className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg"
            >
              {t.hero.subtitle}
            </p>

            <div
              data-hero-enter="true"
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <MagneticActionButton
                variant="primary"
                onClick={() => scrollToSection('partnership')}
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </MagneticActionButton>

              <MagneticActionButton
                variant="secondary"
                onClick={() => scrollToSection('simulator')}
              >
                <Sliders className="size-4 text-accent" aria-hidden="true" />
                <span>{t.hero.secondaryCta}</span>
              </MagneticActionButton>
            </div>

            <div
              data-hero-enter="true"
              className="mt-12 grid grid-cols-2 gap-4 border-t border-line pt-8 sm:grid-cols-4"
            >
              {t.hero.metrics.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-line bg-bg-panel/80 p-3.5"
                >
                  <p className="font-display text-2xl font-bold tracking-tight text-fg tabular-nums md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            data-hero-enter="true"
            className="overflow-hidden rounded-xl border border-line-strong bg-bg-panel"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Radio className="size-4 text-accent" aria-hidden="true" />
                <span className="font-mono text-xs font-semibold tracking-wider text-fg">
                  {t.hero.canvasTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBurstSignal((prev) => prev + 1);
                  setActiveNodeIndex((prev) => (prev + 1) % t.hero.nodes.length);
                }}
                className="min-h-12 rounded-lg border border-line bg-bg px-3.5 py-2 font-mono text-xs font-medium text-accent transition-colors hover:border-accent focus-visible:ring-2 focus-visible:ring-accent"
              >
                {t.hero.triggerBurst}
              </button>
            </div>

            <div className="relative h-72 w-full bg-bg sm:h-80">
              <IsometricTopologyCanvas
                activeNodeIndex={activeNodeIndex}
                onSelectNode={(idx) => {
                  setActiveNodeIndex(idx);
                  setBurstSignal((prev) => prev + 1);
                }}
                burstSignal={burstSignal}
              />
              <p className="pointer-events-none absolute inset-x-4 bottom-3 text-center font-mono text-[11px] text-faint">
                {t.hero.canvasHint}
              </p>
            </div>

            <div className="border-t border-line bg-bg-panel p-5">
              <div className="flex flex-wrap gap-2">
                {t.hero.nodes.map((node, idx) => (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      setActiveNodeIndex(idx);
                      setBurstSignal((prev) => prev + 1);
                    }}
                    className={`min-h-12 rounded-lg px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                      idx === activeNodeIndex
                        ? 'bg-accent font-semibold text-bg'
                        : 'border border-line bg-bg text-muted hover:text-fg'
                    }`}
                  >
                    0{idx + 1} · {node.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-line bg-bg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-base font-bold text-fg">
                      {selectedNode.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{selectedNode.role}</p>
                  </div>
                  <span className="rounded-full border border-line bg-bg-panel px-2.5 py-1 font-mono text-[11px] text-accent">
                    {selectedNode.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3 font-mono text-xs">
                  <div>
                    <span className="text-faint">LATENCY: </span>
                    <span className="font-semibold text-fg">{selectedNode.latency}</span>
                  </div>
                  <div>
                    <span className="text-faint">THROUGHPUT: </span>
                    <span className="font-semibold text-fg">
                      {selectedNode.throughput}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilityStreamBar() {
  const { t } = useAppSettings();
  const items = [...t.ticker, ...t.ticker];

  return (
    <div className="overflow-hidden border-b border-line bg-bg-panel py-4">
      <div className="ticker-stream gap-12 px-6">
        {items.map((label, idx) => (
          <span
            key={`${label}-${idx}`}
            className="flex items-center gap-12 font-mono text-xs font-medium tracking-[0.22em] text-muted"
          >
            <span>{label}</span>
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}

function BlueprintExplorerSection({
  onSelectBlueprintForForm,
}: {
  onSelectBlueprintForForm: (title: string) => void;
}) {
  const { t } = useAppSettings();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const currentTab = t.blueprints.tabs[activeTabIdx] ?? t.blueprints.tabs[0];

  return (
    <section id="blueprints" className="scroll-mt-20 border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <RevealBlock>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.blueprints.kicker}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">
            {t.blueprints.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted">
            {t.blueprints.subheading}
          </p>
        </RevealBlock>

        <RevealBlock delay={0.06} className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.blueprints.tabs.map((tab, idx) => {
              const active = idx === activeTabIdx;
              return (
                <TiltSurfaceCard key={tab.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTabIdx(idx);
                      onSelectBlueprintForForm(tab.title);
                    }}
                    className={`min-h-12 h-full w-full rounded-xl border p-5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? 'border-accent bg-bg-panel'
                        : 'border-line bg-bg hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className={active ? 'font-semibold text-accent' : 'text-faint'}>
                        {tab.code}
                      </span>
                      <Layers
                        className={`size-4 ${active ? 'text-accent' : 'text-faint'}`}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-2 font-display text-lg font-bold text-fg">
                      {tab.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {tab.tagline}
                    </p>
                  </button>
                </TiltSurfaceCard>
              );
            })}
          </div>
        </RevealBlock>

        <RevealBlock delay={0.12} className="mt-6">
          <div className="grid gap-8 rounded-xl border border-line bg-bg-panel p-6 md:p-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
                {currentTab.code} // {currentTab.title}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-fg md:text-3xl">
                {currentTab.tagline}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                {currentTab.description}
              </p>

              <div className="mt-6">
                <BlueprintFlowCanvas
                  activeTabIdx={activeTabIdx}
                  stages={currentTab.pipeline}
                />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                {currentTab.pipeline.map((stage, sIdx) => (
                  <div
                    key={stage}
                    className="relative flex flex-col justify-between rounded-lg border border-line bg-bg p-3.5"
                  >
                    <span className="font-mono text-[10px] text-accent">
                      STAGE 0{sIdx + 1}
                    </span>
                    <span className="mt-2 font-display text-xs font-semibold text-fg">
                      {stage}
                    </span>
                  </div>
                ))}
              </div>

              <ul className="mt-8 space-y-2.5 border-t border-line pt-6 text-sm text-fg">
                {currentTab.deliverables.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-line bg-bg p-6">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    VERIFIED BENCHMARKS
                  </span>
                  <Activity className="size-4 text-accent" aria-hidden="true" />
                </div>

                <dl className="mt-6 space-y-5">
                  {currentTab.benchmarks.map((bm) => (
                    <div
                      key={bm.label}
                      className="flex items-baseline justify-between border-b border-line pb-4"
                    >
                      <dt className="text-xs uppercase tracking-wider text-muted">
                        {bm.label}
                      </dt>
                      <dd className="font-mono text-xl font-bold text-fg tabular-nums">
                        {bm.val}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8">
                <MagneticActionButton
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    onSelectBlueprintForForm(currentTab.title);
                    scrollToSection('partnership');
                  }}
                >
                  <span>{t.hero.primaryCta}</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </MagneticActionButton>
              </div>
            </div>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}

function CapacitySimulatorSection({
  onApplyScale,
}: {
  onApplyScale: (summary: string) => void;
}) {
  const { t } = useAppSettings();
  const [monthlyUsers, setMonthlyUsers] = useState(250000);
  const [slaIndex, setSlaIndex] = useState(1);
  const [topologyIndex, setTopologyIndex] = useState(1);

  const slaOptions = ['99.9%', '99.95%', '99.99%'];
  const currentTopology =
    t.simulator.topologies[topologyIndex] ?? t.simulator.topologies[0];

  const peakReqPerSec = Math.round((monthlyUsers / 25) * (1 + slaIndex * 0.22));
  const estimatedLatency = (
    14.5 *
    currentTopology.latencyFactor *
    (1 - slaIndex * 0.08)
  ).toFixed(1);
  const squadSize = monthlyUsers > 1000000 ? 6 : monthlyUsers > 300000 ? 4 : 3;
  const weeksToLaunch = monthlyUsers > 1000000 ? 10 : 8;
  const loadFactor = monthlyUsers / 2500000;

  const configurationString = `${monthlyUsers.toLocaleString()} MAU · SLA ${slaOptions[slaIndex]} · ${currentTopology.name}`;

  return (
    <section
      id="simulator"
      className="scroll-mt-20 border-b border-line bg-bg-panel py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <RevealBlock>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.simulator.kicker}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">
            {t.simulator.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted">
            {t.simulator.subheading}
          </p>
        </RevealBlock>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <RevealBlock className="space-y-6 rounded-xl border border-line bg-bg p-6 md:p-8">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="mau-slider"
                  className="font-mono text-xs uppercase tracking-wider text-muted"
                >
                  {t.simulator.usersLabel}
                </label>
                <span className="font-mono text-lg font-bold text-accent tabular-nums">
                  {monthlyUsers.toLocaleString()} {t.simulator.usersUnit}
                </span>
              </div>
              <input
                id="mau-slider"
                type="range"
                min={25000}
                max={2500000}
                step={25000}
                value={monthlyUsers}
                onChange={(e) => setMonthlyUsers(Number(e.target.value))}
                data-native-cursor="true"
                className="mt-3 h-2 w-full cursor-pointer accent-accent"
              />
            </div>

            <div className="border-t border-line pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                {t.simulator.slaLabel}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {slaOptions.map((sla, idx) => (
                  <button
                    key={sla}
                    type="button"
                    onClick={() => setSlaIndex(idx)}
                    className={`min-h-12 rounded-lg border font-mono text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                      idx === slaIndex
                        ? 'border-accent bg-accent text-bg'
                        : 'border-line bg-bg-panel text-fg hover:border-line-strong'
                    }`}
                  >
                    {sla}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-line pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                {t.simulator.topologyLabel}
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {t.simulator.topologies.map((topo, idx) => (
                  <button
                    key={topo.id}
                    type="button"
                    onClick={() => setTopologyIndex(idx)}
                    className={`min-h-12 rounded-lg border p-3 text-left text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                      idx === topologyIndex
                        ? 'border-accent bg-accent text-bg'
                        : 'border-line bg-bg-panel text-fg hover:border-line-strong'
                    }`}
                  >
                    {topo.name}
                  </button>
                ))}
              </div>
            </div>
          </RevealBlock>

          <RevealBlock
            delay={0.08}
            className="flex flex-col justify-between rounded-xl border border-line-strong bg-bg p-6 md:p-8"
          >
            <div>
              <div className="mb-4">
                <SimulatorWaveCanvas
                  loadFactor={loadFactor}
                  slaIndex={slaIndex}
                  topologyIndex={topologyIndex}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-line bg-bg-panel p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {t.simulator.outputs.throughput}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-fg tabular-nums md:text-3xl">
                    {peakReqPerSec.toLocaleString()} req/s
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-bg-panel p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {t.simulator.outputs.latency}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-accent tabular-nums md:text-3xl">
                    {estimatedLatency} ms
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-bg-panel p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {t.simulator.outputs.savings}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-fg tabular-nums md:text-3xl">
                    +{currentTopology.costSaving}%
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-bg-panel p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {t.simulator.outputs.timeline}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-fg tabular-nums md:text-3xl">
                    {weeksToLaunch} {t.simulator.outputs.weeks}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-line bg-bg-panel p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {t.simulator.outputs.squad}
                  </span>
                  <Cpu className="size-4 text-accent" aria-hidden="true" />
                </div>
                <p className="mt-1 font-display text-lg font-bold text-fg">
                  {squadSize} {t.simulator.outputs.engineers}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <MagneticActionButton
                variant="primary"
                className="w-full"
                onClick={() => {
                  onApplyScale(configurationString);
                  scrollToSection('partnership');
                }}
              >
                <span>{t.simulator.outputs.applyCta}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </MagneticActionButton>
            </div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}

function DeliveriesLedgerSection() {
  const { t } = useAppSettings();
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [modalRecordId, setModalRecordId] = useState<string | null>(null);

  const sectors = ['ALL', 'FinTech', 'Cloud', 'Enterprise AI'];
  const filteredItems =
    selectedSector === 'ALL'
      ? t.deliveries.items
      : t.deliveries.items.filter((item) => item.sector === selectedSector);

  const activeModalRecord =
    t.deliveries.items.find((item) => item.id === modalRecordId) ?? null;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalRecordId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <section id="deliveries" className="scroll-mt-20 border-b border-line py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealBlock>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {t.deliveries.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">
              {t.deliveries.heading}
            </h2>
          </RevealBlock>

          <RevealBlock className="flex flex-wrap gap-2">
            {sectors.map((sec) => {
              const active = selectedSector === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSector(sec)}
                  className={`min-h-12 rounded-lg border px-4 py-2 font-mono text-xs font-semibold uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'border-accent bg-accent text-bg'
                      : 'border-line bg-bg-panel text-muted hover:text-fg'
                  }`}
                >
                  {sec === 'ALL' ? t.deliveries.filterAll : sec}
                </button>
              );
            })}
          </RevealBlock>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {filteredItems.map((item, idx) => (
            <RevealBlock key={item.id} delay={idx * 0.05}>
              <TiltSurfaceCard className="h-full">
                <article className="flex h-full flex-col justify-between rounded-xl border border-line bg-bg-panel p-6 transition-colors hover:border-line-strong md:p-8">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md border border-line bg-bg px-2.5 py-1 font-mono text-xs font-semibold text-accent">
                        {item.sector}
                      </span>
                      <span className="font-mono text-xs text-faint">{item.location}</span>
                    </div>

                    <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
                      {item.client}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-fg">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>

                    <ul className="mt-6 space-y-2 border-t border-line pt-4 text-xs font-medium text-fg">
                      {item.outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-accent" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-line bg-bg px-2 py-0.5 font-mono text-[11px] text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalRecordId(item.id)}
                      className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-bg px-3.5 py-2 font-mono text-xs font-semibold text-fg hover:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span>{t.deliveries.inspectBtn}</span>
                      <ArrowUpRight className="size-3.5 text-accent" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              </TiltSurfaceCard>
            </RevealBlock>
          ))}
        </div>
      </div>

      {activeModalRecord && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delivery-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-md"
          onClick={() => setModalRecordId(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-line-strong bg-bg-panel p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-semibold text-accent">
                  {activeModalRecord.sector} · {activeModalRecord.location}
                </span>
                <h3
                  id="delivery-modal-title"
                  className="mt-1 font-display text-2xl font-bold text-fg"
                >
                  {activeModalRecord.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalRecordId(null)}
                className="inline-flex min-h-12 items-center gap-1.5 rounded-lg border border-line bg-bg px-4 py-2 font-mono text-xs text-fg hover:border-line-strong"
              >
                <X className="size-4" aria-hidden="true" />
                <span>{t.deliveries.closeModal}</span>
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {activeModalRecord.summary}
            </p>

            <div className="mt-6 border-t border-line pt-4">
              <p className="font-mono text-xs uppercase tracking-wider text-faint">
                {t.deliveries.outcomesLabel}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {activeModalRecord.outcomes.map((out) => (
                  <div
                    key={out}
                    className="rounded-lg border border-line bg-bg p-3 font-display text-xs font-semibold text-fg"
                  >
                    {out}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <p className="font-mono text-xs uppercase tracking-wider text-faint">
                {t.deliveries.architectureLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeModalRecord.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-line bg-bg px-3 py-1 font-mono text-xs text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ExecutionRoadmapSection() {
  const { t } = useAppSettings();
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const progressWidth = ((activePhaseIdx + 1) / t.roadmap.steps.length) * 100;

  return (
    <section
      id="roadmap"
      className="scroll-mt-20 border-b border-line bg-bg-panel py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <RevealBlock>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.roadmap.kicker}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">
            {t.roadmap.heading}
          </h2>
        </RevealBlock>

        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-bg">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {t.roadmap.steps.map((step, idx) => {
            const isSelected = idx === activePhaseIdx;
            return (
              <RevealBlock key={step.phase} delay={idx * 0.06}>
                <TiltSurfaceCard className="h-full">
                  <button
                    type="button"
                    onClick={() => setActivePhaseIdx(idx)}
                    className={`min-h-12 flex h-full w-full flex-col justify-between rounded-xl border p-6 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                      isSelected
                        ? 'border-accent bg-bg'
                        : 'border-line bg-bg/50 hover:border-line-strong'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-bold text-accent">{step.phase}</span>
                        <span className="text-faint">{step.duration}</span>
                      </div>
                      <h3 className="mt-4 font-display text-xl font-bold text-fg">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {step.body}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-line pt-4">
                      <p className="font-mono text-[11px] text-fg">{step.artifact}</p>
                    </div>
                  </button>
                </TiltSurfaceCard>
              </RevealBlock>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface PartnershipSubmission {
  name: string;
  email: string;
  organization: string;
  blueprint: string;
  scaleSummary: string;
  notes: string;
  timestamp: string;
}

const STORAGE_BRIEF_KEY = 'vps-partnership-specification';

function PartnershipSection({
  selectedBlueprint,
  onSelectBlueprint,
  scaleSummary,
  onChangeScaleSummary,
}: {
  selectedBlueprint: string;
  onSelectBlueprint: (val: string) => void;
  scaleSummary: string;
  onChangeScaleSummary: (val: string) => void;
}) {
  const { t } = useAppSettings();
  const [submittedRecord, setSubmittedRecord] =
    useState<PartnershipSubmission | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const organization = String(formData.get('organization') ?? '').trim();
    const blueprint = String(
      formData.get('blueprint') ?? selectedBlueprint
    ).trim();
    const scale = String(formData.get('scaleSummary') ?? scaleSummary).trim();
    const notes = String(formData.get('notes') ?? '').trim();

    if (!name || !email || !email.includes('@') || !organization) {
      setErrorMsg(t.partnership.form.validationError);
      return;
    }

    setErrorMsg(null);
    const record: PartnershipSubmission = {
      name,
      email,
      organization,
      blueprint,
      scaleSummary: scale,
      notes,
      timestamp: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_BRIEF_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage quota errors
    }

    setSubmittedRecord(record);
  };

  return (
    <section id="partnership" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <RevealBlock>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {t.partnership.kicker}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">
              {t.partnership.heading}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              {t.partnership.copy}
            </p>

            <div className="mt-8 space-y-3 rounded-xl border border-line bg-bg-panel p-6 font-mono text-xs text-muted">
              <div className="flex items-center gap-2 text-fg">
                <Server className="size-4 text-accent" aria-hidden="true" />
                <span>{t.brand.code}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-accent" aria-hidden="true" />
                <span>ISO/IEC 27001 & WCAG 2.1 AA Architecture Standard</span>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            {submittedRecord ? (
              <div className="rounded-xl border border-accent bg-bg-panel p-8">
                <div className="flex items-center gap-3 text-accent">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-bold text-fg">
                    {t.partnership.confirmation.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {t.partnership.confirmation.subtitle}
                </p>

                <dl className="mt-6 space-y-3 rounded-lg border border-line bg-bg p-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t.partnership.form.nameLabel}</dt>
                    <dd className="font-semibold text-fg">{submittedRecord.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">
                      {t.partnership.form.organizationLabel}
                    </dt>
                    <dd className="font-semibold text-fg">
                      {submittedRecord.organization}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t.partnership.form.blueprintLabel}</dt>
                    <dd className="font-mono text-accent">
                      {submittedRecord.blueprint}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t.partnership.form.scaleLabel}</dt>
                    <dd className="font-mono text-xs text-fg">
                      {submittedRecord.scaleSummary}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setSubmittedRecord(null)}
                    className="min-h-12 rounded-lg border border-line-strong bg-bg px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-fg hover:border-accent"
                  >
                    {t.partnership.confirmation.resetBtn}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border border-line bg-bg-panel p-6 md:p-8"
                noValidate
              >
                {errorMsg && (
                  <div
                    role="alert"
                    className="rounded-lg border border-error bg-bg p-3 text-sm text-error"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted">
                      {t.partnership.form.nameLabel}
                    </span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      aria-label={t.partnership.form.nameHint}
                      data-native-cursor="true"
                      className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-3.5 text-sm text-fg outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </label>

                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted">
                      {t.partnership.form.emailLabel}
                    </span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      aria-label={t.partnership.form.emailHint}
                      data-native-cursor="true"
                      className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-3.5 text-sm text-fg outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {t.partnership.form.organizationLabel}
                  </span>
                  <input
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    required
                    aria-label={t.partnership.form.organizationHint}
                    data-native-cursor="true"
                    className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-3.5 text-sm text-fg outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted">
                      {t.partnership.form.blueprintLabel}
                    </span>
                    <select
                      name="blueprint"
                      value={selectedBlueprint}
                      onChange={(e) => onSelectBlueprint(e.target.value)}
                      data-native-cursor="true"
                      className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-3.5 text-sm text-fg outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {t.blueprints.tabs.map((tab) => (
                        <option key={tab.id} value={tab.title}>
                          {tab.code} · {tab.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted">
                      {t.partnership.form.scaleLabel}
                    </span>
                    <input
                      name="scaleSummary"
                      type="text"
                      value={scaleSummary}
                      onChange={(e) => onChangeScaleSummary(e.target.value)}
                      data-native-cursor="true"
                      className="mt-2 h-12 w-full rounded-lg border border-line bg-bg px-3.5 font-mono text-xs text-fg outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {t.partnership.form.notesLabel}
                  </span>
                  <textarea
                    name="notes"
                    rows={3}
                    aria-label={t.partnership.form.notesHint}
                    data-native-cursor="true"
                    className="mt-2 w-full rounded-lg border border-line bg-bg p-3.5 text-sm text-fg outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </label>

                <div className="pt-2">
                  <MagneticActionButton
                    type="submit"
                    variant="primary"
                    className="w-full"
                  >
                    <span>{t.partnership.form.submitBtn}</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </MagneticActionButton>
                </div>
              </form>
            )}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}

function ArchitecturalFooter() {
  const { t } = useAppSettings();

  return (
    <footer className="border-t border-line bg-bg-panel py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <div className="flex items-center gap-3">
            <VektorLogo className="size-7 text-fg" />
            <span className="font-display text-sm font-bold tracking-tight text-fg">
              {t.brand.name}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">{t.footer.tagline}</p>
        </div>

        <p className="font-mono text-xs uppercase tracking-wider text-faint">
          {t.footer.links}
        </p>

        <p className="text-xs text-faint">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}

export function App() {
  const { t } = useAppSettings();
  const [booting, setBooting] = useState(true);
  const [selectedBlueprint, setSelectedBlueprint] = useState(
    t.blueprints.tabs[0]?.title ?? 'Kinetic Web Platform'
  );
  const [scaleSummary, setScaleSummary] = useState(
    '250,000 MAU · SLA 99.95% · Multi-Region'
  );

  return (
    <>
      {booting && <KernelBootSequence onComplete={() => setBooting(false)} />}
      <SmoothScrollWrapper disabled={booting}>
        <PrecisionReticleCursor />
        <TopProgressIndicator />
        <ArchitecturalHeader hidden={booting} />
        <main>
          <HeroArchitectureSection ready={!booting} />
          <CapabilityStreamBar />
          <BlueprintExplorerSection
            onSelectBlueprintForForm={(title) => setSelectedBlueprint(title)}
          />
          <CapacitySimulatorSection
            onApplyScale={(summary) => setScaleSummary(summary)}
          />
          <DeliveriesLedgerSection />
          <ExecutionRoadmapSection />
          <PartnershipSection
            selectedBlueprint={selectedBlueprint}
            onSelectBlueprint={setSelectedBlueprint}
            scaleSummary={scaleSummary}
            onChangeScaleSummary={setScaleSummary}
          />
        </main>
        <ArchitecturalFooter />
      </SmoothScrollWrapper>
    </>
  );
}

export default App;
