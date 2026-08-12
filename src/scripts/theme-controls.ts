import { defaultScheme, defaultTheme, inkSeed, seedPresets, type SeedRecipe } from '../config/theme';

type ColorMode = 'light' | 'auto' | 'dark';
type AppliedColorMode = 'light' | 'dark';

const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const codeThemes = {
  light: 'github-light',
  dark: 'github-dark'
};

const SEED_KEY = 'seed';
const GLASS_KEY = 'glass-blur';
const GRAIN_KEY = 'grain';
const SCHEME_KEY = 'scheme';
const DEFAULT_GLASS = 16;

function currentColorMode(): AppliedColorMode {
  return root.classList.contains('dark') ? 'dark' : 'light';
}

function storedMode(): ColorMode {
  const value = localStorage.getItem('color-mode');
  return value === 'light' || value === 'dark' ? value : 'auto';
}

function syncCodeTheme() {
  const theme = codeThemes[currentColorMode()];
  document.querySelectorAll<HTMLElement>('.expressive-code').forEach((block) => {
    block.dataset.theme = theme;
  });
}

/* Seed color ------------------------------------------------------------- */

function readStoredSeed(): SeedRecipe | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SEED_KEY) ?? 'null');
    if (value && typeof value === 'object') {
      const seed = value as Record<string, unknown>;
      if (typeof seed.l === 'number' && typeof seed.c === 'number' && typeof seed.h === 'number') {
        return { l: seed.l, c: seed.c, h: seed.h };
      }
    }
  } catch {
    // Corrupt storage — fall through to the default.
  }
  return null;
}

function writeStoredSeed(seed: SeedRecipe | null) {
  if (seed) localStorage.setItem(SEED_KEY, JSON.stringify(seed));
  else localStorage.removeItem(SEED_KEY);
}

/* Apply a recipe inline, or restore the ink theme (no inline values). */
function applySeed(seed: SeedRecipe | null) {
  if (seed) {
    root.dataset.theme = 'custom';
    root.style.setProperty('--seed-recipe-l', String(seed.l));
    root.style.setProperty('--seed-recipe-c', String(seed.c));
    root.style.setProperty('--seed-recipe-h', String(seed.h));
  } else {
    root.dataset.theme = defaultTheme;
    root.style.removeProperty('--seed-recipe-l');
    root.style.removeProperty('--seed-recipe-c');
    root.style.removeProperty('--seed-recipe-h');
  }
}

const seedMatches = (a: SeedRecipe, b: SeedRecipe) =>
  Math.abs(a.l - b.l) < 1e-3 && Math.abs(a.c - b.c) < 1e-3 && Math.abs(a.h - b.h) < 1e-3;

function currentSeed(): SeedRecipe {
  return readStoredSeed() ?? inkSeed;
}

function syncSeedControls(seed: SeedRecipe) {
  const hue = document.querySelector<HTMLInputElement>('[data-seed-h]');
  const chroma = document.querySelector<HTMLInputElement>('[data-seed-c]');
  const lightness = document.querySelector<HTMLInputElement>('[data-seed-l]');
  if (hue) hue.value = String(seed.h);
  if (chroma) chroma.value = String(seed.c);
  if (lightness) lightness.value = String(seed.l);

  const outputs = {
    '[data-seed-h-output]': `${Math.round(seed.h)}°`,
    '[data-seed-c-output]': seed.c.toFixed(2),
    '[data-seed-l-output]': `${Math.round(seed.l * 100)}%`
  };
  for (const [selector, text] of Object.entries(outputs)) {
    const output = document.querySelector<HTMLElement>(selector);
    if (output) output.textContent = text;
  }

  document.querySelectorAll<HTMLElement>('[data-seed-preset]').forEach((button) => {
    const preset = seedPresets.find((item) => item.id === button.dataset.seedPreset);
    button.setAttribute('aria-pressed', String(!!preset && seedMatches(preset, seed)));
  });
}

function syncDisplayState() {
  const mode = storedMode();
  document.querySelectorAll<HTMLElement>('[data-color-mode]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.colorMode === mode));
  });

  syncSeedControls(currentSeed());

  const glass = localStorage.getItem(GLASS_KEY);
  document.querySelectorAll<HTMLInputElement>('[data-glass-blur]').forEach((input) => {
    input.value = glass !== null ? glass : String(DEFAULT_GLASS);
  });
  const grain = localStorage.getItem(GRAIN_KEY);
  document.querySelectorAll<HTMLInputElement>('[data-grain]').forEach((input) => {
    input.value = grain !== null ? grain : '0';
  });
  const activeScheme = localStorage.getItem(SCHEME_KEY) ?? defaultScheme;
  document.querySelectorAll<HTMLElement>('[data-scheme-preset]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.schemePreset === activeScheme));
  });
}

function notifyColorModeChange() {
  document.dispatchEvent(
    new CustomEvent('astro-narrow:color-mode-change', {
      detail: { mode: currentColorMode() }
    })
  );
}

function applyMode(mode: ColorMode) {
  const dark = mode === 'dark' || (mode === 'auto' && systemDark.matches);
  const changed = root.classList.contains('dark') !== dark;
  root.classList.toggle('dark', dark);
  syncDisplayState();
  if (changed) {
    syncCodeTheme();
    notifyColorModeChange();
  }
}

