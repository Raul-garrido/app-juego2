import type { ToolVariant } from '../game/types';
import { VARIANT_HUES } from '../game/tools';

import alicates from '../assets/tools-photo/alicates.png';
import alicatePunta from '../assets/tools-photo/alicatePunta.png';
import cintaMetrica from '../assets/tools-photo/cintaMetrica.png';
import cizalla from '../assets/tools-photo/cizalla.png';
import cutter from '../assets/tools-photo/cutter.png';
import destornillador from '../assets/tools-photo/destornillador.png';
import estucheLlaves from '../assets/tools-photo/estucheLlaves.png';
import llaveAllen from '../assets/tools-photo/llaveAllen.png';
import llaveTubo from '../assets/tools-photo/llaveTubo.png';
import martillo from '../assets/tools-photo/martillo.png';
import multimetro from '../assets/tools-photo/multimetro.png';
import nivel from '../assets/tools-photo/nivel.png';
import taladroBrocas from '../assets/tools-photo/taladroBrocas.png';
import tijeraChapa from '../assets/tools-photo/tijeraChapa.png';
import tijeraVerde from '../assets/tools-photo/tijeraVerde.png';

const PHOTOS: Record<ToolVariant['shape'], string> = {
  alicates,
  alicatePunta,
  cintaMetrica,
  cizalla,
  cutter,
  destornillador,
  estucheLlaves,
  llaveAllen,
  llaveTubo,
  martillo,
  multimetro,
  nivel,
  taladroBrocas,
  tijeraChapa,
  tijeraVerde,
};

export function ToolIcon({ variant, size = 34 }: { variant: ToolVariant; size?: number }) {
  const hue = VARIANT_HUES[variant.colorIndex % VARIANT_HUES.length];
  const filter = hue === 0 ? 'none' : `hue-rotate(${hue}deg) saturate(1.35)`;
  return (
    <img
      src={PHOTOS[variant.shape]}
      alt=""
      draggable={false}
      style={{ width: size, height: size, objectFit: 'contain', filter, pointerEvents: 'none' }}
    />
  );
}
