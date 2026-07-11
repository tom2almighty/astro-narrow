const root = document.documentElement;
const codeThemes = {
  light: 'github-light',
  dark: 'github-dark'
};

function currentColorMode() {
  return root.classList.contains('dark') ? 'dark' : 'light';
}

function syncCodeTheme() {
  const theme = codeThemes[currentColorMode()];
  document.querySelectorAll<HTMLElement>('.expressive-code').forEach((block) => {
    block.dataset.theme = theme;
  });
}

function notifyColorModeChange() {
  document.dispatchEvent(
    new CustomEvent('astro-narrow:color-mode-change', {
      detail: { mode: currentColorMode() }
    })
  );
}

function closePanel(panel: HTMLElement | null) {
  panel?.classList.add('hidden');
}

function togglePanel(panel: HTMLElement | null) {
  panel?.classList.toggle('hidden');
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  const themeButton = target.closest('[data-theme-menu]');
  const langButton = target.closest('[data-lang-menu]');
  const mobileButton = target.closest('[data-mobile-menu]');
  const themePanel = document.querySelector<HTMLElement>('[data-theme-panel]');
  const langPanel = document.querySelector<HTMLElement>('[data-lang-panel]');
  const mobilePanel = document.querySelector<HTMLElement>('[data-mobile-panel]');

  if (themeButton) {
    togglePanel(themePanel);
    closePanel(langPanel);
    closePanel(mobilePanel);
    return;
  }

  if (langButton) {
    togglePanel(langPanel);
    closePanel(themePanel);
    closePanel(mobilePanel);
    return;
  }

  if (mobileButton) {
    togglePanel(mobilePanel);
    closePanel(themePanel);
    closePanel(langPanel);
    return;
  }

  const themeValue = target.closest<HTMLElement>('[data-theme-value]');
  if (themeValue?.dataset.themeValue) {
    root.dataset.theme = themeValue.dataset.themeValue;
    localStorage.setItem('theme', themeValue.dataset.themeValue);
    closePanel(themePanel);
    return;
  }

  if (target.closest('[data-color-mode]')) {
    root.classList.toggle('dark');
    localStorage.setItem('color-mode', root.classList.contains('dark') ? 'dark' : 'light');
    syncCodeTheme();
    notifyColorModeChange();
    return;
  }

  if (!target.closest('[data-theme-panel]')) closePanel(themePanel);
  if (!target.closest('[data-lang-panel]')) closePanel(langPanel);
  if (!target.closest('[data-mobile-panel]')) closePanel(mobilePanel);
});

syncCodeTheme();
