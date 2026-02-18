let lastUrl = location.href;

function detectPaywall() {
  return document.body.innerText.includes("Member-only story");
}

function checkPage() {
  setTimeout(() => {
    if (detectPaywall()) {
      chrome.storage.sync.get({ enablePopup: true }, (settings) => {
        if (!settings.enablePopup) return;
        showPopup();
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
