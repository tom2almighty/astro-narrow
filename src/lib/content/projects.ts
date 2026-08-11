import type { CollectionEntry } from 'astro:content';
import { icons as simpleIcons } from '@iconify-json/simple-icons';
import type { Locale } from '../../config/i18n';

type Project = CollectionEntry<'projects'>;

/** 项目排序:order 优先,其余按标题字典序。 */
export function sortProjects(projects: Project[], locale: Locale) {
  const collator = new Intl.Collator(locale === 'zh-cn' ? 'zh-CN' : locale);
  return [...projects].sort((a, b) => {
    const orderA = a.data.order ?? Number.POSITIVE_INFINITY;
    const orderB = b.data.order ?? Number.POSITIVE_INFINITY;
    return orderA - orderB || collator.compare(a.data.title, b.data.title);
  });
}

// Generic link keys that describe a destination rather than a brand.
const genericIcons: Record<string, string> = {
  website: 'lucide:globe',
  site: 'lucide:globe',
  homepage: 'lucide:globe',
  home: 'lucide:globe',
  blog: 'lucide:globe',
  docs: 'lucide:book-open',
  documentation: 'lucide:book-open',
  demo: 'lucide:external-link',
  preview: 'lucide:external-link',
  download: 'lucide:download',
  releases: 'lucide:download',
  email: 'lucide:mail',
  mail: 'lucide:mail',
  feed: 'lucide:rss',
  rss: 'lucide:rss'
};

// Brand keys whose display casing differs from simple capitalization.
const brandLabels: Record<string, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  npm: 'npm',
  x: 'X',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  rss: 'RSS'
};

function hasSimpleIcon(key: string) {
  return Boolean(simpleIcons.icons[key] || simpleIcons.aliases?.[key]);
}

/**
 * links 的键名是用户自由指定的:优先匹配通用键,其次在 simple-icons
 * 图标集中按品牌名查找,最后回退到通用外链图标。
 */
export function projectLinkIcon(key: string) {
  const normalized = key.trim().toLowerCase();
  if (genericIcons[normalized]) return genericIcons[normalized];
  if (hasSimpleIcon(normalized)) return `simple-icons:${normalized}`;
  return 'lucide:arrow-up-right';
}

export function projectLinkLabel(key: string) {
  const normalized = key.trim().toLowerCase();
  if (brandLabels[normalized]) return brandLabels[normalized];
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
