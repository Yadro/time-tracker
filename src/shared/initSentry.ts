const Sentry =
  process.type === 'browser'
    ? require('@sentry/electron/dist/main')
    : require('@sentry/electron/dist/renderer');

export function initSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });
  }
}
