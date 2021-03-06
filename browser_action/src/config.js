import { default as secondLanguages } from './languages';

const config = {
  defaultSettings: {
    extraSpace: false,
    customColorsEnabled: false,
    customTextColor: '#FFFFFF',
    hotKeyEnabled: true,
    hideActionPanel: false,
    customTextSize: 1,
    useHotKeys: true,
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
