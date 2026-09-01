const roots = [...document.querySelectorAll<HTMLElement>('[data-toc-root]')];

if (roots.length > 0) {
  const links = roots.flatMap((root) => [
    ...root.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')
  ]);
  const ticks = [...document.querySelectorAll<HTMLElement>('[data-toc-tick]')];
  const titles = [...document.querySelectorAll<HTMLElement>('[data-toc-title]')];

  const headingId = (link: HTMLAnchorElement) => decodeURIComponent(link.hash.slice(1));
  // Side mode renders capsule + rail, so the same heading appears twice — dedupe.
  const headings = [
    ...new Set([...links.map(headingId), ...ticks.map((tick) => tick.dataset.slug)])
  ]
    .map((id) => (id ? document.getElementById(id) : null))
    .filter(Boolean) as HTMLElement[];

  // Keep the active entry inside the rail flyout's own scroll box. Done by hand
  // because scrollIntoView would also scroll the page under the reader.
  function revealInScroller(link: HTMLElement) {
    const scroller = link.closest<HTMLElement>('[data-toc-scroll]');
    if (!scroller || scroller.scrollHeight <= scroller.clientHeight) return;
    const box = scroller.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    if (rect.top < box.top) scroller.scrollTop -= box.top - rect.top + 8;
    else if (rect.bottom > box.bottom) scroller.scrollTop += rect.bottom - box.bottom + 8;
  }

  function setActive(id: string) {
    let activeText = '';
    for (const link of links) {
      const active = headingId(link) === id;
      link.classList.toggle('toc-active', active);
      if (active) {
        if (link.textContent) activeText = link.textContent;
        revealInScroller(link);
      }
    }
    for (const tick of ticks) tick.classList.toggle('toc-active', tick.dataset.slug === id);
    if (activeText) {
      for (const title of titles) title.textContent = activeText;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible[0]?.target.id) setActive(visible[0].target.id);
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: [0, 1] }
  );
  headings.forEach((heading) => observer.observe(heading));

  // Pin: keeps the rail flyout open across pages. The attribute lives on <html>
  // so the inline theme script can restore it before paint, and so the CSS rule
  // can be scoped to the roomy container query — where a pinned panel has its
  // own gutter to sit in.
  const pinButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-toc-pin]')];
  if (pinButtons.length > 0) {
    const root = document.documentElement;
    const isPinned = () => root.dataset.tocPin === 'true';
    const syncPins = () => {
      const pinned = isPinned();
      for (const button of pinButtons) {
        const label = (pinned ? button.dataset.labelUnpin : button.dataset.labelPin) ?? '';
        button.setAttribute('aria-pressed', String(pinned));
        button.setAttribute('aria-label', label);
        button.title = label;
      }
    };

    syncPins();
    for (const button of pinButtons) {
      button.addEventListener('click', () => {
        if (isPinned()) {
          delete root.dataset.tocPin;
          // Written out, not removed: with the site default pinned, an absent
          // key would read as "pinned" again on the next page.
          localStorage.setItem('toc-pin', 'false');
        } else {
          root.dataset.tocPin = 'true';
          localStorage.setItem('toc-pin', 'true');
        }
        syncPins();
      });
    }
  }

  // Capsule open/close: hover opens on pointer devices with a short close
  // delay (plus a CSS hover bridge over the gap); click covers touch/keyboard.
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  for (const root of roots) {
    const toggle = root.querySelector<HTMLElement>('[data-toc-toggle]');
    const dropdown = root.querySelector<HTMLElement>('[data-toc-dropdown]');
    if (!toggle || !dropdown) continue;

    let closeTimer: number | undefined;
    const isOpen = () => dropdown.classList.contains('is-open');
    const close = () => {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      window.clearTimeout(closeTimer);
      dropdown.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      isOpen() ? close() : open();
    });
    if (canHover) {
      root.addEventListener('mouseenter', open);
      root.addEventListener('mouseleave', () => {
        closeTimer = window.setTimeout(close, 120);
      });
    }
    dropdown
      .querySelectorAll('[data-toc-link]')
      .forEach((link) => link.addEventListener('click', close));
    document.addEventListener('click', (event) => {
      if (isOpen() && !root.contains(event.target as Node)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) close();
    });
  }
}
