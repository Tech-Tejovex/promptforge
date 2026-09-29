import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Use as-needed to avoid prefixing the default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
