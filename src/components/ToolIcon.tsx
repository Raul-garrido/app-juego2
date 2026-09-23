import { useId } from 'react';
import type { ToolVariant } from '../game/types';
import { VARIANT_COLORS } from '../game/tools';

const METAL_LIGHT = '#f1f2f6';
const METAL = '#c7c9d6';
const METAL_DARK = '#8a8fa0';

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

interface ShapeProps {
  accent: string;
  accentUrl: string;
  metalUrl: string;
}

function Martillo({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="4" y="2" width="16" height="7" rx="3" fill={metalUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <rect x="10" y="8" width="4" height="14" rx="2" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
    </>
  );
}

function Destornillador({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="10.5" y="1" width="3" height="13" fill={metalUrl} stroke="rgba(0,0,0,0.2)" strokeWidth="0.4" />
      <rect x="7" y="13" width="10" height="10" rx="4" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
    </>
  );
}

function Llave({ accent, accentUrl }: ShapeProps) {
  return (
    <>
      <rect x="7" y="10.5" width="10" height="3" rx="1.5" fill={accentUrl} />
      <circle cx="6" cy="6" r="4.5" fill="none" stroke={accent} strokeWidth="3" />
      <circle cx="18" cy="6" r="4.5" fill="none" stroke={accent} strokeWidth="3" />
    </>
  );
}

function Sierra({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <circle cx="5" cy="17" r="4.5" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <polygon points="7,15 22,3 23,4.5 8,17" fill={metalUrl} stroke="rgba(0,0,0,0.2)" strokeWidth="0.4" />
      <polyline
        points="9.5,14.1 11,15.9 12.5,12.9 14,14.7 15.5,11.7 17,13.5 18.5,10.5"
        fill="none"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function Tornillo({ accentUrl }: ShapeProps) {
  return (
    <>
      <polygon points="8,2 16,2 21,12 16,22 8,22 3,12" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="3" fill="none" stroke={METAL_DARK} strokeWidth="2" />
    </>
  );
}

function Nivel({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="1" y="8.5" width="22" height="7" rx="2.5" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <rect x="9" y="10" width="6" height="4" rx="1" fill={metalUrl} />
      <circle cx="12" cy="12" r="1.6" fill="#dff2ea" stroke="#3fa76c" strokeWidth="0.8" />
    </>
  );
}

function Alicates({ accentUrl }: ShapeProps) {
  return (
    <>
      <rect x="10.5" y="1" width="3" height="22" rx="1.5" fill={accentUrl} transform="rotate(20 12 12)" />
      <rect x="10.5" y="1" width="3" height="22" rx="1.5" fill={accentUrl} transform="rotate(-20 12 12)" />
    </>
  );
}

function Taladro({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="1" y="5" width="13" height="6.5" rx="3" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <rect x="4" y="10.5" width="5.5" height="10" rx="2.3" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" transform="rotate(14 6.75 10.5)" />
      <polygon points="14,6.2 20,4.5 20,12 14,10.3" fill={metalUrl} stroke="rgba(0,0,0,0.2)" strokeWidth="0.4" />
      <rect x="20" y="7.1" width="4" height="1.8" fill={METAL_DARK} />
    </>
  );
}

function Amoladora({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="2" y="9" width="9" height="7" rx="2" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <circle cx="16" cy="12.5" r="6.5" fill={metalUrl} stroke={METAL_DARK} strokeWidth="1.2" />
      <circle cx="16" cy="12.5" r="1.8" fill={METAL_DARK} />
    </>
  );
}

function LlaveAllen({ accentUrl }: ShapeProps) {
  return (
    <>
      <rect x="4" y="4" width="4" height="16" rx="1.5" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <rect x="4" y="16" width="14" height="4" rx="1.5" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
    </>
  );
}

function CintaMetrica({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <circle cx="10" cy="12" r="8" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <circle cx="10" cy="12" r="3.2" fill={metalUrl} />
      <rect x="16.5" y="10.5" width="6" height="3" fill={metalUrl} stroke="rgba(0,0,0,0.2)" strokeWidth="0.4" />
    </>
  );
}

function Brocha({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="10" y="2" width="3.5" height="12" fill={metalUrl} stroke="rgba(0,0,0,0.2)" strokeWidth="0.4" />
      <polygon points="6,13 18,13 15,22 9,22" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
    </>
  );
}

function SierraDeArco({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="2" y="3" width="3" height="16" rx="1.5" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <rect x="2" y="3" width="14" height="3" rx="1.5" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <rect x="2" y="16" width="10" height="3" rx="1.5" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <line x1="14.5" y1="6.5" x2="10.5" y2="17" stroke={metalUrl} strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

function PistolaPegamento({ accentUrl, metalUrl }: ShapeProps) {
  return (
    <>
      <rect x="3" y="6" width="12" height="6" rx="2" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <rect x="6" y="11" width="5" height="9" rx="2" fill={accentUrl} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" transform="rotate(18 8.5 11)" />
      <rect x="14" y="7.5" width="7" height="3" rx="1" fill={metalUrl} stroke="rgba(0,0,0,0.2)" strokeWidth="0.4" />
    </>
  );
}

const SHAPE_COMPONENTS = {
  martillo: Martillo,
  destornillador: Destornillador,
  llave: Llave,
  sierra: Sierra,
  tornillo: Tornillo,
  nivel: Nivel,
  alicates: Alicates,
  taladro: Taladro,
  amoladora: Amoladora,
  llaveAllen: LlaveAllen,
  cintaMetrica: CintaMetrica,
  brocha: Brocha,
  sierraDeArco: SierraDeArco,
  pistolaPegamento: PistolaPegamento,
} as const;

export function ToolIcon({ variant, size = 26 }: { variant: ToolVariant; size?: number }) {
  const uid = useId();
  const accent = VARIANT_COLORS[variant.colorIndex % VARIANT_COLORS.length];
  const accentLight = shade(accent, 55);
  const accentDark = shade(accent, -35);
  const accentGradId = `ag-${uid}`;
  const metalGradId = `mg-${uid}`;
  const Shape = SHAPE_COMPONENTS[variant.shape];

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={accentGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentLight} />
          <stop offset="55%" stopColor={accent} />
          <stop offset="100%" stopColor={accentDark} />
        </linearGradient>
        <linearGradient id={metalGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={METAL_LIGHT} />
          <stop offset="60%" stopColor={METAL} />
          <stop offset="100%" stopColor={METAL_DARK} />
        </linearGradient>
      </defs>
      <Shape accent={accent} accentUrl={`url(#${accentGradId})`} metalUrl={`url(#${metalGradId})`} />
    </svg>
  );
}
