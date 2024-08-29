export default (): boolean => { //(timeCheck: String): boolean => {
    const d: Date = new Date(); // current time
    const hours: number = d.getHours();
    const mins: number = d.getMinutes();
    const day: number = d.getDay();

    return day >= 1
        && day <= 5
        && hours >= 9 
        && (hours < 15 || (hours === 15 && mins <= 56));
}  

// export con ({ url, rule, countParams: cp }: GetBlockedUrlParams): string =>
//     `<span id="url">${url}</span> <b>was blocked</b> by <span id="rule">${rule}</span>`
//     + (cp ? ` (${cp.count}x ${periodStrings[cp.period]})` : "");

// export const counterPeriodToTimeStamp = (counterPeriod: CounterPeriod, now: number): number => {
//     switch (counterPeriod) {
//     case "ALL_TIME":
//       return 0;
//     case "THIS_MONTH":
//       return +dayjs(now).startOf("month");
//     case "THIS_WEEK":
//       return +dayjs(now).startOf("week");
//     case "TODAY":
//       return +dayjs(now).startOf("day");
//     }
//   };