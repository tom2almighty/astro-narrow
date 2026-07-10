---
import '../../styles/global.css';
import { localeMeta, type Locale } from '../../config/i18n';
import { siteConfig } from '../../config/site';
import Header from './Header.astro';
import Footer from './Footer.astro';
import Dock from '../ui/Dock.astro';
import SearchModal from '../features/SearchModal.astro';
import Toc from '../features/Toc.astro';
import Comments from '../features/Comments.astro';
import Analytics from '../features/Analytics.astro';
import GalleryLightbox from '../features/GalleryLightbox.astro';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  title?: string;
  description?: string;
  locale?: Locale;
  headings?: Heading[];
  toc?: boolean | 'center' | 'side';
  comments?: boolean;
}

const {
  title = siteConfig.name,
  description = siteConfig.description,
  locale = 'en',
  headings = [],
  toc = false,
  comments = false
} = Astro.props;

const pageTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
const htmlLang = localeMeta[locale].htmlLang;
const assetBase = import.meta.env.BASE_URL || '/';
const faviconSvg = `${assetBase.replace(/\/?$/, '/')}favicon.svg`;
const faviconIco = `${assetBase.replace(/\/?$/, '/')}favicon.ico`;
const themeInit = `
(() => {
  const root = document.documentElement;
  const theme = localStorage.getItem('theme') || 'default';
  const mode = localStorage.getItem('color-mode');
  root.dataset.theme = theme;
  if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  }
})();
`;
---

<!doctype html>
<html lang={htmlLang} data-theme="default">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <link rel="icon" type="image/svg+xml" href={faviconSvg} />
    <link rel="icon" href={faviconIco} />
    <title>{pageTitle}</title>
    <script is:inline set:html={themeInit}></script>
  </head>
  <body class="bg-background text-foreground min-h-screen antialiased">
    <main class="mx-auto min-h-screen w-full px-4" style={`--layout-content-width: ${siteConfig.contentWidth}; max-width: var(--layout-content-width)`}>
      <Header locale={locale} />
      <slot />
      {comments && <Comments />}
      <Footer locale={locale} />
    </main>
    {toc && headings.length > 0 && <Toc headings={headings} position={toc === true ? 'center' : toc} />}
    {siteConfig.ui.dock.enabled && <Dock locale={locale} />}
    <SearchModal locale={locale} />
    <GalleryLightbox locale={locale} />
    <Analytics />
    <script>
      import '../../scripts/theme-controls.ts';
      import '../../scripts/reading-progress.ts';
      import '../../scripts/search.ts';
      import '../../scripts/toc.ts';
      import '../../scripts/gallery.ts';
      import '../../scripts/mermaid.ts';
      import '../../scripts/dock.ts';
      import '../../scripts/tabs.ts';
    </script>
  </body>
</html>
