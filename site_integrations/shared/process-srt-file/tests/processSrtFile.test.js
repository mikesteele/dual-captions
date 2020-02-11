const fs = require('fs');
const { expect } = require('chai');
const path = require('path');
const processSrtFile = require('../index');
const iconv = require('iconv-lite');

describe('processSrtFile', () => {
  it('should work for French', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/windows-1252.srt'));
    processSrtFile(captionFile).then(result => {
      expect(result.includes('Neuf ans plus tôt')).to.be.true;
      done();
    });
  });
  it('should work for Chinese', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/UTF-16.srt'));
    processSrtFile(captionFile).then(result => {
      expect(result.includes('那是很久以前的事了')).to.be.true;
      done();
    });
  });
  it('should work for a regular UTF-8 file', done => {
    const captionFile = fs.readFileSync(path.resolve(__dirname, './assets/BasicUTF8File.srt'));
    processSrtFile(captionFile).then(result => {
      expect(result.includes('Very good, Lieutenant.')).to.be.true;
      done();
    });
  });
});
