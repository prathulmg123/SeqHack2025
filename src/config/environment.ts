// Environment configuration
interface EnvironmentConfig {
  googleAppsScriptUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: EnvironmentConfig = {
  googleAppsScriptUrl:'https://script.google.com/macros/s/AKfycbw3Pa8LN5tGjm-7lcTDQZIuKJzQM3kFT-ObeMDFM0GHuATlQ0iy0JNNCHVkAoJYYpKUUQ/exec',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config; 