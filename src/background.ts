let currentTabInfo: chrome.tabs.Tab;
let enabled: boolean = true;

chrome.storage.local.get("enabled", (val) => {
  if (val.enabled) {
    if (typeof val.enabled === "string") {
      switch (val.enabled.toLowerCase().trim()) {
        case "true":
        case "1":
        case "on":
        case "yes":
          enabled = true;
        default:
          enabled = false;
      }
    } else if (typeof val.enabled === "boolean") {
      enabled = val.enabled;
    }
  } else {
    chrome.storage.local.set({ enabled: true });
    enabled = true;
  }
});

chrome.tabs.onActivated.addListener((tab) => {
  if (enabled) {
    b_updateTabInfo(tab.tabId);
  }
});

chrome.tabs.onUpdated.addListener((tab) => {
  if (enabled) {
    b_updateTabInfo(tab);
  }
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
  switch (message) {
    case "toggleEnabled":
      response(b_setEnabled(!enabled));
      break;
    case "getEnabled":
      response(enabled);
      break;
    default:
      response(null);
      break;
  }
});

function b_setEnabled(isEnabled: boolean): boolean {
  enabled = isEnabled;
  return enabled;
}

function b_updateTabInfo(tabId: number): void {
  chrome.tabs.get(tabId, (tab) => {
    // if (currentTabInfo === undefined || tab.url !== currentTabInfo?.url) {
    if (/^https:\/\/www\.twitch/.test(tab.url)) {
      currentTabInfo = tab;
      // chrome.tabs.executeScript(null, { file: "./js/foreground.js" }, () =>
      //   console.log("Injected")
      // );
      const startIndex = tab.url.indexOf("twitch.tv/") + 10;
      const endIndex = tab.url.indexOf("/", startIndex);
      const channel: string = tab.url.substring(
        startIndex,
        endIndex === -1 ? undefined : endIndex
      );
      b_sendUpdatedTab(channel);
    }
    // }
  });
}

function b_sendUpdatedTab(channel: string): void {
  fetch("http://localhost:6748?channel=" + channel)
    .then((res) => res.json())
    .then((res) => {})
    .catch((res) => {
      console.log(res);
    });
}
