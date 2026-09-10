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

const TARGET_POINTS = 336;
const SPRING_K = 0.055;
const DAMPING = 0.86;
const SCATTER_SPRING_K = 0.09;
const IDLE_SPIN_SPEED = 0.00012; // radians / ms
const SCATTER_HOLD_MS = 460;

function normalize(points: Point3[]): Point3[] {
  return points.map((p) => {
    const m = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z) || 1;
    return { x: p.x / m, y: p.y / m, z: p.z / m };
  });
}

function tetrahedronVertices(): Point3[] {
  return normalize([
    { x: 1, y: 1, z: 1 },
    { x: 1, y: -1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 },
  ]);
}

function cubeVertices(): Point3[] {
  const pts: Point3[] = [];
  for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) pts.push({ x: sx, y: sy, z: sz });
  return normalize(pts);
}

function octahedronVertices(): Point3[] {
  return normalize([
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
  ]);
}

function icosahedronVertices(): Point3[] {
  const phi = (1 + Math.sqrt(5)) / 2;
  return normalize([
    { x: 0, y: 1, z: phi },
    { x: 0, y: 1, z: -phi },
    { x: 0, y: -1, z: phi },
    { x: 0, y: -1, z: -phi },
    { x: 1, y: phi, z: 0 },
    { x: 1, y: -phi, z: 0 },
    { x: -1, y: phi, z: 0 },
    { x: -1, y: -phi, z: 0 },
    { x: phi, y: 0, z: 1 },
    { x: phi, y: 0, z: -1 },
    { x: -phi, y: 0, z: 1 },
    { x: -phi, y: 0, z: -1 },
  ]);
}

function dodecahedronVertices(): Point3[] {
  const phi = (1 + Math.sqrt(5)) / 2;
  const invPhi = 1 / phi;
  const pts: Point3[] = [];
  for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) pts.push({ x: sx, y: sy, z: sz });
  for (const sy of [1, -1]) for (const sz of [1, -1]) pts.push({ x: 0, y: sy * invPhi, z: sz * phi });
  for (const sx of [1, -1]) for (const sy of [1, -1]) pts.push({ x: sx * invPhi, y: sy * phi, z: 0 });
  for (const sx of [1, -1]) for (const sz of [1, -1]) pts.push({ x: sx * phi, y: 0, z: sz * invPhi });
  return normalize(pts);
}

function nearestEdges(vertices: Point3[], k: number): [number, number][] {
  const pairs = new Set<string>();
  const edges: [number, number][] = [];
  vertices.forEach((p, i) => {
    const nearest = vertices
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    nearest.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!pairs.has(key)) {
        pairs.add(key);
        edges.push([i, j]);
      }
    });
  });
  return edges;
}

interface Shape {
  vertices: Point3[];
  edges: [number, number][];
}

function makeShape(vertices: Point3[], k: number): Shape {
  return { vertices, edges: nearestEdges(vertices, k) };
}

function buildShapes(): Shape[] {
  return [
    makeShape(tetrahedronVertices(), 3),
    makeShape(cubeVertices(), 3),
    makeShape(octahedronVertices(), 4),
    makeShape(icosahedronVertices(), 5),
    makeShape(dodecahedronVertices(), 3),
  ];
}

function generateShapePoints(shape: Shape, targetCount: number): Point3[] {
  const points: Point3[] = [];
  const perEdge = Math.max(4, Math.round(targetCount / shape.edges.length));
  shape.edges.forEach(([a, b]) => {
    const va = shape.vertices[a];
    const vb = shape.vertices[b];
    for (let i = 0; i < perEdge; i++) {
      const t = i / (perEdge - 1);
      points.push({ x: va.x + (vb.x - va.x) * t, y: va.y + (vb.y - va.y) * t, z: va.z + (vb.z - va.z) * t });
    }
  });
  let i = 0;
  while (points.length < targetCount) {
    const [a, b] = shape.edges[i % shape.edges.length];
    const va = shape.vertices[a];
    const vb = shape.vertices[b];
    const t = Math.random();
    points.push({ x: va.x + (vb.x - va.x) * t, y: va.y + (vb.y - va.y) * t, z: va.z + (vb.z - va.z) * t });
    i++;
  }
  return points.slice(0, targetCount);
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

    const shapes = buildShapes();
    const shapePointSets = shapes.map((s) => generateShapePoints(s, TARGET_POINTS));

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
      radius = Math.min(width, height) * 0.36;
    }
    resize();
    window.addEventListener('resize', resize);

    const nodes: Node[] = shapePointSets[0].map((p) => ({
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
    let currentShapeIndex = 0;

    function scatterAndReassemble(sectionIndex: number) {
      currentShapeIndex = sectionIndex % shapePointSets.length;
      const nextShape = shapePointSets[currentShapeIndex];
      sectionAngleY = sectionIndex * 0.62;
      sectionAngleX = Math.sin(sectionIndex * 1.3) * 0.35;
      scattered = true;
      nodes.forEach((n, i) => {
        const dir = Math.sqrt(n.base.x ** 2 + n.base.y ** 2 + n.base.z ** 2) || 1;
        const spread = radius * (2.2 + Math.random() * 1.8);
        const jitter = () => (Math.random() - 0.5) * radius * 1.1;
        n.tx = (n.base.x / dir) * spread + jitter();
        n.ty = (n.base.y / dir) * spread + jitter();
        n.tz = (n.base.z / dir) * spread + jitter();
        n.base = nextShape[i];
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

      for (const n of nodes) {
        const scale = D / (D + n.z);
        const sx = cx + n.x * scale;
        const sy = cy + n.y * scale;
        const r = Math.max(0.6, 1.5 * scale);
        const alpha = 0.28 + 0.4 * Math.min(1, scale - 0.5);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.12, Math.min(0.85, alpha))})`;
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

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
