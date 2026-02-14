let popupElement = null;
let autoCloseTimer = null;

function showPopup() {
  if (popupElement) return;

  popupElement = document.createElement("div");
  popupElement.id = "freedium-popup";

  popupElement.innerHTML = `
    <button id="popup-close" class="close-btn">×</button>
    <div class="popup-text">
      🔒 Paywall detected on this page
    </div>
    <button id="popup-open" class="open-btn">
      Open
    </button>
  `;

  document.body.appendChild(popupElement);

  requestAnimationFrame(() => {
    popupElement.classList.add("visible");
  });

  const openBtn = document.getElementById("popup-open");
  const closeBtn = document.getElementById("popup-close");

  openBtn.onclick = () => {
    openBtn.disabled = true;
    openBtn.innerText = "Opening...";
    chrome.runtime.sendMessage({ type: "OPEN_FREEDIUM" });
    setTimeout(removePopup, 500);
  };

  closeBtn.onclick = removePopup;

  autoCloseTimer = setTimeout(removePopup, 10000);
}

function removePopup(animated = true) {
  if (!popupElement) return;

  if (animated) {
    popupElement.classList.remove("visible");
    setTimeout(() => {
      popupElement?.remove();
      popupElement = null;
    }, 300);
  } else {
    popupElement.remove();
    popupElement = null;
  }

  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}
