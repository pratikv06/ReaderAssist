const FREEDIUM_PREFIX = "https://freedium-mirror.cfd/";

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.url) return;

  if (!tab.url.startsWith(FREEDIUM_PREFIX)) {
    chrome.tabs.create({
      url: FREEDIUM_PREFIX + tab.url
    });
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-freedium") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;

      const tab = tabs[0];

      if (!tab.url.startsWith(FREEDIUM_PREFIX)) {
        chrome.tabs.create({
          url: FREEDIUM_PREFIX + tab.url
        });
      }
    });
  }
});

// Handle message from popup
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "OPEN_FREEDIUM" && sender.tab) {
    const currentUrl = sender.tab.url;

    if (!currentUrl.startsWith(FREEDIUM_PREFIX)) {
      chrome.tabs.create({
        url: FREEDIUM_PREFIX + currentUrl
      });
    }
  }
});
