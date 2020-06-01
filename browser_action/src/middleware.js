export const loggingMiddleware = store => next => action => {
  let result = next(action);
  console.log(`Middleware: ---`);
  console.log('Middleware: STORE: ', store.getState());
  console.log('Middleware: ACTION: ', action);
  console.log(`Middleware: ---`);
  return result;
}

export const storageMiddleware = store => next => action => {
  let result = next(action);
  console.debug('Middleware: Writing store to chrome.storage.');
  if (window.chrome && window.chrome.storage) {
    const currentState = store.getState();
    window.chrome.storage.local.set({
      '__DC_store__': JSON.stringify(currentState)
    });
  }
  return result;
}
