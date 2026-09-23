import { TOOL_SHAPES, TOOL_LABELS, VARIANT_HUES } from '../game/tools';
import { ToolIcon } from './ToolIcon';

/** Dev-only visual QA grid: every tool shape x every handle color. */
export function IconGallery() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TOOL_SHAPES.map((shape) => (
        <div key={shape} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 160, fontSize: 12, color: '#eceef2' }}>{TOOL_LABELS[shape]}</span>
          {VARIANT_HUES.map((_, colorIndex) => (
            <div
              key={colorIndex}
              className="tile tile--exposed"
              style={{ position: 'relative', left: 'auto', top: 'auto' }}
            >
              <ToolIcon variant={{ shape, colorIndex }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
