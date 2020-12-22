document.getElementById("toggleBtn").addEventListener("click", (e) => {
  chrome.runtime.sendMessage("toggleEnabled", (isEnabled) => {
    c_setEnabled(isEnabled);
  });
});

chrome.runtime.sendMessage("getEnabled", (isEnabled) => {
  c_setEnabled(isEnabled);
});

function c_setEnabled(isEnabled: boolean) {
  const el = document.getElementById("toggleBtn");
  if (isEnabled) {
    el.innerText = "Enabled";
  } else {
    el.innerText = "Disabled";
  }
  el.removeAttribute("disabled");
}
