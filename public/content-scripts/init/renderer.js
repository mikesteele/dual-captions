class Renderer {
  setup() {
    throw new Error('Renderer - setup() must be defined.');
  }

  shutdown() {
    throw new Error('Renderer - shutdown() must be defined.');
  }
}

window.Renderer = Renderer;
window.DC.renderer = new Renderer();
