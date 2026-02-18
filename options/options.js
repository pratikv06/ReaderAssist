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

const confirmModal = document.getElementById("confirmModal");
const confirmResetBtn = document.getElementById("confirmReset");
const cancelResetBtn = document.getElementById("cancelReset");

const toastEl = document.getElementById("toast");

/* Load Settings */
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
    enablePopupEl.checked = items.enablePopup;
    enableRedirectEl.checked = items.enableRedirect;
    redirectUrlEl.value = items.redirectUrl;
  });
}

/* Save Settings */
function saveSettings() {
  chrome.storage.sync.set({
    enablePopup: enablePopupEl.checked,
    enableRedirect: enableRedirectEl.checked,
    redirectUrl: redirectUrlEl.value
  }, () => {
    showToast("Settings saved");
  });
}

/* Reset Settings */
function resetSettings() {
  chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
    enablePopupEl.checked = DEFAULT_SETTINGS.enablePopup;
    enableRedirectEl.checked = DEFAULT_SETTINGS.enableRedirect;
    redirectUrlEl.value = DEFAULT_SETTINGS.redirectUrl;

    showToast("Settings reset to default");
  });
}

/* Toast */
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.classList.add("show");

  setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => {
      toastEl.classList.add("hidden");
    }, 300);
  }, 2000);
}

/* Modal Controls */
function openModal() {
  confirmModal.classList.remove("hidden");
}

function closeModal() {
  confirmModal.classList.add("hidden");
}

/* Event Listeners */
saveBtn.addEventListener("click", saveSettings);

resetBtn.addEventListener("click", openModal);

confirmResetBtn.addEventListener("click", () => {
  resetSettings();
  closeModal();
});

cancelResetBtn.addEventListener("click", closeModal);

loadSettings();
