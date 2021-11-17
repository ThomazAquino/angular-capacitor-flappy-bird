import { Options } from 'cordova-res';
const run = require('cordova-res');

const options: Options = {
  skipConfig: true,
  copy: true,
  directory: '../../apps/web/android',
  resourcesDirectory: 'resources',
  logstream: process.stdout, // Any WritableStream
  platforms: {
    android: {
      icon: {
        sources: ['../../apps/web/android/resources/icon.png'],
      },
      splash: {
        sources: ['../../apps/web/android/resources/splash.png'] 
      },
      "adaptive-icon": {
        foreground: {
          sources: ['../../apps/web/android/resources/android/icon-foreground.png'] 
        },
        background: {
          sources: ['../../apps/web/android/resources/splash.png'] 
        },
      }
    },
    ios: {},
    windows: {}
  },
};

const generate = async () => {
  await run();
};

run();


// "resources": "cordova-res android 
// --skip-config 
// --copy 
// --icon-source apps/web/android/resources/icon.png 
// --splash-source apps/web/android/resources/splash.png 
// --icon-foreground-source apps/web/android/resources/android/icon-foreground.png 
// --icon-background-source apps/web/android/resources/android/icon-background.png 
// --android-project apps/web/android",
