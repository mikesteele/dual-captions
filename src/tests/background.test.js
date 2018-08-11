import './chrome-mock';
import '../../public/background';

const background = window.DC_BackgroundPage;

// Default Jest JSDOM has no URLSearchParams support lol
require('url-polyfill');

it('should add new URL to captionRequestUrls', () => {
  const requestUrl = 'https://www.youtube.com/api/timedtext?signature=5E04EAE7C40119386DC85E49AB76E5E8EB917BC2.02D3F51A9098349155BADC241F47C9D52796DDCE&hl=fr_FR&asr_langs=ja%2Cko%2Cru%2Cen%2Cpt%2Cde%2Cfr%2Cnl%2Ces%2Cit&expire=1533629865&v=WBqnzn77MEE&caps=asr&key=yttt1&xorp=True&sparams=asr_langs%2Ccaps%2Cv%2Cxorp%2Cexpire&lang=es&fmt=srv3';
  background._onBeforeYouTubeCaptionRequest({
    url: requestUrl
  });
  expect(background.captionRequestUrls.youtube.WBqnzn77MEE).toEqual(requestUrl);
});

it('should respond correctly to fetcher', done => {
  background._onMessage({
    type: 'get-caption-request-urls'
  }, null, response => {
    expect(response).toEqual({
      ok: true,
      captionRequestUrls: background.captionRequestUrls
    });
    done();
  });
})
