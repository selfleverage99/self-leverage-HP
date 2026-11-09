'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  depth: number;
  heat: number;
  fire: number;
  off: number;
  nb: { e: Edge; to: number }[];
}
interface Edge {
  a: number;
  b: number;
  act: number;
  inner: boolean;
}
interface Pulse {
  e: Edge;
  from: number;
  to: number;
  u: number;
  sp: number;
  hops: number;
  hot: boolean;
}

const DOT = '30,30,38';
const LINE = '70,72,88';
const HOT = '255,120,40';

/** Hero center sphere: a network of particles with signals travelling along the links. */
export default function HeroSphere() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 640;
    const N = mobile ? 700 : 1500;
    const LINK_D = mobile ? 0.03 : 0.02;
    const LINK_K = 3;
    const CHORDS = mobile ? 120 : 260;
    const CORE_N = mobile ? 16 : 30;
    const MAX_PULSES = 600;
    const AMBIENT_RATE = 26;

    // ---- build sphere ----
    const nodes: Node[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    const mk = (x: number, y: number, z: number): Node => ({
      x, y, z, sx: 0, sy: 0, depth: 1, heat: 0, fire: 0, off: Math.random() * 6.28, nb: [],
    });
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i + Math.random() * 0.25;
      nodes.push(mk(Math.cos(th) * r, y, Math.sin(th) * r));
    }
    for (let i = 0; i < CORE_N; i++) {
      const rr = Math.cbrt(Math.random()) * 0.3;
      const th = Math.random() * 6.283;
      const ph = Math.acos(2 * Math.random() - 1);
      nodes.push(mk(rr * Math.sin(ph) * Math.cos(th), rr * Math.cos(ph), rr * Math.sin(ph) * Math.sin(th)));
    }
    const NT = nodes.length;
    const edges: Edge[] = [];
    const addEdge = (i: number, j: number, inner: boolean) => {
      const e: Edge = { a: i, b: j, act: 0, inner };
      edges.push(e);
      nodes[i].nb.push({ e, to: j });
      nodes[j].nb.push({ e, to: i });
    };
    {
      const cell = Math.sqrt(LINK_D) * 1.01;
      const grid = new Map<string, number[]>();
      const key = (x: number, y: number, z: number) =>
        `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const k = key(n.x, n.y, n.z);
        const arr = grid.get(k);
        if (arr) arr.push(i);
        else grid.set(k, [i]);
      }
      for (let i = 0; i < N; i++) {
        const a = nodes[i];
        const cand: [number, number][] = [];
        const cx = Math.floor(a.x / cell);
        const cy = Math.floor(a.y / cell);
        const cz = Math.floor(a.z / cell);
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++)
            for (let dz = -1; dz <= 1; dz++) {
              const arr = grid.get(`${cx + dx},${cy + dy},${cz + dz}`);
              if (!arr) continue;
              for (const j of arr) {
                if (j <= i) continue;
                const b = nodes[j];
                const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
                if (d < LINK_D) cand.push([d, j]);
              }
            }
        cand.sort((p, q) => p[0] - q[0]).slice(0, LINK_K).forEach(([, j]) => addEdge(i, j, false));
      }
      for (let c = N; c < NT; c++) for (let k = 0; k < 6; k++) addEdge(c, (Math.random() * N) | 0, true);
      for (let k = 0; k < CHORDS; k++) {
        const i = (Math.random() * N) | 0;
        const j = (Math.random() * N) | 0;
        const a = nodes[i];
        const b = nodes[j];
        if (i === j || a.x * b.x + a.y * b.y + a.z * b.z > 0.3) {
          k--;
          continue;
        }
        addEdge(i, j, true);
      }
    }

    const pulses: Pulse[] = [];
    const spawn = (i: number, hot: boolean) => {
      const n = nodes[i];
      if (!n.nb.length || pulses.length >= MAX_PULSES) return;
      const pick = n.nb[(Math.random() * n.nb.length) | 0];
      pulses.push({
        e: pick.e, from: i, to: pick.to, u: 0,
        sp: 1.6 + Math.random() * 1.6,
        hops: 4 + ((Math.random() * 5) | 0),
        hot,
      });
      n.fire = 1;
    };

    // ---- state ----
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let scale = 0;
    let rotY = 0.6;
    const rotX = -0.2;
    let tiltX = 0;
    let tiltY = 0;
    let energy = 0;
    let t = 0;
    let acc = 0;
    let accC = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999, active: false };
    let lx = -9999;
    let ly = -9999;

    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H * 0.47;
      scale = Math.min(W, H) * (W > 900 ? 0.33 : 0.38);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (ev: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = ev.clientX - r.left;
      const y = ev.clientY - r.top;
      const d = Math.hypot(x - lx, y - ly);
      lx = x;
      ly = y;
      if (d < 400) energy = Math.min(1, energy + d * 0.004);
      mouse.x = x;
      mouse.y = y;
      mouse.active = y > 0 && y < r.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      t += dt;
      energy *= 0.96;
      if (!reduced) rotY += dt * (0.11 + energy * 0.2);
      const tx = mouse.active ? (mouse.y / H - 0.5) * 0.4 : 0;
      const ty = mouse.active ? (mouse.x / W - 0.5) * 0.6 : 0;
      tiltX += (tx - tiltX) * 0.04;
      tiltY += (ty - tiltY) * 0.04;

      ctx.clearRect(0, 0, W, H);

      // soft glow behind the sphere
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.35);
      g.addColorStop(0, 'rgba(255,255,255,0.75)');
      g.addColorStop(0.55, 'rgba(255,255,255,0.28)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const cosY = Math.cos(rotY + tiltY);
      const sinY = Math.sin(rotY + tiltY);
      const cosX = Math.cos(rotX + tiltX);
      const sinX = Math.sin(rotX + tiltX);
      const sc = scale * (1 + energy * 0.04);
      const reach = Math.min(W, H) * 0.2;
      const near: number[] = [];

      for (let i = 0; i < NT; i++) {
        const n = nodes[i];
        const b = (reduced ? 1 : 1 + 0.012 * Math.sin(t * 1.3 + n.off)) * (1 + n.heat * 0.06);
        const x0 = n.x * b;
        const y0 = n.y * b;
        const z0 = n.z * b;
        const x = x0 * cosY - z0 * sinY;
        let z = x0 * sinY + z0 * cosY;
        const y = y0 * cosX - z * sinX;
        z = y0 * sinX + z * cosX;
        const persp = 1 / (1 + z * 0.22);
        n.sx = cx + x * sc * persp;
        n.sy = cy + y * sc * persp;
        n.depth = persp;
        let target = 0;
        if (mouse.active && persp > 0.98) {
          const d = Math.hypot(n.sx - mouse.x, n.sy - mouse.y);
          if (d < reach) {
            target = (1 - d / reach) ** 1.6;
            near.push(i);
          }
        }
        n.heat += (target - n.heat) * (target > n.heat ? 0.2 : 0.05);
        n.fire *= 0.9;
      }

      acc += dt * AMBIENT_RATE;
      while (acc >= 1) {
        acc -= 1;
        spawn((Math.random() * N) | 0, false);
      }
      if (near.length) {
        accC += dt * 140;
        while (accC >= 1) {
          accC -= 1;
          spawn(near[(Math.random() * near.length) | 0], true);
        }
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pl = pulses[k];
        pl.u += dt * pl.sp * (pl.hot ? 1.4 : 1);
        pl.e.act = Math.max(pl.e.act, pl.hot ? 1 : 0.7);
        if (pl.u < 1) continue;
        const n = nodes[pl.to];
        n.fire = 1;
        if (--pl.hops <= 0 || !n.nb.length) {
          pulses.splice(k, 1);
          continue;
        }
        const opts = n.nb.filter((o) => o.to !== pl.from);
        const list = opts.length ? opts : n.nb;
        const choice = list[(Math.random() * list.length) | 0];
        pl.from = pl.to;
        pl.to = choice.to;
        pl.e = choice.e;
        pl.u -= 1;
      }

      ctx.lineWidth = 0.8;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const depth = (a.depth + b.depth) * 0.5;
        const h = Math.max(a.heat, b.heat);
        const alpha = (e.inner ? 0.035 : 0.055) + (depth - 0.8) * 0.16 + e.act * (0.35 + h * 0.4);
        if (alpha < 0.01) {
          e.act *= 0.88;
          continue;
        }
        ctx.strokeStyle =
          h > 0.04 || e.act > 0.1
            ? `rgba(${HOT},${Math.min(1, alpha + h * 0.35)})`
            : `rgba(${LINE},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
        e.act *= 0.88;
      }
      for (const n of nodes) {
        const r = 0.5 + (n.depth - 0.8) * 1.5 + n.fire * 1.2 + n.heat * 1;
        const alpha = 0.4 + (n.depth - 0.8) * 1.3 + n.fire * 0.5 + n.heat * 0.3;
        ctx.fillStyle = `rgba(${n.fire > 0.25 || n.heat > 0.03 ? HOT : DOT},${Math.min(1, Math.max(0.1, alpha))})`;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, Math.max(0.35, r), 0, 6.283);
        ctx.fill();
      }
      for (const pl of pulses) {
        const a = nodes[pl.from];
        const b = nodes[pl.to];
        const x = a.sx + (b.sx - a.sx) * pl.u;
        const y = a.sy + (b.sy - a.sy) * pl.u;
        const depth = (a.depth + b.depth) * 0.5;
        const r = (0.9 + (depth - 0.8) * 1.6) * (pl.hot ? 1.5 : 1);
        ctx.fillStyle = `rgba(${HOT},${Math.min(1, 0.65 + (depth - 0.8) * 1.2)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.283);
        ctx.fill();
        ctx.fillStyle = `rgba(${HOT},0.16)`;
        ctx.beginPath();
        ctx.arc(x, y, r * 3.2, 0, 6.283);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="hero-sphere" aria-hidden="true" />;
}
