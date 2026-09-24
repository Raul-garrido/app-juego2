import type { Tile } from '../game/types';
import { ToolIcon } from './ToolIcon';
import { variantKey } from '../game/tools';

interface Props {
  tile: Tile;
  exposed: boolean;
  onTap: (id: number) => void;
}

export function TileButton({ tile, exposed, onTap }: Props) {
  return (
    <button
      className={`tile${exposed ? ' tile--exposed' : ' tile--covered'}`}
      style={{ left: tile.x, top: tile.y, zIndex: tile.layer, ['--tile-rot' as string]: `${tile.rot}deg` }}
      onClick={() => exposed && onTap(tile.id)}
      disabled={!exposed}
      aria-label="Herramienta"
      data-variant={variantKey(tile.variant)}
    >
      <ToolIcon variant={tile.variant} />
    </button>
  );
}
