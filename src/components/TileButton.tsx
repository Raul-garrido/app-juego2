import type { Tile } from '../game/types';
import { ToolIcon } from './ToolIcon';
import { variantKey } from '../game/tools';

interface Props {
  tile: Tile;
  free: boolean;
  selected: boolean;
  onTap: (id: number) => void;
}

export function TileButton({ tile, free, selected, onTap }: Props) {
  const className = [
    'tile',
    free ? 'tile--exposed' : 'tile--covered',
    selected ? 'tile--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      style={{ left: tile.x, top: tile.y, zIndex: tile.layer }}
      onClick={() => free && onTap(tile.id)}
      disabled={!free}
      aria-label="Herramienta"
      data-variant={variantKey(tile.variant)}
    >
      <ToolIcon variant={tile.variant} />
    </button>
  );
}
