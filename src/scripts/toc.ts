const roots = [...document.querySelectorAll<HTMLElement>('[data-toc-root]')];

if (roots.length > 0) {
  const links = roots.flatMap((root) => [
    ...root.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')
  ]);
  const titles = [...document.querySelectorAll<HTMLElement>('[data-toc-title]')];

  const headingId = (link: HTMLAnchorElement) => decodeURIComponent(link.hash.slice(1));
  // Side mode renders capsule + rail, so the same heading appears twice — dedupe.
  const headings = [...new Set(links.map(headingId))]
    .map((id) => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];

  function setActive(id: string) {
    let activeText = '';
    for (const link of links) {
      const active = headingId(link) === id;
      link.classList.toggle('toc-active', active);
      if (active && link.textContent) activeText = link.textContent;
    }
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
