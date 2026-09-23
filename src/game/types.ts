export type ToolShapeId =
  | 'martillo'
  | 'destornillador'
  | 'llave'
  | 'sierra'
  | 'tornillo'
  | 'nivel'
  | 'alicates';

export interface ToolVariant {
  shape: ToolShapeId;
  colorIndex: number;
}

export interface Tile {
  id: number;
  variant: ToolVariant;
  clusterId: number;
  layer: number;
  x: number;
  y: number;
}

export interface LevelDef {
  index: number;
  tiles: Tile[];
  trayCapacity: number;
  numTypes: number;
  layers: number;
  pileHeight: number;
}

export type Stage = 'playing' | 'levelCleared' | 'lost';
