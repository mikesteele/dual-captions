import { default as secondLanguages } from './languages';

const config = {
  defaultSettings: {
    extraSpace: false
  },
  defaultSecondLanguage: 'en',
  defaultUILanguage: 'en',
  secondLanguages: secondLanguages,
  supportedSites: {
    YouTube: 'stable',
    Netflix: 'beta'
  }
}

export default config;
