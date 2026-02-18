let lastUrl = location.href;

function detectPaywall() {
  return document.body.innerText.includes("Member-only story");
}

function checkPage() {
  setTimeout(() => {
    if (detectPaywall()) {
      chrome.runtime.onMessage.addListener((message, sender) => {
        if (message.type === "OPEN_FREEDIUM") {
          chrome.storage.sync.get(
            {
              enableExtension: true,
              sameTab: false,
              redirectUrl: "https://freedium-mirror.cfd/",
            },
            (settings) => {
              if (!settings.enableExtension) return;

              const tabId = message.tabId || sender.tab?.id;
              if (!tabId) return;

              chrome.tabs.get(tabId, (tab) => {
                const newUrl = settings.redirectUrl + tab.url;

                if (settings.sameTab) {
                  chrome.tabs.update(tabId, { url: newUrl });
                } else {
                  chrome.tabs.create({ url: newUrl });
                }
              });
            },
          );
        }
      });
    }
  }, 2000);
}

function observeNavigation() {
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      removePopup(false);
      checkPage();
    }
  }).observe(document, { subtree: true, childList: true });
}
