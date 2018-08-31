// Create window.DC
import '../../public/content-scripts/init';
// Create adapter
import '../../public/content-scripts/config/init';
// Creater fetcher
import '../../public/content-scripts/init/fetcher';
// Create parser
import '../../public/content-scripts/init/parser';
// Create provider
import '../../public/content-scripts/init/provider';
// Create observer
import './chrome-mock';
import '../../public/content-scripts/dual-captions';

const observer = window.DC.DUAL_CAPTIONS;

it('should have settingsAreDefault by default', () => {
  expect(observer.settingsAreDefault).toEqual(true);
});

it('should change settingsAreDefault to false once changing settings', () => {
  observer._onMessage({
    type: 'change-settings',
    payload: {}
  }, null, response => {
    expect(observer.settingsAreDefault).toEqual(false);
  });
});
