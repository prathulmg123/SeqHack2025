// Environment configuration
interface EnvironmentConfig {
  googleAppsScriptUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: EnvironmentConfig = {
  googleAppsScriptUrl:'https://script.google.com/macros/s/AKfycbx2AITH2Z9eODvXpGIybXprSsTrRj_GLWXhFPkpKnKfv-1oLPQ11KErUYNsrjYWFPw/exec',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config; 