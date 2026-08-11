import { defaultTheme, seedColor } from '../config/theme';

type ColorScheme = 'light' | 'auto' | 'dark';

const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const codeThemes = {
  light: 'github-light',
  dark: 'github-dark'
};

const SEED_KEY = 'seed-hue';
const GLASS_KEY = 'glass-blur';
const GRAIN_KEY = 'grain';
const DEFAULT_HUE = 275;
const DEFAULT_GLASS = 16;

function currentColorMode() {
  return root.classList.contains('dark') ? 'dark' : 'light';
}

function storedScheme(): ColorScheme {
  const value = localStorage.getItem('color-mode');
  return value === 'light' || value === 'dark' ? value : 'auto';
}

function syncCodeTheme() {
  const theme = codeThemes[currentColorMode()];
  document.querySelectorAll<HTMLElement>('.expressive-code').forEach((block) => {
    block.dataset.theme = theme;
  });
}

function syncDisplayState() {
  const scheme = storedScheme();
  document.querySelectorAll<HTMLElement>('[data-color-scheme]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.colorScheme === scheme));
  });

  const hue = localStorage.getItem(SEED_KEY);
  document.querySelectorAll<HTMLInputElement>('[data-seed-hue]').forEach((input) => {
    input.value = hue !== null ? hue : String(DEFAULT_HUE);
  });
  const glass = localStorage.getItem(GLASS_KEY);
  document.querySelectorAll<HTMLInputElement>('[data-glass-blur]').forEach((input) => {
    input.value = glass !== null ? glass : String(DEFAULT_GLASS);
  });
  const grain = localStorage.getItem(GRAIN_KEY);
  document.querySelectorAll<HTMLInputElement>('[data-grain]').forEach((input) => {
    input.value = grain !== null ? grain : '0';
  });
  document.querySelectorAll<HTMLElement>('[data-seed-preset]').forEach((button) => {
    const value = button.dataset.seedPreset ?? '';
    const active = hue === null ? value === '' : value === hue;
    button.setAttribute('aria-pressed', String(active));
  });
}

function notifyColorModeChange() {
  document.dispatchEvent(
    new CustomEvent('astro-narrow:color-mode-change', {
      detail: { mode: currentColorMode() }
    })
  );
}

function applyScheme(scheme: ColorScheme) {
  const dark = scheme === 'dark' || (scheme === 'auto' && systemDark.matches);
  const changed = root.classList.contains('dark') !== dark;
  root.classList.toggle('dark', dark);
  syncDisplayState();
  if (changed) {
    syncCodeTheme();
    notifyColorModeChange();
  }
}

function setScheme(scheme: ColorScheme) {
  if (scheme === 'auto') localStorage.removeItem('color-mode');
  else localStorage.setItem('color-mode', scheme);
  applyScheme(scheme);
}

// Follow the OS while in auto mode.
systemDark.addEventListener('change', () => {
  if (storedScheme() === 'auto') applyScheme('auto');
});

/* Seed color picker ------------------------------------------------------- */

function applySeedHue(hue: number | null) {
  if (hue === null) {
    root.dataset.theme = defaultTheme;
    root.style.removeProperty('--seed');
  } else {
    root.dataset.theme = 'custom';
    root.style.setProperty('--seed', seedColor(hue));
  }
}

function setExpanded(button: HTMLElement | null, expanded: boolean) {
  button?.setAttribute('aria-expanded', String(expanded));
}

function setPanel(panel: HTMLElement | null, button: HTMLElement | null, open: boolean) {
  panel?.classList.toggle('hidden', !open);
  setExpanded(button, open);
}

document.addEventListener('input', (event) => {
  const target = event.target as HTMLElement;

  const seedInput = target.closest<HTMLInputElement>('[data-seed-hue]');
  if (seedInput) {
    localStorage.setItem(SEED_KEY, seedInput.value);
    applySeedHue(Number(seedInput.value));
    return;
  }

  const glassInput = target.closest<HTMLInputElement>('[data-glass-blur]');
  if (glassInput) {
    localStorage.setItem(GLASS_KEY, glassInput.value);
    root.style.setProperty('--glass-blur', `${glassInput.value}px`);
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
  if (presetButton) {
    const value = presetButton.dataset.seedPreset ?? '';
    if (value === '') {
      localStorage.removeItem(SEED_KEY);
      applySeedHue(null);
    } else {
      localStorage.setItem(SEED_KEY, value);
      applySeedHue(Number(value));
    }
    syncDisplayState();
    return;
  }

  const schemeButton = target.closest<HTMLElement>('[data-color-scheme]');
  if (schemeButton?.dataset.colorScheme) {
    setScheme(schemeButton.dataset.colorScheme as ColorScheme);
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
