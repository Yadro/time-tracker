import ua, { Visitor } from 'universal-analytics';
import { v4 as uuid } from 'uuid';

const isEnabled =
  process.env.NODE_ENV === 'production' ||
  process.env.FORCE_ENABLE_ANALYTICS === 'true';

const gaCode = process.env.GA_UACODE;

let analytics: Visitor | null = null;

if (isEnabled && gaCode) {
  let uid = window.localStorage.getItem('uid');

  if (!uid) {
    uid = uuid();
    window.localStorage.setItem('uid', uid);
  }

  analytics = ua(gaCode, uid);
}

const executeOnCondition = (fn: () => void) => {
  if (isEnabled && analytics) {
    fn();
  }
};

const GaService = {
  pageView(path: string) {
    executeOnCondition(() => analytics?.pageview(path).send());
  },
  event(category: string, action: string) {
    executeOnCondition(() => analytics?.event(category, action).send());
  },
};

export default GaService;
