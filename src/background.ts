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
let __initialized = false;  // Flag to indicate readiness

function updateWithinTime() {
  __withinTimeRange = checkTimeRange(__rangeStartTime, __rangeStartAMPM, __rangeEndTime, __rangeEndAMPM);
  console.log("__withinTimeRange updated:", __withinTimeRange);
  // Perform any additional actions based on the value of __withinTimeRange
}

function updateWithinDuration() {
  __withinTimeDuration = checkTimeDuration(__durationHours, __durationMinutes, __then);
  console.log("__withinTimeDuration updated:", __withinTimeDuration);
  // Perform any additional actions based on the value of __withinTimeRange
}

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

    updateWithinTime();
    updateWithinDuration();
    recreateContextMenu(__enabled && __contextMenu);

    __initialized = true; 
  });

  chrome.storage.local.get('myTimeKey', (result) => {
    if (result.myTimeKey === undefined) {
      chrome.storage.local.set({ myTimeKey: false });
    }
  });

  browser.alarms.create('checkTimers', { periodInMinutes: 1 });

  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkTimers') {
      if (__initialized){
        updateWithinTime();
        updateWithinDuration();
      }
    }
  });

  chrome.storage.local.onChanged.addListener((changes) => {
    const timeRelatedChanges = [
      "timer", "timerMode", "rangeStartTime", "rangeStartAMPM", 
      "rangeEndTime", "rangeEndAMPM", "durationHours", "durationMinutes"
    ];

    if (timeRelatedChanges.some((key) => changes[key])) {
      updateWithinTime();
      updateWithinDuration();
    }

    if (changes["enabled"]) {
      __enabled = changes["enabled"].newValue as boolean;
      __then = new Date();
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
      updateWithinTime();
      updateWithinDuration();
    }

    if (changes["timerMode"]) {
      __timerMode = changes["timerMode"].newValue as string;
      updateWithinTime();
      updateWithinDuration();
    }

    if (changes["rangeStartTime"]) {
      __rangeStartTime = changes["rangeStartTime"].newValue as number;
      updateWithinTime();
    }

    if (changes["rangeStartAMPM"]) {
      __rangeStartAMPM = changes["rangeStartAMPM"].newValue as string;
      updateWithinTime();
    }

    if (changes["rangeEndTime"]) {
      __rangeEndTime = changes["rangeEndTime"].newValue as number;
      updateWithinTime();
    }

    if (changes["rangeEndAMPM"]) {
      __rangeEndAMPM = changes["rangeEndAMPM"].newValue as string;
      updateWithinTime();
    }

    if (changes["durationHours"]) {
      __durationHours = changes["durationHours"].newValue as number;
      updateWithinDuration();
      __then = new Date();
    }

    if (changes["durationMinutes"]) {
      __durationMinutes = changes["durationMinutes"].newValue as number;
      updateWithinDuration();
      __then = new Date();
    }
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

function handleBlocking(details: any) {
  if (!__initialized) {
    console.log("Not initialized yet, skipping blocking.");
    return;
  }

  if (!__enabled || !__blocked.length) {
    console.log("Blocking skipped: Disabled or no sites blocked.");
    return;
  }

  const { tabId, url, frameId } = details;
  if (!url || !url.startsWith("http") || frameId !== 0) {
    console.log("Blocking skipped: Invalid URL or frame.");
    return;
  }

  if (__timer) {
    updateWithinTime();
    updateWithinDuration();
    if (
      (__timerMode === "RANGE" && __withinTimeRange) ||
      (__timerMode === "DURATION" && __withinTimeDuration)
    ) {
      console.log("Blocking site:", url);
      blockSite({ blocked: __blocked, tabId, url });
    } else {
      console.log("Blocking skipped: Outside timer range or duration.");
    }
  } else {
    console.log("Blocking site (no timer):", url);
    blockSite({ blocked: __blocked, tabId, url });
  }
}


chrome.webNavigation.onBeforeNavigate.addListener(handleBlocking); 
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    handleBlocking({ tabId, url: changeInfo.url, frameId: 0 });
  }
});