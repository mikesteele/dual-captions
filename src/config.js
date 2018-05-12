import { default as secondLanguages } from './languages';

const config = {
  defaultSettings: {
    extraSpace: false
  },
  secondLanguages: secondLanguages,
  supportedSites: {
    YouTube: 'stable',
    Netflix: 'beta'
  }
}

export default config;
