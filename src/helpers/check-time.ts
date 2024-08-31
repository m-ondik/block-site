export const checkTimeRange = (startTime:number, startAMPM: string, endTime: number, endAMPM: string): boolean => { //(timeCheck: String): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startTimeAMPM = startAMPM === "PM" ? startTime+760 : startTime;
    const endTimeAMPM = endAMPM === "PM" ? endTime+760 : endTime;
    console.log("checkTimeRange called, currentMinutes, startTimeAMPM, endTimeAMPM:", currentMinutes, startTimeAMPM, endTimeAMPM);

    return currentMinutes >= startTimeAMPM && currentMinutes < endTimeAMPM;
} 

export const checkTimeDuration = (hours: number, minutes: number, then: Date): boolean => { //(timeCheck: String): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const thenMinutes = then.getHours()*60+ then.getMinutes();
    const blockedMinutes = hours*60+minutes;
    console.log("checkTimeDuration called, currentMinutes, thenMinutes, blockedMinutes:", currentMinutes, thenMinutes, blockedMinutes);

    return currentMinutes - thenMinutes < blockedMinutes
}

export const convertTimeToMinutes = (time: string): number => {
// Split the time string into hours and minutes parts
const [hoursStr, minutesStr] = time.split(":");

// Convert the parts to numbers
const hours = Number(hoursStr);
const minutes = Number(minutesStr);

// Calculate the total minutes
const totalMinutes = hours * 60 + minutes;

return totalMinutes;
}
