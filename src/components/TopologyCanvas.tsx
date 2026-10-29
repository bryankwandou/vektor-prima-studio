import { useEffect, useRef } from 'react';

export function VektorLogo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect
        width="32"
        height="32"
        rx="6"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeOpacity="0.25"
      />
      <path
        d="M7.5 9.5L16 23.5L24.5 9.5"
        stroke="var(--color-accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.5L16 16.5L20 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface NodeCoordinate {
  x: number;
  y: number;
  z: number;
}

const TOPOLOGY_COORDS: NodeCoordinate[] = [
  { x: 0, y: -110, z: 45 },
  { x: -125, y: -18, z: -30 },
  { x: 125, y: -18, z: -20 },
  { x: -82, y: 105, z: 28 },
  { x: 82, y: 105, z: -35 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [0, 3],
  [0, 4],
];

export function IsometricTopologyCanvas({
  activeNodeIndex,
  onSelectNode,
  burstSignal,
}: {
  activeNodeIndex: number;
  onSelectNode: (index: number) => void;
  burstSignal: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const projectedNodesRef = useRef<{ x: number; y: number; r: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId = 0;
    let rotX = 0.28;
    let rotY = -0.35;
    let targetRotX = 0.28;
    let targetRotY = -0.35;
    let pulsePhase = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0.9;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 1.05;
      targetRotX = -ny * 0.75;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      pulsePhase += reducedMotion ? 0 : 0.022;
      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      const styles = getComputedStyle(document.documentElement);
      const fg = styles.getPropertyValue('--color-fg').trim();
      const accent = styles.getPropertyValue('--color-accent').trim();
      const accentAlt = styles.getPropertyValue('--color-accent-alt').trim();
      const panel = styles.getPropertyValue('--color-bg-panel').trim();

      ctx.clearRect(0, 0, width, height);

      // 3D Geodesic Wireframe Sphere Core
      const sphereR = Math.min(width, height) * 0.36;
      const spinY = rotY + pulsePhase * 0.35;
      const cosSY = Math.cos(spinY);
      const sinSY = Math.sin(spinY);
      const cosSX = Math.cos(rotX);
      const sinSX = Math.sin(rotX);

      ctx.save();
      const latRings = 6;
      const segments = 28;
      for (let r = 1; r < latRings; r++) {
        const phi = (r / latRings) * Math.PI;
        const ringY = Math.cos(phi) * sphereR;
        const ringRad = Math.sin(phi) * sphereR;
        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const x0 = Math.cos(theta) * ringRad;
          const z0 = Math.sin(theta) * ringRad;
          const x1 = x0 * cosSY - z0 * sinSY;
          const z1 = x0 * sinSY + z0 * cosSY;
          const y2 = ringY * cosSX - z1 * sinSX;
          const z2 = ringY * sinSX + z1 * cosSX;
          const persp = 460 / (460 + z2);
          const px = centerX + x1 * persp;
          const py = centerY + y2 * persp;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = r === 3 ? accent : fg;
        ctx.globalAlpha = r === 3 ? 0.24 : 0.08;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      const cosY = Math.cos(rotY + Math.sin(pulsePhase * 0.4) * 0.14);
      const sinY = Math.sin(rotY + Math.sin(pulsePhase * 0.4) * 0.14);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected = TOPOLOGY_COORDS.map((node) => {
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.z * cosY + node.x * sinY;
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.y * sinX;
        const scale = 420 / (420 + z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          r: 17 * scale,
          scale,
        };
      });

      projectedNodesRef.current = projected;

      // Shockwave ring on active node
      const activePt = projected[activeNodeIndex];
      if (activePt && shockwaveAlpha > 0.02) {
        shockwaveRadius += 2.4;
        shockwaveAlpha *= 0.95;
        ctx.save();
        ctx.beginPath();
        ctx.arc(activePt.x, activePt.y, activePt.r + shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = shockwaveAlpha;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      }

      // Draw edges and bidirectional flowing data packets
      EDGES.forEach(([aIdx, bIdx], edgeIdx) => {
        const a = projected[aIdx];
        const b = projected[bIdx];
        if (!a || !b) return;

        const isHighlighted =
          aIdx === activeNodeIndex || bIdx === activeNodeIndex;

        ctx.save();
        ctx.strokeStyle = isHighlighted ? accent : fg;
        ctx.globalAlpha = isHighlighted ? 0.62 : 0.18;
        ctx.lineWidth = isHighlighted ? 1.9 : 1.1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Forward packet dot
        const t1 = (pulsePhase * (1.2 + (edgeIdx % 3) * 0.25) + edgeIdx * 0.17) % 1;
        const px1 = a.x + (b.x - a.x) * t1;
        const py1 = a.y + (b.y - a.y) * t1;
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = edgeIdx % 2 === 0 ? accent : accentAlt;
        ctx.beginPath();
        ctx.arc(px1, py1, isHighlighted ? 4 : 2.6, 0, Math.PI * 2);
        ctx.fill();

        // Reverse packet dot on highlighted edges
        if (isHighlighted) {
          const t2 = 1 - ((pulsePhase * 0.95 + edgeIdx * 0.31) % 1);
          const px2 = a.x + (b.x - a.x) * t2;
          const py2 = a.y + (b.y - a.y) * t2;
          ctx.fillStyle = accentAlt;
          ctx.beginPath();
          ctx.arc(px2, py2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw nodes
      projected.forEach((pt, idx) => {
        const isSelected = idx === activeNodeIndex;
        ctx.save();

        if (isSelected) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(
            pt.x,
            pt.y,
            pt.r + 9 + Math.sin(pulsePhase * 2.8) * 3.5,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.fillStyle = isSelected ? accent : panel;
        ctx.strokeStyle = isSelected ? accent : fg;
        ctx.lineWidth = isSelected ? 2.2 : 1.4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected ? panel : fg;
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`0${idx + 1}`, pt.x, pt.y);

        ctx.restore();
      });

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(frameId);
    };
  }, [activeNodeIndex, burstSignal]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const hitIndex = projectedNodesRef.current.findIndex((pt) => {
      const dx = clickX - pt.x;
      const dy = clickY - pt.y;
      return Math.sqrt(dx * dx + dy * dy) <= pt.r + 14;
    });

    if (hitIndex !== -1) {
      onSelectNode(hitIndex);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="h-full w-full cursor-pointer"
      aria-label="Interactive 3D System Topology Canvas"
    />
  );
}

export function BlueprintFlowCanvas({
  activeTabIdx,
  stages,
}: {
  activeTabIdx: number;
  stages: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let phase = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      phase += reducedMotion ? 0 : 0.024;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const styles = getComputedStyle(document.documentElement);
      const fg = styles.getPropertyValue('--color-fg').trim();
      const accent = styles.getPropertyValue('--color-accent').trim();
      const accentAlt = styles.getPropertyValue('--color-accent-alt').trim();
      const bg = styles.getPropertyValue('--color-bg').trim();

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const count = Math.max(stages.length, 4);
      const padX = Math.min(64, width * 0.12);
      const stepX = (width - padX * 2) / (count - 1);
      const centerY = height * 0.5;

      // Connecting wave tracks between blueprint stages
      for (let w = 0; w < 2; w++) {
        ctx.save();
        ctx.beginPath();
        for (let x = padX; x <= width - padX; x += 4) {
          const norm = (x - padX) / (width - padX * 2);
          const waveY =
            centerY +
            Math.sin(norm * Math.PI * (3 + activeTabIdx) - phase * 2 + w * 1.4) *
              (w === 0 ? 16 : 9);
          if (x === padX) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.strokeStyle = w === 0 ? accent : accentAlt;
        ctx.globalAlpha = w === 0 ? 0.75 : 0.35;
        ctx.lineWidth = w === 0 ? 2 : 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // Stage nodes & travelling pulse packets
      for (let i = 0; i < count; i++) {
        const nx = padX + i * stepX;
        const pulse = Math.sin(phase * 2.5 - i * 0.9) * 3;

        ctx.save();
        ctx.beginPath();
        ctx.arc(nx, centerY, 15 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(nx, centerY, 9, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 1;
        ctx.fill();

        ctx.fillStyle = fg;
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`0${i + 1}`, nx, centerY - 22);
        ctx.restore();
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(rafId);
    };
  }, [activeTabIdx, stages]);

  return (
    <canvas
      ref={canvasRef}
      className="h-28 w-full rounded-lg border border-line"
      aria-hidden="true"
    />
  );
}

export function SimulatorWaveCanvas({
  loadFactor,
  slaIndex,
  topologyIndex,
}: {
  loadFactor: number;
  slaIndex: number;
  topologyIndex: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let tick = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      tick += reducedMotion ? 0 : 0.032 * (0.75 + loadFactor * 0.65);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const styles = getComputedStyle(document.documentElement);
      const bgPanel = styles.getPropertyValue('--color-bg-panel').trim();
      const fg = styles.getPropertyValue('--color-fg').trim();
      const accent = styles.getPropertyValue('--color-accent').trim();
      const accentAlt = styles.getPropertyValue('--color-accent-alt').trim();

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = bgPanel;
      ctx.fillRect(0, 0, width, height);

      // Subtle oscilloscope grid
      ctx.save();
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.06;
      for (let x = 0; x < width; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      const channels = topologyIndex + 2;
      for (let c = 0; c < channels; c++) {
        ctx.save();
        ctx.beginPath();
        const amp = (14 + loadFactor * 16 - slaIndex * 2.5) * (1 - c * 0.18);
        const freq = 0.02 + c * 0.006 + topologyIndex * 0.004;
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin(x * freq + tick + c * 1.2) * amp +
            Math.cos(x * 0.011 - tick * 0.7) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = c === 0 ? accent : c === 1 ? accentAlt : fg;
        ctx.globalAlpha = c === 0 ? 0.92 : 0.42;
        ctx.lineWidth = c === 0 ? 2.2 : 1.2;
        ctx.stroke();
        ctx.restore();
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(rafId);
    };
  }, [loadFactor, slaIndex, topologyIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="h-32 w-full rounded-lg border border-line"
      aria-hidden="true"
    />
  );
}
