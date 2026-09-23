import type { Tile } from '../game/types';
import { ToolIcon } from './ToolIcon';
import { variantKey } from '../game/tools';

interface Props {
  tray: number[];
  capacity: number;
  tilesById: Map<number, Tile>;
}

export function Tray({ tray, capacity, tilesById }: Props) {
  const slots = Array.from({ length: capacity }, (_, i) => tray[i]);
  return (
    <div className="tray">
      {slots.map((tileId, i) => (
        <div
          className={`tray-slot${tileId !== undefined ? ' tray-slot--filled' : ''}`}
          key={i}
          data-variant={tileId !== undefined ? variantKey(tilesById.get(tileId)!.variant) : undefined}
        >
          {tileId !== undefined && <ToolIcon variant={tilesById.get(tileId)!.variant} size={20} />}
        </div>
      ))}
    </div>
  );
}
