import type { LevelDef, Tile, ToolVariant } from './types';
import { MAX_TILE_TYPES, variantForIndex } from './tools';

export const TILE_SIZE = 38;

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(list: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Cell {
  col: number;
  row: number;
  layer: number;
}

/**
 * Stepped-pyramid board: layer 0 is a cols0 x rows0 rectangle, and every
 * layer above is inset by one cell on each side. Every layer shares the
 * same col/row numbering, so a higher-layer tile sits at the exact pixel
 * spot of whatever it covers below - which is what makes "something on
 * top of it" a simple lookup instead of needing a separate stacking model.
 */
function buildShape(cols0: number, rows0: number, maxLayers: number): Cell[] {
  const cells: Cell[] = [];
  for (let layer = 0; layer < maxLayers; layer++) {
    const colStart = layer;
    const colEnd = cols0 - 1 - layer;
    const rowStart = layer;
    const rowEnd = rows0 - 1 - layer;
    if (colEnd - colStart < 1 || rowEnd - rowStart < 1) break;
    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        cells.push({ col, row, layer });
      }
    }
  }
  return cells;
}

/**
 * Assigns a matching variant to every cell so the finished board is
 * guaranteed solvable, using a structural fact about the stepped-pyramid
 * shape instead of simulating removals: because cols0/rows0 are forced
 * even and every layer shrinks each side by exactly 1 cell, every single
 * row (one specific row, one specific layer) always has an EVEN width.
 * Pairing each row's current outermost two cells together, folding
 * inward, therefore always keeps that row's remaining width even too -
 * it can never stall on a lone unpaired cell with nothing left to match.
 *
 * A pair's two cells stay within one row/layer, and a row's own two
 * outer cells are never covered by a higher layer (a layer's rectangle
 * always insets 1 cell from the one below, so it never reaches that
 * row's edge columns) - so unwinding layers top-down, and each row
 * outside-in, is a valid real playthrough order for this exact pairing.
 */
function assignSolvableVariants(shape: Cell[], numTypes: number, seed: number): ToolVariant[] {
  const rng = mulberry32(seed);
  const assigned = new Array<ToolVariant>(shape.length);

  const rows = new Map<string, number[]>();
  shape.forEach((c, i) => {
    const key = `${c.layer}:${c.row}`;
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key)!.push(i);
  });
  for (const indices of rows.values()) indices.sort((a, b) => shape[a].col - shape[b].col);

  const pairs: [number, number][] = [];
  for (const indices of rows.values()) {
    let lo = 0;
    let hi = indices.length - 1;
    while (lo < hi) {
      pairs.push([indices[lo], indices[hi]]);
      lo++;
      hi--;
    }
  }

  // Shuffling the pair processing order (not the cell->variant mapping
  // itself) scatters which numeric variant id lands on which pair, so
  // same-colour pairs read as scattered across the board rather than
  // clustered row by row, while every pair still keeps its own two
  // cells matched to each other.
  const shuffledPairs = seededShuffle(pairs, Math.floor(rng() * 1e9));
  shuffledPairs.forEach(([a, b], i) => {
    const variant = variantForIndex(i % numTypes);
    assigned[a] = variant;
    assigned[b] = variant;
  });

  return assigned;
}

export function generateLevel(levelIndex: number): LevelDef {
  const numTypes = Math.min(3 + Math.floor(levelIndex / 2), MAX_TILE_TYPES);
  const maxLayers = Math.min(2 + Math.floor(levelIndex / 3), 6);
  const size = Math.min(6 + Math.floor(levelIndex / 4), 10);
  const cols0 = size % 2 === 0 ? size : size + 1;
  const rows0 = cols0;

  // cols0/rows0 are forced even and every layer insets by 1 cell on each
  // side, so every layer's width/height stays even too - the shape's
  // total cell count is always even already, with no trim needed.
  const shape = buildShape(cols0, rows0, maxLayers);

  const variants = assignSolvableVariants(shape, numTypes, levelIndex + 1);

  const tiles: Tile[] = shape.map((c, i) => ({
    id: i,
    variant: variants[i],
    col: c.col,
    row: c.row,
    layer: c.layer,
    x: c.col * TILE_SIZE,
    y: c.row * TILE_SIZE,
  }));

  const actualLayers = shape.reduce((max, c) => Math.max(max, c.layer), 0) + 1;

  return {
    index: levelIndex,
    tiles,
    numTypes,
    layers: actualLayers,
    pileWidth: cols0 * TILE_SIZE,
    pileHeight: rows0 * TILE_SIZE,
  };
}
