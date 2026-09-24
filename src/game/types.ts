export type ToolShapeId =
  | 'alicates'
  | 'alicatePunta'
  | 'cintaMetrica'
  | 'cizalla'
  | 'cutter'
  | 'destornillador'
  | 'estucheLlaves'
  | 'llaveAllen'
  | 'llaveTubo'
  | 'martillo'
  | 'multimetro'
  | 'nivel'
  | 'taladroBrocas'
  | 'tijeraChapa'
  | 'tijeraVerde'
  | 'amoladora'
  | 'compresor'
  | 'esmeriladora'
  | 'lijadora'
  | 'nivelLaser'
  | 'oscilante'
  | 'pistolaCalor'
  | 'rotativa'
  | 'sierraCircular'
  | 'sierraSable'
  | 'soplete'
  | 'tornilloBanco'
  | 'termometroInfrarrojo'
  | 'detectorMetales'
  | 'mordazasC'
  | 'grapadora'
  | 'aspiradoraManual'
  | 'aspiradora'
  | 'soldador';

export interface ToolVariant {
  shape: ToolShapeId;
  colorIndex: number;
}

export interface Tile {
  id: number;
  variant: ToolVariant;
  /** Grid position shared by every layer, so a tile directly above/beside
   * another one (same col/row) is what makes it locked. */
  col: number;
  row: number;
  layer: number;
  x: number;
  y: number;
}

export interface LevelDef {
  index: number;
  tiles: Tile[];
  numTypes: number;
  layers: number;
  pileWidth: number;
  pileHeight: number;
}

export type Stage = 'playing' | 'levelCleared' | 'lost';
