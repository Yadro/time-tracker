import log from 'electron-log';
Object.assign(console, log.functions);

const Sentry =
  process.type === 'browser'
    ? require('@sentry/electron/dist/main')
    : require('@sentry/electron/dist/renderer');

export function initSentry() {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });
    console.log(`[process.type=${process.type}] Sentry.init succeeded`);
  }
}
