import type { ServiceIcon as ServiceIconKey } from '@/data/services';

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Globe() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <circle cx="60" cy="60" r="42" />
      <ellipse cx="60" cy="60" rx="18" ry="42" />
      <path d="M18 60h84" />
      <path d="M23 40h74" />
      <path d="M23 80h74" />
      <path d="M8 34l10-10m-10 4l14 0m-14-4l0 14" />
      <path d="M112 86l-10 10m10-4l-14 0m14 4l0-14" />
    </svg>
  );
}

function Circuit() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <rect x="42" y="42" width="36" height="36" rx="2" />
      <circle cx="60" cy="60" r="7" />
      <path d="M60 42V16m0 88V78" />
      <path d="M42 60H16m88 0H78" />
      <path d="M50 42V26h-14m48 16V26H70" />
      <path d="M50 78v16h-14M84 78v16H70" />
      <circle cx="16" cy="26" r="3" />
      <circle cx="104" cy="26" r="3" />
      <circle cx="16" cy="94" r="3" />
      <circle cx="104" cy="94" r="3" />
    </svg>
  );
}

function Dashboard() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <path d="M20 78a40 40 0 0 1 80 0" />
      <path d="M60 78 40 46" />
      <circle cx="60" cy="78" r="4" />
      <path d="M20 78h6m88 0h-6" />
      <path d="M31 51l4 5m54-5-4 5" />
      <path d="M60 30v8" />
    </svg>
  );
}

function Ship() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <path d="M14 72h92l-10 22H24z" />
      <rect x="30" y="52" width="16" height="20" />
      <rect x="50" y="52" width="16" height="20" />
      <rect x="70" y="46" width="16" height="26" />
      <path d="M92 46V30h10l6 16" />
      <path d="M8 88q6 6 12 0t12 0 12 0 12 0 12 0 12 0 12 0" />
    </svg>
  );
}

function Building() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <rect x="24" y="30" width="34" height="66" />
      <rect x="62" y="46" width="30" height="50" />
      <path d="M32 42h8m-8 12h8m-8 12h8m-8 12h8m-8 12h8" />
      <path d="M40 42h8m-8 12h8m-8 12h8m-8 12h8m-8 12h8" />
      <path d="M70 58h6m-6 10h6m-6 10h6m-6 10h6" />
      <path d="M80 58h6m-6 10h6m-6 10h6m-6 10h6" />
      <path d="M16 96h96" />
    </svg>
  );
}

function Document() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <path d="M32 14h38l16 16v76H32z" />
      <path d="M70 14v16h16" />
      <path d="M42 52h34m-34 12h34m-34 12h20" />
      <circle cx="82" cy="88" r="14" />
      <path d="M74 88l6 6 10-12" />
    </svg>
  );
}

function Headset() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <path d="M22 62a38 38 0 0 1 76 0" />
      <rect x="16" y="58" width="14" height="26" rx="5" />
      <rect x="90" y="58" width="14" height="26" rx="5" />
      <path d="M23 84v6a10 10 0 0 0 10 10h9" />
      <path d="M60 100h-6a6 6 0 0 1-6-6" />
    </svg>
  );
}

function Power() {
  return (
    <svg viewBox="0 0 120 120" {...common}>
      <rect x="26" y="16" width="68" height="88" rx="3" />
      <path d="M40 32h10m-10 14h10m-10 14h10" />
      <path d="M66 58l-14 24h14l-4 20 22-30H70z" />
    </svg>
  );
}

const ICONS: Record<ServiceIconKey, () => React.JSX.Element> = {
  globe: Globe,
  circuit: Circuit,
  dashboard: Dashboard,
  ship: Ship,
  building: Building,
  document: Document,
  headset: Headset,
  power: Power,
};

export default function ServiceIcon({ icon }: { icon: ServiceIconKey }) {
  const Component = ICONS[icon];
  return <Component />;
}
