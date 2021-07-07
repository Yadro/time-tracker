import ua from 'universal-analytics';

const gaCode = process.env.GA_GCODE;
let analytics: any | null = null;
console.log(gaCode);
if (gaCode) {
  debugger;
  analytics = ua(gaCode);
}

export default analytics;
