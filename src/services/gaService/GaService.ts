import ua from 'universal-analytics';

const isProd = process.env.NODE_ENV === 'production';

const gaCode = process.env.GA_UACODE;
let analytics: any | null = null;

if (isProd && gaCode) {
  analytics = ua(gaCode);
}

const executeOnCondition = (fn: () => void) => {
  if (isProd && analytics) {
    fn();
  }
};

const GaService = {
  pageView(path: string) {
    executeOnCondition(analytics?.pageview(path).send());
  },
  event(category: string, action: string) {
    executeOnCondition(analytics?.event(category, action).send());
  },
};

export default GaService;
