let lastUrl = location.href;

function detectPaywall() {
  return document.body.innerText.includes("Member-only story");
}

function handleDetection() {
  // Load current settings to decide whether to auto-run or show popup
  chrome.storage.sync.get(
    {
      enableExtension: true,
      autoRun: true,
      hidePopup: false,
      sameTab: false,
      redirectUrl: "https://freedium-mirror.cfd/",
    },
    (settings) => {
      if (!settings.enableExtension) return;

      if (settings.autoRun) {
        // Ask background to open freedium for this tab
        chrome.runtime.sendMessage({ type: "OPEN_FREEDIUM" });
      } else if (!settings.hidePopup) {
        // show in-page popup
        try {
          showPopup();
        } catch (e) {
          // fail silently if UI not available
        }
      }
    }
  );
}

function checkPage() {
  setTimeout(() => {
    if (detectPaywall()) {
      handleDetection();
    }
  }, 2000);
}

// react to storage changes (e.g., hidePopup toggled or autoRun enabled)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;

  if (changes.hidePopup && changes.hidePopup.newValue) {
    // if hidePopup turned on, remove any visible popup
    try { removePopup(); } catch (e) {}
  }

  if (changes.autoRun && changes.autoRun.newValue) {
    // if autoRun was enabled, and page currently has paywall, trigger it
    if (detectPaywall()) {
      handleDetection();
    }
  }
});

function observeNavigation() {
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      try { removePopup(false); } catch (e) {}
      checkPage();
    }
  }).observe(document, { subtree: true, childList: true });
}
