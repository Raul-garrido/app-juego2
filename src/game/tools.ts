import type { ToolShapeId, ToolVariant } from './types';

// Base tool photos. Each one is a real tool photograph (see ToolIcon.tsx);
// a colorIndex > 0 recolors it with a CSS hue-rotate filter so the same
// photo reads as a different-colored model of the same tool.
export const TOOL_SHAPES: ToolShapeId[] = [
  'martillo',
  'destornillador',
  'alicates',
  'alicatePunta',
  'llaveTubo',
  'llaveAllen',
  'cintaMetrica',
  'nivel',
  'cutter',
  'cizalla',
  'tijeraChapa',
  'tijeraVerde',
  'taladroBrocas',
  'estucheLlaves',
  'multimetro',
];

export const TOOL_LABELS: Record<ToolShapeId, string> = {
  martillo: 'Martillo',
  destornillador: 'Destornillador',
  alicates: 'Alicates',
  alicatePunta: 'Alicate de punta',
  llaveTubo: 'Llave de tubo',
  llaveAllen: 'Llaves Allen',
  cintaMetrica: 'Cinta metrica',
  nivel: 'Nivel',
  cutter: 'Cutter',
  cizalla: 'Cizalla',
  tijeraChapa: 'Tijera de chapa',
  tijeraVerde: 'Tijera de podar',
  taladroBrocas: 'Juego de brocas',
  estucheLlaves: 'Estuche de llaves',
  multimetro: 'Multimetro',
};

// Hue-rotation steps applied on top of each photo's real colors.
// 0 = the photo as shot; the rest recolor the (mostly desaturated
// metal + one saturated handle) photo into a plausible different model.
export const VARIANT_HUES = [0, 90, 150, 200, 260, 320];
export const VARIANT_NAMES = ['original', 'verde', 'lila', 'azul', 'morado', 'rosa'];

export const MAX_TILE_TYPES = TOOL_SHAPES.length * VARIANT_HUES.length;

export function variantKey(v: ToolVariant): string {
  return `${v.shape}-${v.colorIndex}`;
}

export function variantLabel(v: ToolVariant): string {
  const base = TOOL_LABELS[v.shape];
  if (v.colorIndex === 0) return base;
  return `${base} (${VARIANT_NAMES[v.colorIndex % VARIANT_NAMES.length]})`;
}

// Ordered list of every variant the generator can hand out: first every
// shape once (colorIndex 0, true photo colors), then the same shapes
// again recolored, and so on. This is the "cuando se acaban las
// herramientas, sale la misma con otro color" rule.
export function variantForIndex(i: number): ToolVariant {
  const shape = TOOL_SHAPES[i % TOOL_SHAPES.length];
  const colorIndex = Math.floor(i / TOOL_SHAPES.length) % VARIANT_HUES.length;
  return { shape, colorIndex };
}
