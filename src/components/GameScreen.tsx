import { useMemo, useState } from 'react';
import { generateLevel } from '../game/levelGenerator';
import { computeFree, resolvePair } from '../game/gameLogic';
import { panelBackgroundFor } from '../game/backgrounds';
import type { Stage } from '../game/types';
import { TileButton } from './TileButton';

export function GameScreen() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [level, setLevel] = useState(() => generateLevel(0));
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [stage, setStage] = useState<Stage>('playing');

  const free = useMemo(() => computeFree(level.tiles, removed), [level, removed]);
  const pileLeft = level.tiles.length - removed.size;

  function handleTap(id: number) {
    if (stage !== 'playing') return;

    if (selected === null) {
      setSelected(id);
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }

    const result = resolvePair(level.tiles, removed, selected, id);
    if (!result) {
      // Not a match: treat the new tap as a fresh first pick instead of
      // silently ignoring it, so the wrong tap still feels responsive.
      setSelected(id);
      return;
    }

    setRemoved(result.removed);
    setSelected(null);
    setStage(result.stage);
  }

  function startLevel(index: number) {
    const next = generateLevel(index);
    setLevelIndex(index);
    setLevel(next);
    setRemoved(new Set());
    setSelected(null);
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
      </div>

      {stage === 'playing' && (
        <div className="pile" style={{ width: level.pileWidth, height: level.pileHeight }}>
          {level.tiles
            .filter((t) => !removed.has(t.id))
            .map((tile) => (
              <TileButton
                key={tile.id}
                tile={tile}
                free={free.has(tile.id)}
                selected={selected === tile.id}
                onTap={handleTap}
              />
            ))}
        </div>
      )}

      {stage === 'levelCleared' && (
        <div className="card card--win">
          <span className="card__title">NIVEL SUPERADO</span>
          <p className="card__body">Vaciaste el tablero. El siguiente nivel añade más capas.</p>
          <button className="card__button" onClick={nextLevel}>
            Siguiente nivel
          </button>
        </div>
      )}

      {stage === 'lost' && (
        <div className="card card--lost">
          <span className="card__title">SIN MOVIMIENTOS</span>
          <p className="card__body">No quedan parejas libres para juntar. Prueba otro orden.</p>
          <button className="card__button" onClick={retryLevel}>
            Reintentar nivel
          </button>
        </div>
      )}
    </div>
  );
}
