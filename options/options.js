const enablePopupEl = document.getElementById("enablePopup");
const enableRedirectEl = document.getElementById("enableRedirect");
const redirectUrlEl = document.getElementById("redirectUrl");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");

// Load existing settings
chrome.storage.sync.get(
    {
        enablePopup: true,
        enableRedirect: true,
        redirectUrl: "https://freedium-mirror.cfd/"
    },
    (items) => {
        enablePopupEl.checked = items.enablePopup;
        enableRedirectEl.checked = items.enableRedirect;
        redirectUrlEl.value = items.redirectUrl;
    }
);

// Save settings
saveBtn.addEventListener("click", () => {
    chrome.storage.sync.set(
        {
            enablePopup: enablePopupEl.checked,
            enableRedirect: enableRedirectEl.checked,
            redirectUrl: redirectUrlEl.value
        },
        () => {
            statusEl.textContent = "Settings saved.";
            setTimeout(() => (statusEl.textContent = ""), 2000);
        }
    );
});
