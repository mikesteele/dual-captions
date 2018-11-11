class MutationRenderer extends Renderer {
  constructor() {
    super();
    this.isOn = false;
  }

  setup() {
    console.log('MutationRenderer - MutationRenderer setting up...');
    this.isOn = true;
  }

  shutdown() {
    console.log('MutationRenderer - MutationRenderer shutting down...');
    this.isOn = false;
  }

  onCaptionAdded() {
    if (this.isOn) {
      // TODO - basically all of observer._onMutation
    }
  }
}

window.DC.mutationRenderer = new MutationRenderer();
