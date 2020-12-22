let currentTabInfo: chrome.tabs.Tab;

chrome.tabs.onActivated.addListener((tab) => {
  updateTabInfo(tab.tabId);
});

chrome.tabs.onUpdated.addListener((tab) => {
  updateTabInfo(tab);
});

function updateTabInfo(tabId: number): void {
  chrome.tabs.get(tabId, (tab) => {
    if (currentTabInfo === undefined || tab.url !== currentTabInfo?.url) {
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
        sendUpdatedTab(channel);
      }
    }
  });
}

function sendUpdatedTab(channel: string): void {
  console.log(channel);
}
