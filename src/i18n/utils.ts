import { ui, defaultLang } from './ui';

export type Lang = keyof typeof ui;

/** Read the active locale from a URL path. `/es/...` → 'es', anything else → defaultLang. */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

/** Returns a translator bound to a language, falling back to the default lang for missing keys. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Build the equivalent path in the other language.
 * `/` ↔ `/es`, `/projects` ↔ `/es/projects`, etc.
 */
export function getLocalizedPath(url: URL, targetLang: Lang): string {
  const segments = url.pathname.split('/').filter(Boolean);
  // Strip an existing locale prefix if present.
  if (segments[0] in ui) segments.shift();
  const rest = segments.join('/');
  if (targetLang === defaultLang) {
    return rest ? `/${rest}` : '/';
  }
  return rest ? `/${targetLang}/${rest}` : `/${targetLang}`;
}
