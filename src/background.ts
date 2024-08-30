import initStorage from "./storage/init";
import storage from "./storage";
import recreateContextMenu from "./helpers/recreate-context-menu";
import blockSite from "./helpers/block-site";
import {checkTimeRange} from "./helpers/check-time";
// import {checkTimeDuration} from "./helpers/check-time";

let __enabled: boolean;
let __contextMenu: boolean;
let __blocked: string[];
let __then: Date = new Date();
let __withinTimeRange = false; //added
let __withinTimeDuration = false;

initStorage().then(() => {
  storage.get(["enabled", "contextMenu", "blocked"]).then(({ enabled, contextMenu, blocked }) => {
    __enabled = enabled;
    __contextMenu = contextMenu;
    __blocked = blocked;

    recreateContextMenu(__enabled && __contextMenu);
  });

  chrome.storage.local.get('myTimeKey', (result) => {
    if (result.myTimeKey === undefined) {
      chrome.storage.local.set({ myTimeKey: false });
    }
  });

  function updateWithinTime() {
    __withinTimeRange = checkTimeRange(9, 0, 11, 48);
    console.log("__withinTimeRange updated:", __withinTimeRange);
    // Perform any additional actions based on the value of __withinTimeRange
  }

  updateWithinTime();
  setInterval(updateWithinTime, 60000);

  chrome.storage.local.onChanged.addListener((changes) => { //This is where we add the time settings inputs from user.
    if (changes.myTimeKey) {
      updateWithinTime();
    }

    if (changes["enabled"]) {
      __enabled = changes["enabled"].newValue as boolean;
    }

    if (changes["contextMenu"]) {
      __contextMenu = changes["contextMenu"].newValue as boolean;
    }

    if (changes["enabled"] || changes["contextMenu"]) {
      recreateContextMenu(__enabled && __contextMenu);
    }

    if (changes["blocked"]) {
      __blocked = changes["blocked"].newValue as string[];
    }
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  console.log(__withinTimeRange)
  if (!__enabled || !__blocked.length || !__withinTimeRange) {
    return;
  }

  const { tabId, url, frameId } = details;
  if (!url || !url.startsWith("http") || frameId !== 0) {
    return;
  }

  blockSite({ blocked: __blocked, tabId, url });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  console.log(__withinTimeRange)
  if (!tabId || !__enabled || !__blocked.length || !__withinTimeRange) {
    return;
  }

  const { url } = changeInfo;
  if (!url || !url.startsWith("http")) {
    return;
  }

  blockSite({ blocked: __blocked, tabId, url });
});
