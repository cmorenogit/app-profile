import { defineMiddleware } from 'astro:middleware';

/**
 * Browser-language detection.
 *
 * On the FIRST visit to an un-prefixed (English) root route, if the browser
 * prefers Spanish (`Accept-Language` starts with `es`), redirect to the `/es`
 * equivalent. We only act on root entry points — once the user has navigated
 * (or already chose a language via the toggle), we never force a redirect.
 *
 * Only routes rendered on-demand (`prerender = false`) hit this at request
 * time; static pages run it at build time and are skipped by the guards below.
 */

// Un-prefixed routes we are willing to redirect on first visit.
const REDIRECTABLE_PATHS = new Set(['/', '/projects', '/projects/']);

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const pathname = url.pathname;

  if (REDIRECTABLE_PATHS.has(pathname)) {
    const accept = request.headers.get('accept-language') ?? '';
    const prefersSpanish = accept.trim().toLowerCase().startsWith('es');

    if (prefersSpanish) {
      const target =
        pathname === '/' ? '/es' : `/es${pathname.replace(/\/$/, '')}`;
      return context.redirect(target, 302);
    }
  }

  return next();
});
