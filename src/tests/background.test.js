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

it(`should remove 'name' param from URL before adding to captionRequestUrls`, () => {
  const requestUrl = 'https://www.youtube.com/api/timedtext?signature=9529BB94F5A1D370D2FE6310B7B2D4A33B919CBD.B8A53E3782710830C6F5A4DD71F3DA3D2D8D0050&sparams=asr_langs%2Ccaps%2Cv%2Cxorp%2Cexpire&xorp=True&hl=en_US&caps=asr&asr_langs=pt%2Cnl%2Cen%2Cfr%2Cru%2Cit%2Cko%2Cde%2Ces%2Cja&v=JKHUaNAxsTg&key=yttt1&expire=1535682446&lang=de&name=Annotated%20by%20Kai%20Heimpel&fmt=srv3';
  background._onBeforeYouTubeCaptionRequest({
    url: requestUrl
  });
  expect(background.captionRequestUrls.youtube.JKHUaNAxsTg).toEqual('https://www.youtube.com/api/timedtext?signature=9529BB94F5A1D370D2FE6310B7B2D4A33B919CBD.B8A53E3782710830C6F5A4DD71F3DA3D2D8D0050&sparams=asr_langs%2Ccaps%2Cv%2Cxorp%2Cexpire&xorp=True&hl=en_US&caps=asr&asr_langs=pt%2Cnl%2Cen%2Cfr%2Cru%2Cit%2Cko%2Cde%2Ces%2Cja&v=JKHUaNAxsTg&key=yttt1&expire=1535682446&lang=de&fmt=srv3');
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
