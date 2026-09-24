import { useMemo, useState } from 'react';
import { generateLevel } from '../game/levelGenerator';
import { computeExposed, tapTile } from '../game/gameLogic';
import { panelBackgroundFor } from '../game/backgrounds';
import type { Stage } from '../game/types';
import { TileButton } from './TileButton';
import { Tray } from './Tray';

export function GameScreen() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [level, setLevel] = useState(() => generateLevel(0));
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [tray, setTray] = useState<number[]>([]);
  const [stage, setStage] = useState<Stage>('playing');

  const tilesById = useMemo(() => new Map(level.tiles.map((t) => [t.id, t])), [level]);
  const exposed = useMemo(() => computeExposed(level.tiles, removed), [level, removed]);
  const pileLeft = level.tiles.length - removed.size;

  function handleTap(id: number) {
    if (stage !== 'playing') return;
    const result = tapTile(level.tiles, removed, tray, level.trayCapacity, id);
    setRemoved(result.removed);
    setTray(result.tray);
    setStage(result.stage);
  }

  function startLevel(index: number) {
    const next = generateLevel(index);
    setLevelIndex(index);
    setLevel(next);
    setRemoved(new Set());
    setTray([]);
    setStage('playing');
  }

  function nextLevel() {
    startLevel(levelIndex + 1);
  }

  function retryLevel() {
    startLevel(levelIndex);
  }

  function restartFromOne() {
    startLevel(0);
  }

  return (
    <div className="screen" style={{ background: panelBackgroundFor(levelIndex) }}>
      <div className="hud">
        <span className="hud__level">Nivel {levelIndex + 1}</span>
        <span className="hud__meta">
          {level.numTypes} herramientas · {level.layers} capas
        </span>
        <button className="hud__reset" onClick={restartFromOne}>
          Reiniciar
        </button>
      </div>
      <div className="hud hud--secondary">
        <span>{pileLeft} fichas</span>
        <span>
          {tray.length} / {level.trayCapacity} bandeja
        </span>
      </div>

      {stage === 'playing' && (
        <>
          <div className="pile" style={{ height: level.pileHeight }}>
            {level.tiles
              .filter((t) => !removed.has(t.id))
              .map((tile) => (
                <TileButton key={tile.id} tile={tile} exposed={exposed.has(tile.id)} onTap={handleTap} />
              ))}
          </div>
          <Tray tray={tray} capacity={level.trayCapacity} tilesById={tilesById} />
        </>
      )}

      {stage === 'levelCleared' && (
        <div className="card card--win">
          <span className="card__title">NIVEL SUPERADO</span>
          <p className="card__body">Vaciaste el taller. El siguiente nivel mezcla mas herramientas.</p>
          <button className="card__button" onClick={nextLevel}>
            Siguiente nivel
          </button>
        </div>
      )}

      {stage === 'lost' && (
        <div className="card card--lost">
          <span className="card__title">BANDEJA LLENA</span>
          <p className="card__body">Sin hueco para mas fichas. Prueba otro orden.</p>
          <button className="card__button" onClick={retryLevel}>
            Reintentar nivel
          </button>
        </div>
      )}
    </div>
  );
}
