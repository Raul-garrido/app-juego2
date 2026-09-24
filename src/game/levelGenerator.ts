import type { LevelDef, Tile, ToolVariant } from './types';
import { MAX_TILE_TYPES, variantForIndex } from './tools';

const TRAY_CAPACITY = 7;
const TILE_SIZE = 46;
const CONTAINER_WIDTH = 260;

// The peek offset is fixed, not scaled by stack depth: every covered
// tile in a cluster sits at the same small offset behind the exposed
// (topmost) one, which stays exactly on the cluster's anchor. That
// keeps a cluster's on-screen footprint the same whether it's 2 tiles
// deep or 6 - only the offset between GRID_STEP and jitter matters for
// whether neighbouring clickable tiles stay reachable, not stack depth.
const PEEK_OFFSET = 5;

// Packed grid: GRID_STEP is under TILE_SIZE, so neighbouring stacks
// overlap by design (mahjong-style clutter) instead of floating as
// separate islands with empty gaps between them. It's kept large
// enough, together with the small jitter below, that two neighbouring
// exposed (clickable) tiles never fully cover each other - only the
// covered tiles peeking out from underneath are meant to be obscured.
const GRID_STEP = 40;

// Small deterministic per-cluster jitter (position + rotation) so the
// pile reads as an organic jumble, not a rigid grid, while staying
// identical every time the same level is generated.
function jitterFor(n: number): { dx: number; dy: number; rot: number } {
  const dx = ((n * 53) % 7) - 3; // -3..3
  const dy = ((n * 29) % 7) - 3; // -3..3
  const rot = ((n * 17) % 13) - 6; // -6..6 degrees
  return { dx, dy, rot };
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
 * Layers start at 2 (never a flat, everything-exposed board — that
 * isn't a puzzle) and both knobs are capped so levels stay generatable
 * forever without needing new art.
 */
export function generateLevel(levelIndex: number): LevelDef {
  const numTypes = Math.min(3 + Math.floor(levelIndex / 2), MAX_TILE_TYPES);
  const layers = Math.min(2 + Math.floor(levelIndex / 3), 6);

  const variants: ToolVariant[] = [];
  for (let i = 0; i < numTypes; i++) variants.push(variantForIndex(i));

  const bag: ToolVariant[] = [];
  variants.forEach((v) => bag.push(v, v, v));
  const shuffled = seededShuffle(bag, levelIndex + 1);

  const clusterCount = Math.max(Math.ceil(shuffled.length / layers), 1);

  // A near-square grid (rather than a fixed wide row count) so a small
  // level forms a compact block instead of a thin strip with empty
  // space below it, and it's centred so it doesn't hug the left edge.
  const cols = Math.max(1, Math.ceil(Math.sqrt(clusterCount)));
  const rows = Math.ceil(clusterCount / cols);
  const gridWidth = cols * GRID_STEP;
  const gridHeight = rows * GRID_STEP;
  const xOffset = Math.max(0, (CONTAINER_WIDTH - gridWidth) / 2);

  function clusterAnchor(n: number): { x: number; y: number } {
    const col = n % cols;
    const row = Math.floor(n / cols);
    const { dx, dy } = jitterFor(n);
    return { x: xOffset + col * GRID_STEP + dx, y: row * GRID_STEP + dy };
  }

  // First pass: how many tiles land in each cluster, so we know which
  // one is the topmost (exposed, no offset) ahead of time.
  const clusterSize = new Array(clusterCount).fill(0);
  shuffled.forEach((_, idx) => clusterSize[idx % clusterCount]++);

  const clusterFill = new Array(clusterCount).fill(0);
  let maxY = gridHeight;
  const tiles: Tile[] = shuffled.map((variant, idx) => {
    const clusterId = idx % clusterCount;
    const layer = clusterFill[clusterId]++;
    const isTop = layer === clusterSize[clusterId] - 1;
    const anchor = clusterAnchor(clusterId);
    const { rot } = jitterFor(clusterId);
    const offset = isTop ? 0 : PEEK_OFFSET;
    const x = anchor.x + offset;
    const y = anchor.y + offset;
    maxY = Math.max(maxY, y + TILE_SIZE);
    return { id: idx, variant, clusterId, layer, x, y, rot };
  });

  return { index: levelIndex, tiles, trayCapacity: TRAY_CAPACITY, numTypes, layers, pileHeight: Math.max(maxY + 10, 280) };
}
