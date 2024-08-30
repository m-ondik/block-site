import initStorage from "./storage/init";
import storage from "./storage";
import recreateContextMenu from "./helpers/recreate-context-menu";
import blockSite from "./helpers/block-site";
import {checkTimeRange} from "./helpers/check-time";
import {checkTimeDuration} from "./helpers/check-time";
import {convertTimeToMinutes} from "./helpers/check-time";

let __enabled: boolean;
let __contextMenu: boolean;
let __blocked: string[];
let __then: Date;
let __timer: boolean;
let __timerMode: string;
let __rangeStartTime: number;
let __rangeStartAMPM: string;
let __rangeEndTime: number;
let __rangeEndAMPM: string;
let __durationHours: number;
let __durationMinutes: number;
let __withinTimeRange = false; //added
let __withinTimeDuration = false;

initStorage().then(() => {
  storage.get(["enabled", "contextMenu", "blocked", "then", "timer", "timerMode", "rangeStartTime", "rangeStartAMPM", "rangeEndTime", "rangeEndAMPM", "durationHours", "durationMinutes"]).then(({ enabled, contextMenu, blocked, then, timer, timerMode, rangeStartTime, rangeStartAMPM, rangeEndTime, rangeEndAMPM, durationHours, durationMinutes }) => {
    __enabled = enabled;
    __contextMenu = contextMenu;
    __blocked = blocked;
    __timer = timer;
    __timerMode = timerMode;
    __then = then;
    __rangeStartTime = convertTimeToMinutes(rangeStartTime);
    __rangeStartAMPM = rangeStartAMPM;
    __rangeEndTime = convertTimeToMinutes(rangeEndTime);
    __rangeEndAMPM = rangeEndAMPM;
    __durationHours = durationHours;
    __durationMinutes = durationMinutes;

    recreateContextMenu(__enabled && __contextMenu);
  });

  chrome.storage.local.get('myTimeKey', (result) => {
    if (result.myTimeKey === undefined) {
      chrome.storage.local.set({ myTimeKey: false });
    }
  });

  function updateWithinTime() {
    __withinTimeRange = checkTimeRange(__rangeStartTime, __rangeStartAMPM, __rangeEndTime, __rangeEndAMPM);
    console.log("__withinTimeRange updated:", __withinTimeRange);
    // Perform any additional actions based on the value of __withinTimeRange
  }

  updateWithinTime();
  setInterval(updateWithinTime, 60000);

  function updateWithinDuration() {
    __withinTimeDuration = checkTimeDuration(__durationHours, __durationMinutes, __then);
    console.log("__withinTimeDuration updated:", __withinTimeDuration);
    // Perform any additional actions based on the value of __withinTimeRange
  }

  updateWithinDuration();
  setInterval(updateWithinDuration, 60000);

  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.myTimeKey) {
      updateWithinTime();
      updateWithinDuration();
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

    if (changes["timer"]) {
      __timer = changes["timer"].newValue as boolean;
    }

    if (changes["then"]) {
      __then = changes["then"].newValue as Date;
    }

    if (changes["rangeStartTime"]) {
      __rangeStartTime = changes["rangeStartTime"].newValue as number;
    }

    if (changes["rangeStartAMPM"]) {
      __rangeStartAMPM = changes["rangeStartAMPM"].newValue as string;
    }

    if (changes["rangeEndTime"]) {
      __rangeEndTime = changes["rangeEndTime"].newValue as number;
    }

    if (changes["rangeEndAMPM"]) {
      __rangeEndAMPM = changes["rangeEndAMPM"].newValue as string;
    }

    if (changes["durationHours"]) {
      __durationHours = changes["durationHours"].newValue as number;
    }

    if (changes["durationMinutes"]) {
      __durationMinutes = changes["durationMinutes"].newValue as number;
    }
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  console.log(__withinTimeRange)
  if (!__enabled || !__blocked.length) {
    console.log("returned on 1; timer:", __enabled, __blocked.length);
    return;
  }

  const { tabId, url, frameId } = details;
  if (!url || !url.startsWith("http") || frameId !== 0) {
    console.log("returned on 2; timer:", __timerMode);
    return;
  }
  console.log("timer:", __timer);

  if (__timerMode === "RANGE") {
    if (__withinTimeRange){
      console.log("__withinTimeRange:", __withinTimeRange);
      blockSite({ blocked: __blocked, tabId, url });
    } else {
      console.log("return:", __withinTimeRange);
      return;
    }
  } else if (__timerMode === "DURATION") {
    if (__withinTimeDuration){
      console.log("__withinTimeDuration:", __withinTimeDuration);
      blockSite({ blocked: __blocked, tabId, url });
    } else {
      console.log("return:", __withinTimeDuration);
      return;
    }
  } else {
    console.log("block");
    blockSite({ blocked: __blocked, tabId, url });
  }
  

});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  console.log(__withinTimeRange)
  if (!tabId || !__enabled || !__blocked.length) {
    console.log("returned on 3; timer:", tabId, __enabled, __blocked.length);
    return;
  }

  const { url } = changeInfo;
  if (!url || !url.startsWith("http")) {
    console.log("returned on 4; timer:", __timerMode);
    return;
  }

  if (!__timer) {
    console.log("block");
    blockSite({ blocked: __blocked, tabId, url });
  } else  if (__timerMode === "RANGE") {
    if (__withinTimeRange){
      console.log("__withinTimeRange:", __withinTimeRange);
      blockSite({ blocked: __blocked, tabId, url });
    } else {
      console.log("return:", __withinTimeRange);
      return;
    }
  } else if (__timerMode === "DURATION") {
    if (__withinTimeDuration){
      console.log("__withinTimeDuration:", __withinTimeDuration);
      blockSite({ blocked: __blocked, tabId, url });
    } else {
      console.log("return:", __withinTimeDuration);
      return;
    }
  } else {
    return;
  }

});
