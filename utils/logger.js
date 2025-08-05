// Utility function to log events into localStorage for tracking
export const logEvent = (eventName, data) => {
    const logs = JSON.parse(localStorage.getItem("logs")||"[]");
    logs.push({
        eventName,
        data,
        timestamp: new Date().toISOString(),
    });
    localStorage.setItem("logs", JSON.stringify(logs));
};
