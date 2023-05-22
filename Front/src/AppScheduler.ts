import NextMainDate from "./nextMainDate";

const scheduleRequest = () => {
  // Calculate the time until the next 8 AM
  const now = new Date();
  const eightAm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
  let timeUntilEightAm = eightAm.getTime() - now.getTime();

  // If the time is already past 8 AM, schedule it for the next day
  if (timeUntilEightAm < 0) {
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0, 0);
    timeUntilEightAm = tomorrow.getTime() - now.getTime();
  }

  // Schedule the API request
  setTimeout(() => {
    NextMainDate();
    // Reschedule for the next day
    scheduleRequest();
  }, timeUntilEightAm);
};

export default scheduleRequest;
