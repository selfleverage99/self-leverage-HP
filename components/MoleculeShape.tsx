'use client';

import { useEffect, useRef } from 'react';

interface Point3 {
  x: number;
  y: number;
  z: number;
}

interface Node extends Point3 {
  vx: number;
  vy: number;
  vz: number;
  tx: number;
  ty: number;
  tz: number;
  base: Point3;
}

const NODE_COUNT = 26;
const BOND_NEIGHBORS = 2;
const SPRING_K = 0.055;
const DAMPING = 0.86;
const SCATTER_SPRING_K = 0.09;
const IDLE_SPIN_SPEED = 0.00012; // radians / ms
const SCATTER_HOLD_MS = 420;

function fibonacciSphere(count: number): Point3[] {
  const points: Point3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    points.push({ x: Math.cos(theta) * radiusAtY, y, z: Math.sin(theta) * radiusAtY });
  }
  return points;
}

function buildBonds(points: Point3[]): [number, number][] {
  const pairs = new Set<string>();
  const bonds: [number, number][] = [];
  points.forEach((p, i) => {
    const distances = points
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, BOND_NEIGHBORS);
    distances.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!pairs.has(key)) {
        pairs.add(key);
        bonds.push([i, j]);
      }
    });
  });
  return bonds;
}

function rotateY(p: Point3, angle: number): Point3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: p.x * cos - p.z * sin, y: p.y, z: p.x * sin + p.z * cos };
}

function rotateX(p: Point3, angle: number): Point3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
}

export default function MoleculeShape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const basePoints = fibonacciSphere(NODE_COUNT);
    const bonds = buildBonds(basePoints);

    let width = 0;
    let height = 0;
    let radius = 90;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.34;
    }
    resize();
    window.addEventListener('resize', resize);

    const nodes: Node[] = basePoints.map((p) => ({
      x: p.x * radius,
      y: p.y * radius,
      z: p.z * radius,
      vx: 0,
      vy: 0,
      vz: 0,
      tx: p.x * radius,
      ty: p.y * radius,
      tz: p.z * radius,
      base: p,
    }));

    let sectionAngleY = 0;
    let sectionAngleX = 0;
    let scattered = false;
    let scatterTimer: ReturnType<typeof setTimeout> | null = null;
    let currentSectionId = '';

    function scatterAndReassemble(index: number) {
      sectionAngleY = index * 0.62;
      sectionAngleX = Math.sin(index * 1.3) * 0.35;
      scattered = true;
      nodes.forEach((n) => {
        const dir = Math.sqrt(n.base.x ** 2 + n.base.y ** 2 + n.base.z ** 2) || 1;
        const spread = radius * (2.4 + Math.random() * 1.6);
        const jitter = () => (Math.random() - 0.5) * radius * 0.8;
        n.tx = (n.base.x / dir) * spread + jitter();
        n.ty = (n.base.y / dir) * spread + jitter();
        n.tz = (n.base.z / dir) * spread + jitter();
      });
      if (scatterTimer) clearTimeout(scatterTimer);
      scatterTimer = setTimeout(() => {
        scattered = false;
      }, SCATTER_HOLD_MS);
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id !== currentSectionId) {
            currentSectionId = entry.target.id;
            const index = sections.findIndex((s) => s.id === currentSectionId);
            scatterAndReassemble(index < 0 ? 0 : index);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));

    let raf = 0;
    let last = performance.now();

    function frame(now: number) {
      const steps = Math.min(3, Math.max(0.2, (now - last) / 16.6667));
      last = now;

      if (!scattered) {
        const idleAngle = now * IDLE_SPIN_SPEED;
        nodes.forEach((n) => {
          let p = rotateY(n.base, sectionAngleY + idleAngle);
          p = rotateX(p, sectionAngleX);
          n.tx = p.x * radius;
          n.ty = p.y * radius;
          n.tz = p.z * radius;
        });
      }

      const k = (scattered ? SCATTER_SPRING_K : SPRING_K) * steps;
      nodes.forEach((n) => {
        n.vx = (n.vx + (n.tx - n.x) * k) * DAMPING;
        n.vy = (n.vy + (n.ty - n.y) * k) * DAMPING;
        n.vz = (n.vz + (n.tz - n.z) * k) * DAMPING;
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
      });

      if (!ctx || !width || !height) {
        raf = requestAnimationFrame(frame);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const D = width * 1.3;

      const projected = nodes.map((n) => {
        const scale = D / (D + n.z);
        return { sx: cx + n.x * scale, sy: cy + n.y * scale, scale, assembled: dist(n, n.tx, n.ty, n.tz) };
      });

      bonds.forEach(([a, b]) => {
        const pa = projected[a];
        const pb = projected[b];
        const closeness = Math.max(0, 1 - Math.max(pa.assembled, pb.assembled) / (radius * 1.2));
        if (closeness <= 0.02) return;
        ctx.strokeStyle = `rgba(255,255,255,${0.16 * closeness})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      });

      projected.forEach((p) => {
        const r = Math.max(1.1, 2.4 * p.scale);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255,255,255,0.35)';
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function dist(n: Node, tx: number, ty: number, tz: number) {
      return Math.sqrt((n.x - tx) ** 2 + (n.y - ty) ** 2 + (n.z - tz) ** 2);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (scatterTimer) clearTimeout(scatterTimer);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="molecule-shape-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="molecule-shape-canvas" />
    </div>
  );
}
