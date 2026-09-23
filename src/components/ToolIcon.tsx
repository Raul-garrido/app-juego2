import type { ToolVariant } from '../game/types';
import { VARIANT_COLORS } from '../game/tools';

const METAL = '#c7c9d6';
const METAL_DARK = '#8a8fa0';

function Martillo({ accent }: { accent: string }) {
  return (
    <>
      <rect x="4" y="2" width="16" height="7" rx="3" fill={METAL} />
      <rect x="10" y="8" width="4" height="14" rx="2" fill={accent} />
    </>
  );
}

function Destornillador({ accent }: { accent: string }) {
  return (
    <>
      <rect x="10.5" y="1" width="3" height="13" fill={METAL} />
      <rect x="7" y="13" width="10" height="10" rx="4" fill={accent} />
    </>
  );
}

function Llave({ accent }: { accent: string }) {
  return (
    <>
      <rect x="7" y="10.5" width="10" height="3" rx="1.5" fill={accent} />
      <circle cx="6" cy="6" r="4.5" fill="none" stroke={accent} strokeWidth="3" />
      <circle cx="18" cy="6" r="4.5" fill="none" stroke={accent} strokeWidth="3" />
    </>
  );
}

function Sierra({ accent }: { accent: string }) {
  return (
    <>
      <rect x="2" y="14" width="20" height="4" rx="1" fill={accent} transform="rotate(-18 12 16)" />
      <circle cx="17" cy="6" r="4.5" fill="none" stroke={accent} strokeWidth="3" />
    </>
  );
}

function Tornillo({ accent }: { accent: string }) {
  return (
    <>
      <polygon points="8,2 16,2 21,12 16,22 8,22 3,12" fill={accent} />
      <circle cx="12" cy="12" r="3" fill="none" stroke={METAL_DARK} strokeWidth="2" />
    </>
  );
}

function Nivel({ accent }: { accent: string }) {
  return (
    <>
      <rect x="2" y="10" width="20" height="5" rx="2" fill={accent} />
      <circle cx="12" cy="12.5" r="3" fill="none" stroke={METAL} strokeWidth="1.5" />
    </>
  );
}

function Alicates({ accent }: { accent: string }) {
  return (
    <>
      <rect x="10.5" y="1" width="3" height="22" rx="1.5" fill={accent} transform="rotate(20 12 12)" />
      <rect x="10.5" y="1" width="3" height="22" rx="1.5" fill={accent} transform="rotate(-20 12 12)" />
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
} as const;

export function ToolIcon({ variant, size = 26 }: { variant: ToolVariant; size?: number }) {
  const accent = VARIANT_COLORS[variant.colorIndex % VARIANT_COLORS.length];
  const Shape = SHAPE_COMPONENTS[variant.shape];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <Shape accent={accent} />
    </svg>
  );
}
