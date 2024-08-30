export const RESOLUTIONS = [
  "CLOSE_TAB",
  "SHOW_BLOCKED_INFO_PAGE",
] as const;

export const COUNTER_PERIODS = [
  "ALL_TIME",
  "THIS_MONTH",
  "THIS_WEEK",
  "TODAY",
] as const;

export const TIMERS = ["YES", "NO"] as const;

export const TIMER_MODES = [
  "RANGE",
  "DURATION"
] as const;

export const AMPM = [
  "AM",
  "PM"
] as const;

export type Resolution = typeof RESOLUTIONS[number];
export type CounterPeriod = typeof COUNTER_PERIODS[number];
export type TimerMode = typeof TIMER_MODES[number];
export type AmPm = typeof AMPM[number];

export interface Schema {
  enabled: boolean
  contextMenu: boolean
  blocked: string[]
  counter: Record<string, number[]>
  counterShow: boolean
  counterPeriod: CounterPeriod
  resolution: Resolution
  timer: boolean
  timerMode: TimerMode
  rangeStartTime: string
  rangeStartAMPM: AmPm
  rangeEndTime: string
  rangeEndAMPM: AmPm
  durationHours: number
  durationMinutes: number
  then: Date
}

export const DEFAULTS: Readonly<Schema> = {
  enabled: false,
  contextMenu: false,
  blocked: [],
  counter: {},
  counterShow: false,
  counterPeriod: "ALL_TIME",
  resolution: "CLOSE_TAB",
  timer: false,
  timerMode: "RANGE",
  rangeStartTime: "9:00",
  rangeStartAMPM: "AM",
  rangeEndTime: "5:00",
  rangeEndAMPM: "PM",
  durationHours: 0,
  durationMinutes: 0,
  then: new Date()
};

export const VALIDATORS: Readonly<Record<keyof Schema, (value: unknown) => boolean>> = {
  enabled: (value) => typeof value === "boolean",
  contextMenu: (value) => typeof value === "boolean",
  blocked: (value) => Array.isArray(value),
  counter: (value) => typeof value === "object",
  counterShow: (value) => typeof value === "boolean",
  counterPeriod: (value) => COUNTER_PERIODS.includes(value as CounterPeriod),
  resolution: (value) => RESOLUTIONS.includes(value as Resolution),
  timer: (value) => typeof value === "boolean",
  timerMode: (value) => TIMER_MODES.includes(value as TimerMode),
  rangeStartTime: (value) => typeof value === "string",
  rangeStartAMPM: (value) => AMPM.includes(value as AmPm),
  rangeEndTime: (value) => typeof value === "string",
  rangeEndAMPM: (value) => AMPM.includes(value as AmPm),
  durationHours: (value) => typeof value === "number",
  durationMinutes: (value) => typeof value === "number",
  then: (value) => value instanceof Date && !isNaN(value.getTime())
};

export const BLOCKED_EXAMPLE: string[] = [
  "example.com          # any page (same as example.com/*)",
  "example.com/         # main page only",
  "example.com/*        # any page",
  "",

  "!one.example.com     # ! = exclude",
  "*.example.com        # * = any zero or more characters",
  "",

  "example.com/???/     # ? = any one character",
  "example.com/app/*",
];

// export const START_EXAMPLE: string = "9:00";
// export const END_EXAMPLE: string = "5:00";
