const DevelopmentAdapterCreator = () => {
  const playerControls = document.querySelector('#player-controls');
  const loadingTutorialSteps = [{
    node: document.getElementById('cc-button'),
    placement: 'top',
    isVisible: true,
    label: 'Step 1'
  }];
  return {
    playerControls,
    loadingTutorialSteps
  }
}

export { DevelopmentAdapterCreator };
