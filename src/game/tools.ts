import type { ToolShapeId, ToolVariant } from './types';

// Base tool shapes. Each one is a reusable silhouette (see ToolIcon.tsx).
export const TOOL_SHAPES: ToolShapeId[] = [
  'martillo',
  'destornillador',
  'llave',
  'sierra',
  'tornillo',
  'nivel',
  'alicates',
  'taladro',
  'amoladora',
  'llaveAllen',
  'cintaMetrica',
  'brocha',
  'sierraDeArco',
  'pistolaPegamento',
];

export const TOOL_LABELS: Record<ToolShapeId, string> = {
  martillo: 'Martillo',
  destornillador: 'Destornillador',
  llave: 'Llave inglesa',
  sierra: 'Sierra',
  tornillo: 'Tornillo',
  nivel: 'Nivel',
  alicates: 'Alicates',
  taladro: 'Taladro electrico',
  amoladora: 'Amoladora',
  llaveAllen: 'Llave Allen',
  cintaMetrica: 'Cinta metrica',
  brocha: 'Brocha',
  sierraDeArco: 'Sierra de arco',
  pistolaPegamento: 'Pistola de pegamento',
};

// Recolorable "handle" accent. Metal parts of every tool stay a fixed
// neutral tone (see ToolIcon.tsx) so a color swap reads as a different
// model of the same tool, not a random palette change.
export const VARIANT_COLORS = ['#2f6fed', '#e8985c', '#5cc98a', '#e06baa', '#f0c94a', '#8a6de0'];
export const VARIANT_NAMES = ['azul', 'naranja', 'verde', 'rosa', 'amarillo', 'morado'];

export const MAX_TILE_TYPES = TOOL_SHAPES.length * VARIANT_COLORS.length;

export function variantKey(v: ToolVariant): string {
  return `${v.shape}-${v.colorIndex}`;
}

export function variantLabel(v: ToolVariant): string {
  const base = TOOL_LABELS[v.shape];
  if (v.colorIndex === 0) return base;
  return `${base} (mango ${VARIANT_NAMES[v.colorIndex % VARIANT_NAMES.length]})`;
}

// Ordered list of every variant the generator can hand out, ordered so
// that difficulty grows by first introducing every shape once (colorIndex
// 0), then reusing the same 7 shapes with a new handle color, and so on.
// This is exactly the "cuando se acaban las herramientas, sale la misma
// con otro color" rule.
export function variantForIndex(i: number): ToolVariant {
  const shape = TOOL_SHAPES[i % TOOL_SHAPES.length];
  const colorIndex = Math.floor(i / TOOL_SHAPES.length) % VARIANT_COLORS.length;
  return { shape, colorIndex };
}
