import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localePrefix: 'always' // DÜZELTME: Her zaman /tr veya /en eklemesini zorunlu kıldık
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};