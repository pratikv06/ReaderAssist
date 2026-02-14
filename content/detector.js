let lastUrl = location.href;

function detectPaywall() {
  return document.body.innerText.includes("Member-only story");
}

function checkPage() {
  setTimeout(() => {
    if (detectPaywall()) {
      showPopup();
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
