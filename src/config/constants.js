// src/config/constants.js
// Constantes de configuración que NO son sensibles

export const APP_CONFIG = {
  name: 'Simulador Bursátil',
  version: '1.0.0',
  apiTimeout: 10000,
  refreshInterval: 60000, // 1 minuto
  defaultSymbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'JNJ', 'WMT'],
}

export const CORS_CONFIG = {
  proxy: 'https://api.allorigins.win/raw?url=',
}

export const STORAGE_KEYS = {
  theme: 'app-theme',
  portfolio: 'user-portfolio',
}
