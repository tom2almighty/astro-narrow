import type { Locale } from './i18n';

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

/*
 * Color schemes: each re-tunes a few mix percentages of the one recipe
 * (`--scheme-*` knobs in tokens.css). `plain` is the shipped recipe. To add
 * your own, append an entry here and a matching `[data-scheme='<id>']` block
 * in tokens.css — the Dock picks it up automatically.
 */
export const defaultScheme = 'plain';

export const schemes: ReadonlyArray<{ id: string; name: Record<Locale, string> }> = [
  { id: 'plain', name: { en: 'Plain', 'zh-cn': '默认' } },
  { id: 'tinted', name: { en: 'Tinted', 'zh-cn': '着色' } },
  { id: 'vivid', name: { en: 'Vivid', 'zh-cn': '鲜明' } },
  { id: 'soft', name: { en: 'Soft', 'zh-cn': '柔和' } }
];
