import type { Tile } from './types';
import { variantKey } from './tools';

function cellKey(col: number, row: number): string {
  return `${col},${row}`;
}

/**
 * Real Mahjong Solitaire freedom rule: a tile is playable only if nothing
 * else sits on top of it (same col/row, higher layer) AND at least one
 * lateral side - left or right, at its own layer - is completely open.
 */
export function computeFree(tiles: Tile[], removed: ReadonlySet<number>): Set<number> {
  const present = tiles.filter((t) => !removed.has(t.id));
  const topLayerAt = new Map<string, number>();
  const occupied = new Set<string>();
  for (const t of present) {
    const key = cellKey(t.col, t.row);
    const current = topLayerAt.get(key);
    if (current === undefined || t.layer > current) topLayerAt.set(key, t.layer);
    occupied.add(`${t.col},${t.row},${t.layer}`);
  }

  const free = new Set<number>();
  for (const t of present) {
    if (topLayerAt.get(cellKey(t.col, t.row)) !== t.layer) continue;
    const leftOpen = !occupied.has(`${t.col - 1},${t.row},${t.layer}`);
    const rightOpen = !occupied.has(`${t.col + 1},${t.row},${t.layer}`);
    if (leftOpen || rightOpen) free.add(t.id);
  }
  return free;
}

/** Whether at least one matching pair of currently-free tiles remains. */
export function hasAvailableMove(tiles: Tile[], removed: ReadonlySet<number>): boolean {
  const free = computeFree(tiles, removed);
  const byId = new Map(tiles.map((t) => [t.id, t]));
  const seen = new Set<string>();
  for (const id of free) {
    const key = variantKey(byId.get(id)!.variant);
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

export interface MatchResult {
  removed: Set<number>;
  stage: 'playing' | 'levelCleared' | 'lost';
}

/**
 * Resolves picking a second tile against the first selection: only
 * matches (and removes both) when they're the same tool+color AND both
 * are currently free. Returns null when the pair doesn't resolve, so the
 * caller can decide what to do with the tap (e.g. re-select).
 */
export function resolvePair(
  tiles: Tile[],
  removed: ReadonlySet<number>,
  firstId: number,
  secondId: number,
): MatchResult | null {
  if (firstId === secondId) return null;
  const byId = new Map(tiles.map((t) => [t.id, t]));
  const a = byId.get(firstId);
  const b = byId.get(secondId);
  if (!a || !b || variantKey(a.variant) !== variantKey(b.variant)) return null;

  const free = computeFree(tiles, removed);
  if (!free.has(firstId) || !free.has(secondId)) return null;

  const nextRemoved = new Set(removed);
  nextRemoved.add(firstId);
  nextRemoved.add(secondId);

  let stage: MatchResult['stage'] = 'playing';
  if (nextRemoved.size === tiles.length) stage = 'levelCleared';
  else if (!hasAvailableMove(tiles, nextRemoved)) stage = 'lost';

  return { removed: nextRemoved, stage };
}
