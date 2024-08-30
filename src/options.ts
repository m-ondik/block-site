import storage, {
  Schema, Resolution, CounterPeriod, Timer, AmPm, RESOLUTIONS, BLOCKED_EXAMPLE, 
  // START_EXAMPLE,
  // END_EXAMPLE,
} from "./storage";

const UI = (() => {
  const elements = {
    enabled: document.getElementById("enabled") as HTMLSelectElement,
    contextMenu: document.getElementById("context-menu") as HTMLSelectElement,
    blockedList: document.getElementById("blocked-list") as HTMLTextAreaElement,
    resolution: document.getElementById("resolution") as HTMLSelectElement,
    counterShow: document.getElementById("counter-show") as HTMLSelectElement,
    counterPeriod: document.getElementById("counter-period") as HTMLSelectElement,
    timer: document.getElementById("timer") as HTMLSelectElement,
    rangeStartTime: document.getElementById("start-time") as HTMLTextAreaElement,
    rangeStartAMPM: document.getElementById("start-am-pm") as HTMLSelectElement,
    rangeEndTime: document.getElementById("end-time") as HTMLTextAreaElement,
    rangeEndAMPM: document.getElementById("end-am-pm") as HTMLSelectElement,
    durationHours: document.getElementById("hours") as HTMLTextAreaElement,
    durationMinutes: document.getElementById("minutes") as HTMLTextAreaElement,
  };

  // elements.rangeStartTime.placeholder = START_EXAMPLE;
  // elements.rangeEndTime.placeholder = END_EXAMPLE;
  elements.blockedList.placeholder = BLOCKED_EXAMPLE.join("\n");

  const booleanToString = (b: boolean) => b ? "YES" : "NO";
  const stringToBoolean = (s: string) => s === "YES";

  const getEventTargetValue = (event: Event) => (event.target as HTMLTextAreaElement | HTMLSelectElement).value;
  const stringToBlocked = (string: string) => string.split("\n").map((s) => s.trim()).filter(Boolean);

  elements.enabled.addEventListener("change", (event) => {
    const enabled = stringToBoolean(getEventTargetValue(event));
    storage.set({ enabled });
  });

  elements.contextMenu.addEventListener("change", (event) => {
    const contextMenu = stringToBoolean(getEventTargetValue(event));
    storage.set({ contextMenu });
  });

  elements.blockedList.addEventListener("input", (event) => {
    const blocked = stringToBlocked(getEventTargetValue(event));
    storage.set({ blocked });
  });

  elements.resolution.addEventListener("change", (event) => {
    const resolution = getEventTargetValue(event) as Resolution;
    storage.set({ resolution });
  });

  elements.counterShow.addEventListener("change", (event) => {
    const counterShow = stringToBoolean(getEventTargetValue(event));
    storage.set({ counterShow });
  });

  elements.counterPeriod.addEventListener("change", (event) => {
    const counterPeriod = getEventTargetValue(event) as CounterPeriod;
    storage.set({ counterPeriod });
  });

  elements.timer.addEventListener("change", (event) => {
    const selectedValue = getEventTargetValue(event) as Timer;
    document.body.classList.remove("timer-RANGE", "timer-DURATION");
    
    if (selectedValue === "RANGE") {
      document.body.classList.add("timer-RANGE");
    } else if (selectedValue === "DURATION") {
      document.body.classList.add("timer-DURATION");
    }
    const date = new Date();
    
    // Save the selected value in storage if needed
    storage.set({ then: date });
    storage.set({ timer: selectedValue });
  });

  elements.rangeStartTime.addEventListener("input", (event) => {
    const rangeStartTime = getEventTargetValue(event);
    storage.set({ rangeStartTime });
  });

  elements.rangeStartAMPM.addEventListener("change", (event) => {
    const rangeStartAMPM = getEventTargetValue(event) as AmPm;
    storage.set({ rangeStartAMPM });
  });

  elements.rangeEndTime.addEventListener("input", (event) => {
    const rangeEndTime = getEventTargetValue(event);
    storage.set({ rangeEndTime });
  });

  elements.rangeEndAMPM.addEventListener("change", (event) => {
    const rangeEndAMPM = getEventTargetValue(event) as AmPm;
    storage.set({ rangeEndAMPM });
  });

  elements.durationHours.addEventListener("input", (event) => {
    const durationHours = Number(getEventTargetValue(event));
    storage.set({ durationHours });
  });

  elements.durationMinutes.addEventListener("input", (event) => {
    const durationMinutes = Number(getEventTargetValue(event));
    storage.set({ durationMinutes });
  });


  const init = <T extends Partial<Schema>>(items: T) => {
    if (items.enabled !== undefined) {
      elements.enabled.value = booleanToString(items.enabled);
    }

    if (items.contextMenu !== undefined) {
      elements.contextMenu.value = booleanToString(items.contextMenu);
    }

    if (items.blocked !== undefined) {
      const valueAsBlocked = stringToBlocked(elements.blockedList.value);
      if (JSON.stringify(valueAsBlocked) !== JSON.stringify(items.blocked)) {
        elements.blockedList.value = items.blocked.join("\r\n");
      }
    }

    if (items.resolution !== undefined) {
      elements.resolution.value = items.resolution;
      RESOLUTIONS.forEach((oneResolution) => {
        document.body.classList.remove(`resolution-${oneResolution}`);
      });
      document.body.classList.add(`resolution-${items.resolution}`);
    }

    if (items.counterShow !== undefined) {
      elements.counterShow.value = booleanToString(items.counterShow);
      document.body.classList.toggle("counter-show", items.counterShow);
    }

    if (items.counterPeriod !== undefined) {
      elements.counterPeriod.value = items.counterPeriod;
    }

    if (items.timer !== undefined) {
      elements.timer.value = items.timer;
    }

    if (items.rangeStartTime !== undefined) {
      elements.rangeStartTime.value = items.rangeStartTime;
    }

    if (items.rangeStartAMPM !== undefined) {
      elements.rangeStartAMPM.value = items.rangeStartAMPM;
    }

    if (items.rangeEndTime !== undefined) {
      elements.rangeEndTime.value = items.rangeEndTime;
    }

    if (items.rangeEndAMPM !== undefined) {
      elements.rangeEndAMPM.value = items.rangeEndAMPM;
    }

    if (items.durationHours !== undefined) {
      elements.durationHours.value = items.durationHours.toString();
    }

    if (items.durationMinutes !== undefined) {
      elements.durationMinutes.value = items.durationMinutes.toString();
    }
  };

  return { elements, init };
})();

window.addEventListener("DOMContentLoaded", () => {
  const keys: (keyof Schema)[] = [
    "enabled",
    "contextMenu",
    "blocked",
    "resolution",
    "counterShow",
    "counterPeriod"
    // ,
    // "timer",
    // "rangeStartTime",
    // "rangeStartAMPM",
    // "rangeEndTime",
    // "rangeEndAMPM",
    // "durationHours",
    // "durationMinutes"
  ];

  storage.get(keys).then((local) => {
    UI.init(local);
    document.body.classList.add("ready");
  });

  chrome.storage.local.onChanged.addListener((changes) => {
    keys.forEach((key) => {
      if (changes[key]) {
        UI.init({ [key]: changes[key].newValue });
      }
    });
  });
});
