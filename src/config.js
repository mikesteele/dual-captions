import { default as secondLanguages } from './languages';

const config = {
  defaultSettings: {
    delayRenderingUntilTranslation: true,
    extraSpace: false,
    colorSubtitleEnabled: false,
    colorSubtitleBackgroundColor: '#000000',
    colorSubtitleTextColor: '#FFFFFF'
  },
  secondLanguages: secondLanguages,
  supportedSites: {
    YouTube: 'stable',
    Netflix: 'beta'
  }
}

export default config;
