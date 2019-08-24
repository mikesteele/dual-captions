const EdxAdapter = () => {
  let canRenderInCaptionWindow = false;
  let captionWindow = document.querySelector(".closed-captions.is-visible");
  let video = document.querySelector('video');

  return {
    canRenderInCaptionWindow,
    captionWindow,
    video,
    providerInDebugMode: true // TODO - Remove
  }
}

export default EdxAdapter;
