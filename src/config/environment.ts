// Environment configuration
interface EnvironmentConfig {
  googleAppsScriptUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: EnvironmentConfig = {
  googleAppsScriptUrl:'https://script.google.com/macros/s/AKfycbwx1BVEWToBQXNDqvFM43qK2gcxhfXtywVuth_LbLDrhI7aHSru9r6uNyPuXxyhXcYXDg/exec',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config; 