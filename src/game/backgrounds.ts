// One board background per "family" of levels, cycling as you progress,
// so the screen isn't the exact same flat panel level after level.
// Kept dark and low-contrast on purpose: the ivory tiles have to stay
// the brightest thing on screen.
export const PANEL_BACKGROUNDS = [
  'linear-gradient(160deg, #1c1e26 0%, #14151b 100%)', // default slate
  'linear-gradient(160deg, #241c15 0%, #191410 100%)', // warm wood
  'linear-gradient(160deg, #131c22 0%, #0e1418 100%)', // steel blue
  'linear-gradient(160deg, #182018 0%, #101613 100%)', // pegboard green
  'radial-gradient(circle at 25% 15%, #2a2014 0%, #1c1e26 55%, #14151b 100%)', // workbench glow
  'linear-gradient(160deg, #201826 0%, #16121c 100%)', // violet dusk
];

export function panelBackgroundFor(levelIndex: number): string {
  return PANEL_BACKGROUNDS[levelIndex % PANEL_BACKGROUNDS.length];
}
