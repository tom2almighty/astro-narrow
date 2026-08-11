/*
 * The default theme id. Visitors pick any other color from the Dock — a row
 * of preset swatches plus a custom hue slider — which applies
 * `data-theme="custom"` and an inline `--seed`.
 */
export const defaultTheme = 'ink';

/* Seed recipe used by the runtime picker — validated for contrast. */
export const seedColor = (hue: number) => `oklch(52% 0.11 ${hue})`;

/* Preset swatches. `hue: null` is the monochrome default (restores ink). */
export const seedPresets = [
  { name: 'Ink', hue: null },
  { name: 'Iris', hue: 277 },
  { name: 'Blue', hue: 240 },
  { name: 'Teal', hue: 190 },
  { name: 'Grass', hue: 150 },
  { name: 'Rose', hue: 15 }
] as const;
