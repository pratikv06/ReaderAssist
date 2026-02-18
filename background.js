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
    // Respect the enableExtension setting: if disabled, do nothing
    chrome.storage.sync.get(
      {
        enableExtension: true,
        sameTab: false,
        redirectUrl: FREEDIUM_PREFIX
      },
      (settings) => {
        if (!settings.enableExtension) return;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs.length) return;

          const tab = tabs[0];
          const newUrl = settings.redirectUrl + tab.url;

          if (settings.sameTab) {
            chrome.tabs.update(tab.id, { url: newUrl });
          } else {
            if (!tab.url.startsWith(settings.redirectUrl)) {
              chrome.tabs.create({ url: newUrl });
            }
          }
        });
      }
    );
  }
});

// Handle message from popup
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "OPEN_FREEDIUM" && sender.tab) {
    chrome.storage.sync.get(
      {
        enableExtension: true,
        sameTab: false,
        redirectUrl: "https://freedium-mirror.cfd/"
      },
      (settings) => {
        if (!settings.enableExtension) return;

        const newUrl = settings.redirectUrl + sender.tab.url;

        if (settings.sameTab) {
          chrome.tabs.update(sender.tab.id, { url: newUrl });
        } else {
          chrome.tabs.create({ url: newUrl });
        }
      }
    );
  }
});

// Badge handling: show a red dot on the toolbar icon when the extension is "disabled" via settings
function updateActionBadgeForDisabledState(disabled) {
  if (disabled) {
    try {
      chrome.action.setBadgeText({ text: '●' });
      chrome.action.setBadgeBackgroundColor({ color: '#ff4d4f' });
    } catch (e) {
      // ignore in environments where action API is unavailable
    }
  } else {
    try {
      chrome.action.setBadgeText({ text: '' });
    } catch (e) {
      // ignore
    }
  }
}

// Initialize badge on startup
chrome.storage.sync.get({ enableExtension: true }, (items) => {
  updateActionBadgeForDisabledState(!items.enableExtension);
});

// Listen for changes to the enableExtension setting and update the badge
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enableExtension) {
    updateActionBadgeForDisabledState(!changes.enableExtension.newValue);
  }
});

