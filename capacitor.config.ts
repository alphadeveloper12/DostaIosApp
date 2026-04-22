import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dosta.app',
  appName: 'Dosta',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff'
  },
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '760692328304-hiu23pr6oq24ptkq3iiqqcm8k8rn639i.apps.googleusercontent.com',
      clientId: '760692328304-hiu23pr6oq24ptkq3iiqqcm8k8rn639i.apps.googleusercontent.com',
      androidClientId: '760692328304-hiu23pr6oq24ptkq3iiqqcm8k8rn639i.apps.googleusercontent.com',
      iosClientId: '760692328304-hiu23pr6oq24ptkq3iiqqcm8k8rn639i.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
