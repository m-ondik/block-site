export const checkTimeRange = (startTime:number, startAMPM: string, endTime: number, endAMPM: string): boolean => { //(timeCheck: String): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startTimeAMPM = startAMPM === "PM" ? startTime+760 : startTime;
    const endTimeAMPM = endAMPM === "PM" ? endTime+760 : endTime;

    return currentMinutes >= startTimeAMPM && currentMinutes < endTimeAMPM;
} 

export const checkTimeDuration = (hours: number, minutes: number, then: Date): boolean => { //(timeCheck: String): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const thenMinutes = then.getHours()*60+ then.getMinutes();
    const blockedMinutes = hours*60+minutes*60;

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

// function convertMinutesToTime(minutes: number): string {
// // Calculate hours and remaining minutes
// const hours = Math.floor(minutes / 60);
// const remainingMinutes = minutes % 60;

// // Format hours and minutes as strings with leading zeros if necessary
// const hoursStr = hours.toString();
// const minutesStr = remainingMinutes.toString().padStart(2, '0');

// // Return the time string in "H:MM" format
// return `${hoursStr}:${minutesStr}`;
// }

