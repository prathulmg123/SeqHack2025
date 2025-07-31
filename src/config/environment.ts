// Environment configuration
interface EnvironmentConfig {
  googleAppsScriptUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: EnvironmentConfig = {
  googleAppsScriptUrl:'https://script.google.com/macros/s/AKfycbylniL8zxkWseaj0-B52ToFg3qu9Or-BROy0_tTRlWnSgZa0tS9ASR-AdalqUbwlRTaew/exec',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config; 