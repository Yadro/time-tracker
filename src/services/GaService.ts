import ua from 'universal-analytics';

const isProd = true; //process.env.NODE_ENV === 'production';

const gaCode = process.env.GA_UACODE;
let analytics: any | null = null;
console.log(gaCode);
if (gaCode) {
  debugger;
  analytics = ua(gaCode);
}

const GaService = {
  pageView(path: string) {
    if (isProd) {
      analytics?.pageview(path).send();
    }
  },
  event(category: string, action: string) {
    if (isProd) {
      analytics?.event(category, action).send();
    }
  },
};

export default GaService;
