import expect from 'expect';

const packageJson = require('../../package');
const manifestJson = require('../../public/manifest');

it('package.json and manifest.json should have the same version number', () => {
  expect(packageJson.version !== undefined).toEqual(true);
  expect(manifestJson.version !== undefined).toEqual(true);
  expect(packageJson.version === manifestJson.version).toEqual(true);
});
