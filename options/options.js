const DEFAULT_SETTINGS = {
  enablePopup: true,
  enableRedirect: true,
  redirectUrl: "https://freedium-mirror.cfd/"
};

const enablePopupEl = document.getElementById("enablePopup");
const enableRedirectEl = document.getElementById("enableRedirect");
const redirectUrlEl = document.getElementById("redirectUrl");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");

// Load settings
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
    enablePopupEl.checked = items.enablePopup;
    enableRedirectEl.checked = items.enableRedirect;
    redirectUrlEl.value = items.redirectUrl;
  });
}

// Save settings
function saveSettings() {
  chrome.storage.sync.set(
    {
      enablePopup: enablePopupEl.checked,
      enableRedirect: enableRedirectEl.checked,
      redirectUrl: redirectUrlEl.value
    },
    () => {
      showStatus("Settings saved.");
    }
  );
}

// Reset to default
function resetSettings() {
  chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
    enablePopupEl.checked = DEFAULT_SETTINGS.enablePopup;
    enableRedirectEl.checked = DEFAULT_SETTINGS.enableRedirect;
    redirectUrlEl.value = DEFAULT_SETTINGS.redirectUrl;

    showStatus("Settings reset to default.");
  });
}

function showStatus(message) {
  statusEl.textContent = message;
  setTimeout(() => {
    statusEl.textContent = "";
  }, 2000);
}

saveBtn.addEventListener("click", saveSettings);
resetBtn.addEventListener("click", resetSettings);

loadSettings();
