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

export const TIMERS = [
  "OFF",
  "RANGE",
  "DURATION"
] as const;

export const AMPM = [
  "AM",
  "PM"
] as const;

export type Resolution = typeof RESOLUTIONS[number];
export type CounterPeriod = typeof COUNTER_PERIODS[number];
export type Timer = typeof TIMERS[number];
export type AmPm = typeof AMPM[number];

export interface Schema {
  enabled: boolean
  contextMenu: boolean
  blocked: string[]
  counter: Record<string, number[]>
  counterShow: boolean
  counterPeriod: CounterPeriod
  resolution: Resolution
  timer: Timer
  rangeStartHour: number
  rangeStartMinute: number
  rangeStartAMPM: AmPm
  rangeEndHour: number
  rangeEndMinute: number
  rangeEndAMPM: AmPm
  durationHours: number
  durationMinutes: number
}

export const DEFAULTS: Readonly<Schema> = {
  enabled: false,
  contextMenu: false,
  blocked: [],
  counter: {},
  counterShow: false,
  counterPeriod: "ALL_TIME",
  resolution: "CLOSE_TAB",
  timer: "OFF",
  rangeStartHour: 9,
  rangeStartMinute: 0,
  rangeStartAMPM: "AM",
  rangeEndHour: 5,
  rangeEndMinute: 0,
  rangeEndAMPM: "PM",
  durationHours: 0,
  durationMinutes: 0
};

export const VALIDATORS: Readonly<Record<keyof Schema, (value: unknown) => boolean>> = {
  enabled: (value) => typeof value === "boolean",
  contextMenu: (value) => typeof value === "boolean",
  blocked: (value) => Array.isArray(value),
  counter: (value) => typeof value === "object",
  counterShow: (value) => typeof value === "boolean",
  counterPeriod: (value) => COUNTER_PERIODS.includes(value as CounterPeriod),
  resolution: (value) => RESOLUTIONS.includes(value as Resolution),
  timer: (value) => TIMERS.includes(value as Timer),
  rangeStartHour: (value) => typeof value === "number",
  rangeStartMinute: (value) => typeof value === "number",
  rangeStartAMPM: (value) => AMPM.includes(value as AmPm),
  rangeEndHour: (value) => typeof value === "number",
  rangeEndMinute: (value) => typeof value === "number",
  rangeEndAMPM: (value) => AMPM.includes(value as AmPm),
  durationHours: (value) => typeof value === "number",
  durationMinutes: (value) => typeof value === "number"
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

export const START_EXAMPLE: string = "9:30";
export const END_EXAMPLE: string = "5:30";
