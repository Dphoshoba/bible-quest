import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.echoesandvisions.biblequest',
  appName: 'Bible Quest',
  webDir: 'build',
  plugins: {
    Share: {
      android: {
        enabled: true
      }
    }
  }
};

export default config;

