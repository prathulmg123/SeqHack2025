// Environment configuration
interface EnvironmentConfig {
  googleAppsScriptUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: EnvironmentConfig = {
  googleAppsScriptUrl:'https://script.google.com/macros/s/AKfycbzWg_i2K341ZwIOHlr9XC-cBTTAOYJ90H04sd9G-Ugz_wV1PIr6qf-yAZgGnou76NLojA/exec',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config; 