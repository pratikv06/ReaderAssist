const DEFAULTS = {
    enableExtension: true,
    autoRun: true,
    hidePopup: false,
    sameTab: false
};

const openNowBtn = document.getElementById("openNow");
const enableExtension = document.getElementById("enableExtension");
const autoRun = document.getElementById("autoRun");
const hidePopup = document.getElementById("hidePopup");
const sameTab = document.getElementById("sameTab");
const openSettingsBtn = document.getElementById("openSettings");
const disabledBadge = document.getElementById("disabledBadge");
const shortcutDisplay = document.getElementById("shortcutDisplay");

// Load settings
chrome.storage.sync.get(DEFAULTS, (settings) => {
    enableExtension.checked = settings.enableExtension;
    autoRun.checked = settings.autoRun;
    hidePopup.checked = settings.hidePopup;
    sameTab.checked = settings.sameTab;
    updateUI();
});

// Save settings
function saveSettings() {
    chrome.storage.sync.set({
        enableExtension: enableExtension.checked,
        autoRun: autoRun.checked,
        hidePopup: hidePopup.checked,
        sameTab: sameTab.checked
    });
}

enableExtension.addEventListener("change", saveSettings);
autoRun.addEventListener("change", saveSettings);
hidePopup.addEventListener("change", saveSettings);
sameTab.addEventListener("change", saveSettings);

enableExtension.addEventListener("change", () => {
    saveSettings();
    updateUI();
});

// Primary Action
openNowBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) return;

        if (!enableExtension.checked) return;

        chrome.runtime.sendMessage({
            type: "OPEN_FREEDIUM",
            tabId: tabs[0].id
        });
    });
});

// Advanced settings
openSettingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
});

// Update popup UI based on extension enabled state and show shortcut
function updateUI() {
    const disabled = !enableExtension.checked;
    openNowBtn.disabled = disabled;
    if (disabled) {
        openNowBtn.classList.add('disabled');
        disabledBadge.classList.add('visible');
    } else {
        openNowBtn.classList.remove('disabled');
        disabledBadge.classList.remove('visible');
    }

    // Get keyboard shortcut from chrome.commands
    if (chrome.commands && chrome.commands.getAll) {
        chrome.commands.getAll((commands) => {
            const cmd = commands.find(c => c.name === 'open-freedium');
            const shortcut = (cmd && (cmd.shortcut || cmd.shortcuts || cmd.accelerator)) || '';
            if (shortcut) shortcutDisplay.textContent = shortcut;
            else shortcutDisplay.textContent = '';
        });
    }
}
