import type { Tile } from './types';
import { variantKey } from './tools';

/** A tile is tappable only if it's the highest layer still present in its stack. */
export function computeExposed(tiles: Tile[], removed: ReadonlySet<number>): Set<number> {
  const topByCluster = new Map<number, Tile>();
  for (const tile of tiles) {
    if (removed.has(tile.id)) continue;
    const current = topByCluster.get(tile.clusterId);
    if (!current || tile.layer > current.layer) topByCluster.set(tile.clusterId, tile);
  }
  return new Set(Array.from(topByCluster.values(), (t) => t.id));
}

export interface TapResult {
  removed: Set<number>;
  tray: number[];
  stage: 'playing' | 'levelCleared' | 'lost';
}

/**
 * Resolves tapping tile `id`: adds it to the tray, clears a completed
 * triple if one formed, and decides whether the level is now cleared or
 * lost (tray full with no completed set).
 */
export function tapTile(
  tiles: Tile[],
  removed: ReadonlySet<number>,
  tray: readonly number[],
  trayCapacity: number,
  id: number,
): TapResult {
  const nextRemoved = new Set(removed);
  nextRemoved.add(id);
  let nextTray = [...tray, id];

  const byId = new Map(tiles.map((t) => [t.id, t]));
  const counts = new Map<string, number>();
  for (const tid of nextTray) {
    const key = variantKey(byId.get(tid)!.variant);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const matchKey = Array.from(counts.entries()).find(([, count]) => count >= 3)?.[0];
  if (matchKey) {
    let toRemove = 3;
    nextTray = nextTray.filter((tid) => {
      if (toRemove > 0 && variantKey(byId.get(tid)!.variant) === matchKey) {
        toRemove--;
        return false;
      }
      return true;
    });
  }

  let stage: TapResult['stage'] = 'playing';
  if (nextRemoved.size === tiles.length) stage = 'levelCleared';
  else if (nextTray.length >= trayCapacity) stage = 'lost';

  return { removed: nextRemoved, tray: nextTray, stage };
}