function setMode(mode: ColorMode) {
  if (mode === 'auto') localStorage.removeItem('color-mode');
  else localStorage.setItem('color-mode', mode);
  applyMode(mode);
}

// Follow the OS while in auto mode.
systemDark.addEventListener('change', () => {
  if (storedMode() === 'auto') applyMode('auto');
});

function setExpanded(button: HTMLElement | null, expanded: boolean) {
  button?.setAttribute('aria-expanded', String(expanded));
}

function setPanel(panel: HTMLElement | null, button: HTMLElement | null, open: boolean) {
  panel?.classList.toggle('hidden', !open);
  setExpanded(button, open);
}

document.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;

  const seedInput = target.closest<HTMLInputElement>('[data-seed-h], [data-seed-c], [data-seed-l]');
  if (seedInput) {
    const hue = document.querySelector<HTMLInputElement>('[data-seed-h]');
    const chroma = document.querySelector<HTMLInputElement>('[data-seed-c]');
    const lightness = document.querySelector<HTMLInputElement>('[data-seed-l]');
    const seed = {
      h: Number(hue?.value ?? inkSeed.h),
      c: Number(chroma?.value ?? inkSeed.c),
      l: Number(lightness?.value ?? inkSeed.l)
    };
    writeStoredSeed(seed);
    applySeed(seed);
    syncSeedControls(seed);
    return;
  }

  const glassInput = target.closest<HTMLInputElement>('[data-glass-blur]');
  if (glassInput) {
    localStorage.setItem(GLASS_KEY, glassInput.value);
    root.style.setProperty('--glass', glassInput.value);
    return;
  }

  const grainInput = target.closest<HTMLInputElement>('[data-grain]');
  if (grainInput) {
    localStorage.setItem(GRAIN_KEY, grainInput.value);
    root.style.setProperty('--grain', String(Number(grainInput.value) / 100));
  }
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  const displayButton = target.closest<HTMLElement>('[data-display-menu]');
  const langButton = target.closest('[data-lang-menu]');
  const mobileButton = target.closest('[data-mobile-menu]');
  const displayPanel = document.querySelector<HTMLElement>('[data-display-panel]');
  const langPanel = document.querySelector<HTMLElement>('[data-lang-panel]');
  const mobilePanel = document.querySelector<HTMLElement>('[data-mobile-panel]');
  const langMenu = document.querySelector<HTMLElement>('[data-lang-menu]');
  const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');

  if (displayButton) {
    const willOpen = displayPanel?.classList.contains('hidden') ?? false;
    setPanel(displayPanel, displayButton, willOpen);
    setPanel(langPanel, langMenu, false);
    setPanel(mobilePanel, mobileMenu, false);
    return;
  }

  if (target.closest('[data-display-close]')) {
    setPanel(displayPanel, document.querySelector('[data-display-menu]'), false);
    return;
  }

  if (langButton) {
    const willOpen = langPanel?.classList.contains('hidden') ?? false;
    setPanel(langPanel, langMenu, willOpen);
    setPanel(displayPanel, document.querySelector('[data-display-menu]'), false);
    setPanel(mobilePanel, mobileMenu, false);
    return;
  }

  if (mobileButton) {
    const willOpen = mobilePanel?.classList.contains('hidden') ?? false;
    setPanel(mobilePanel, mobileMenu, willOpen);
    setPanel(displayPanel, document.querySelector('[data-display-menu]'), false);
    setPanel(langPanel, langMenu, false);
    return;
  }

  const presetButton = target.closest<HTMLElement>('[data-seed-preset]');
  if (presetButton?.dataset.seedPreset) {
    const preset = seedPresets.find((item) => item.id === presetButton.dataset.seedPreset);
    const seed = preset && preset.id !== 'ink' ? preset : null;
    writeStoredSeed(seed);
    applySeed(seed);
    syncSeedControls(seed ?? inkSeed);
    return;
  }

  const schemePresetButton = target.closest<HTMLElement>('[data-scheme-preset]');
  if (schemePresetButton?.dataset.schemePreset) {
    const id = schemePresetButton.dataset.schemePreset;
    if (id === defaultScheme) localStorage.removeItem(SCHEME_KEY);
    else localStorage.setItem(SCHEME_KEY, id);
    root.dataset.scheme = id;
    syncDisplayState();
    return;
  }

  const modeButton = target.closest<HTMLElement>('[data-color-mode]');
  if (modeButton?.dataset.colorMode) {
    setMode(modeButton.dataset.colorMode as ColorMode);
    return;
  }

  if (!target.closest('[data-display-panel]')) setPanel(displayPanel, document.querySelector('[data-display-menu]'), false);
  if (!target.closest('[data-lang-panel]')) setPanel(langPanel, langMenu, false);
  if (!target.closest('[data-mobile-panel]')) setPanel(mobilePanel, mobileMenu, false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  setPanel(document.querySelector('[data-display-panel]'), document.querySelector('[data-display-menu]'), false);
  setPanel(document.querySelector('[data-lang-panel]'), document.querySelector('[data-lang-menu]'), false);
  setPanel(document.querySelector('[data-mobile-panel]'), document.querySelector('[data-mobile-menu]'), false);
});

syncCodeTheme();
syncDisplayState();
