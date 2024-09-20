/**
 * Get start and end dates for the specified day based on the current date and time.
 * @param {number} targetDay - The target day (0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday).
 * @returns {Object} An object containing startDate and endDate.
 */
export function getPreviousAndNextDates(targetDay:number) {
    const now = new Date(); // Current server date
    const currentDay = now.getUTCDay(); // Current day of the week
    let startDate, endDate;

    console.log("Current Date:", now.toISOString());
    console.log("Current Day:", currentDay);
    console.log("Target Day:", targetDay);

    // Check if today is the target day
    if (currentDay === targetDay) {
        console.log("Today is the target day.");

        // Check if the current time is after 6 PM
        if (now.getUTCHours() >= 18) {
            console.log("Current time is after 6 PM.");
            // Set start date to today at 18:00
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
            console.log("Start Date set to:", startDate.toISOString());

            // Set end date to next occurrence of the target day (next week)
            endDate = new Date(startDate);
            endDate.setUTCDate(endDate.getUTCDate() + 7);
            endDate.setUTCHours(17, 59, 59, 999);
            console.log("End Date set to next week:", endDate.toISOString());
        } else {
            console.log("Current time is before 6 PM.");
            // Set start date to previous week at 18:00
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 18, 0, 0);
            console.log("Start Date set to previous week:", startDate.toISOString());

            // Set end date to today at 17:59:59.999
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 59, 59, 999);
            console.log("End Date set to today", endDate.toISOString());
        }
    } else {
        console.log("Today is not the target day.");
        // Calculate the last occurrence of the target day
        const daysToPrevious = (currentDay - targetDay + 7) % 7;
        const previousTargetDate = new Date(now);
        previousTargetDate.setUTCDate(now.getUTCDate() - (daysToPrevious === 0 ? 7 : daysToPrevious));

        console.log("Previous Target Date calculated as:", previousTargetDate.toISOString());

        // Set start date to previous target day at 18:00
        startDate = new Date(previousTargetDate.getFullYear(), previousTargetDate.getMonth(), previousTargetDate.getDate(), 18, 0, 0);
        console.log("Start Date set to previous target day:", startDate.toISOString());
        
        // Set end date to the next occurrence of the target day (next week)
        endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + 7);
        endDate.setUTCHours(17, 59, 59, 999);
        console.log("End Date set to next occurrence:", endDate.toISOString());
    }

    // Convert to UTC
    const startDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
    const endDateUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

    return { startDate: startDateUTC, endDate: endDateUTC };
}

