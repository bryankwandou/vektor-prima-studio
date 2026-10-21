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
  { x: 0, y: -115, z: 40 },
  { x: -130, y: -15, z: -30 },
  { x: 130, y: -15, z: -20 },
  { x: -85, y: 110, z: 25 },
  { x: 85, y: 110, z: -35 },
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
    let rotX = 0.25;
    let rotY = -0.32;
    let targetRotX = 0.25;
    let targetRotY = -0.32;
    let pulsePhase = 0;

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
      targetRotY = nx * 0.85;
      targetRotX = -ny * 0.65;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      pulsePhase += reducedMotion ? 0 : 0.018;
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

      // Isometric background rings
      ctx.save();
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      [90, 155, 215].forEach((radius) => {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius, radius * 0.62, rotY * 0.25, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      const cosY = Math.cos(rotY + Math.sin(pulsePhase * 0.4) * 0.12);
      const sinY = Math.sin(rotY + Math.sin(pulsePhase * 0.4) * 0.12);
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
          r: 16 * scale,
          scale,
        };
      });

      projectedNodesRef.current = projected;

      // Draw edges and flowing data packets
      EDGES.forEach(([aIdx, bIdx], edgeIdx) => {
        const a = projected[aIdx];
        const b = projected[bIdx];
        if (!a || !b) return;

        const isHighlighted =
          aIdx === activeNodeIndex || bIdx === activeNodeIndex;

        ctx.save();
        ctx.strokeStyle = isHighlighted ? accent : fg;
        ctx.globalAlpha = isHighlighted ? 0.55 : 0.18;
        ctx.lineWidth = isHighlighted ? 1.8 : 1.1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Flowing packet dot along the edge
        const t = (pulsePhase * (1.1 + (edgeIdx % 3) * 0.25) + edgeIdx * 0.17) % 1;
        const px = a.x + (b.x - a.x) * t;
        const py = a.y + (b.y - a.y) * t;
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = edgeIdx % 2 === 0 ? accent : accentAlt;
        ctx.beginPath();
        ctx.arc(px, py, isHighlighted ? 3.8 : 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw nodes
      projected.forEach((pt, idx) => {
        const isSelected = idx === activeNodeIndex;
        ctx.save();

        if (isSelected) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(
            pt.x,
            pt.y,
            pt.r + 8 + Math.sin(pulsePhase * 2.5) * 3,
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
      return Math.sqrt(dx * dx + dy * dy) <= pt.r + 12;
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
