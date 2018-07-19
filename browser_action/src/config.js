import { default as secondLanguages } from './languages';

const config = {
  defaultSettings: {
    extraSpace: false,
    colorSubtitleEnabled: false,
    colorSubtitleBackgroundColor: '#000000',
    colorSubtitleTextColor: '#FFFFFF'
  },
  defaultSecondLanguage: 'none',
  defaultUILanguage: 'en',
  secondLanguages: secondLanguages,
  supportedSites: {
    YouTube: 'stable',
    Netflix: 'beta'
  }
}

export default config;
