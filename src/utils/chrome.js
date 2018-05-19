export function getActiveTabId() {
  return new Promise((resolve, reject) => {
    window.chrome.tabs.query({
      currentWindow: true,
      active: true
    }, tabs => {
      if (tabs && tabs.length > 0) {
        resolve(tabs[0].id);
      } else {
        reject('Could not get active tab ID.');
      }
    });
  });
}
