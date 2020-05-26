const backgroundPagePackage = require('../background_page/package');
const browserActionPackage = require('../browser_action/package');
const contentScriptPackage = require('../content_script/package');
const manifestPackage = require('../manifest/package');
const siteIntegrationPackage = require('./package');
const { expect } = require('chai');
const _uniq = require('lodash/uniq');

describe('Repo tests', () => {
  it('should have all packages have the same version', () => {
    const allVersions = [
      browserActionPackage.version,
      backgroundPagePackage.version,
      contentScriptPackage.version,
      manifestPackage.version,
      siteIntegrationPackage.version
    ];
    expect(_uniq(allVersions).length).to.equal(1);
  });
});
