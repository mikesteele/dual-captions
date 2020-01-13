const AmazonAdapter = () => {
  const playerControls = document.querySelector('.bottomPanel');
  const captionWindow = document.querySelector('.persistentPanel span');
  const fullscreenRoot = document.querySelector('.cascadesContainer');

  return {
    providerInDebugMode: true,
    captionWindow,
    fullscreenRoot,
    playerControls
  };
};

module.exports = AmazonAdapter;
