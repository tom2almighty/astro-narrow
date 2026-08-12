document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if (target.closest('[data-history-back]')) {
    const button = target.closest<HTMLElement>('[data-history-back]');
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = button?.dataset.fallback || '/';
    }
  }

  if (target.closest('[data-back-top]')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (target.closest('[data-layout-width-reset]')) {
    const input = document.querySelector<HTMLInputElement>('[data-layout-width]');
    if (!input) return;
    applyContentWidth(Number(input.dataset.defaultWidth));
    try {
      localStorage.removeItem('content-width');
    } catch {
      // 本地存储不可用时仍保留当前会话内的宽度调整。
    }
  }
});

const contentWidthInput = document.querySelector<HTMLInputElement>('[data-layout-width]');
const contentWidthOutput = document.querySelector<HTMLOutputElement>('[data-layout-width-output]');
const contentWidthReset = document.querySelector<HTMLButtonElement>('[data-layout-width-reset]');

function applyContentWidth(value: number) {
  if (!contentWidthInput || !Number.isFinite(value)) return;
  const minimum = Number(contentWidthInput.min);
  const maximum = Number(contentWidthInput.max);
  const clamped = Math.min(maximum, Math.max(minimum, value));
  const width = `${clamped}rem`;
  const defaultWidth = Number(contentWidthInput.dataset.defaultWidth);

  contentWidthInput.value = String(clamped);
  if (contentWidthOutput) contentWidthOutput.value = width;
  document.documentElement.style.setProperty('--layout-content-width', width);
  if (contentWidthReset) contentWidthReset.disabled = clamped === defaultWidth;
}

if (contentWidthInput) {
  const storedWidth = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--layout-content-width')
  );
  applyContentWidth(storedWidth);
  contentWidthInput.addEventListener('input', () =>
    applyContentWidth(Number(contentWidthInput.value))
  );
  contentWidthInput.addEventListener('change', () => {
    const value = Number(contentWidthInput.value);
    const defaultWidth = Number(contentWidthInput.dataset.defaultWidth);
    try {
      if (value === defaultWidth) localStorage.removeItem('content-width');
      else localStorage.setItem('content-width', `${value}rem`);
    } catch {
      // 本地存储不可用时仍保留当前会话内的宽度调整。
    }
  });
}
