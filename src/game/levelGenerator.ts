import type { LevelDef, Tile, ToolVariant } from './types';
import { MAX_TILE_TYPES, variantForIndex } from './tools';

const TRAY_CAPACITY = 7;
const TILE_SIZE = 46;
const LAYER_STEP = 7;

// The first 12 anchors are hand-placed so a level using only a few of
// them still spreads across the whole pile area (top, middle and
// bottom), instead of filling row by row and leaving the bottom empty.
// Beyond that, more rows are generated procedurally on the same 4
// columns so very late, very crowded levels never run out of room
// instead of stacking dozens of tiles on the same spot.
const BASE_ANCHORS: Array<{ x: number; y: number }> = [
  { x: 14, y: 7 }, { x: 283, y: 205 }, { x: 96, y: 107 }, { x: 193, y: 6 },
  { x: 7, y: 214 }, { x: 275, y: 106 }, { x: 277, y: 15 }, { x: 105, y: 207 },
  { x: 15, y: 113 }, { x: 95, y: 14 }, { x: 186, y: 213 }, { x: 194, y: 114 },
];
const COL_X = [14, 96, 193, 277];
const ROW_HEIGHT = 100;
const EXTRA_ROWS_START_Y = 314;

function clusterAnchor(n: number): { x: number; y: number } {
  if (n < BASE_ANCHORS.length) return BASE_ANCHORS[n];
  const extraIndex = n - BASE_ANCHORS.length;
  const row = Math.floor(extraIndex / COL_X.length);
  const col = extraIndex % COL_X.length;
  return { x: COL_X[col], y: EXTRA_ROWS_START_Y + row * ROW_HEIGHT };
}

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

/**
 * Difficulty grows with the level index by two independent knobs:
 * - numTypes: how many distinct tool+color combinations are in play
 *   (more types = harder to complete a triple before the tray fills).
 * - layers: how many tiles can stack on the same spot (more layers =
 *   more hidden tiles you must dig through in the right order).
 * numTypes is capped at MAX_TILE_TYPES (7 base shapes x 6 handle
 * colors), so levels stay generatable forever without needing new art;
 * once that cap is hit, every later level just reshuffles the same 42
 * tile types at max layers, which is still a fresh layout each time.
 */
export function generateLevel(levelIndex: number): LevelDef {
  const numTypes = Math.min(3 + Math.floor(levelIndex / 2), MAX_TILE_TYPES);
  const layers = Math.min(1 + Math.floor(levelIndex / 3), 5);

  const variants: ToolVariant[] = [];
  for (let i = 0; i < numTypes; i++) variants.push(variantForIndex(i));

  const bag: ToolVariant[] = [];
  variants.forEach((v) => bag.push(v, v, v));
  const shuffled = seededShuffle(bag, levelIndex + 1);

  const clusterCount = Math.max(Math.ceil(shuffled.length / layers), 1);
  const clusterFill = new Array(clusterCount).fill(0);

  let maxY = 0;
  const tiles: Tile[] = shuffled.map((variant, idx) => {
    const clusterId = idx % clusterCount;
    const layer = clusterFill[clusterId]++;
    const anchor = clusterAnchor(clusterId);
    const y = anchor.y + layer * LAYER_STEP;
    maxY = Math.max(maxY, y + TILE_SIZE);
    return { id: idx, variant, clusterId, layer, x: anchor.x + layer * LAYER_STEP, y };
  });

  return { index: levelIndex, tiles, trayCapacity: TRAY_CAPACITY, numTypes, layers, pileHeight: Math.max(maxY + 10, 280) };
}
