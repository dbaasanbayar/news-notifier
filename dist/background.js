// import { getLastArticleId, getTopic, setLastArticleId } from "./storage.js";
// console.log("Background running")
// const API_KEY="5baa431731ad44deaa6207d1a83b931c";
// const fetchNews = async () => {
//     const topic = await getTopic();
//     console.log(" Current Topic from storage:", topic)
//     if (!topic) {
//         console.warn("No topic found in storage.");
//         return;
//     }
//     const url = `https://newsapi.org/v2/everything?q=${topic}&pageSize=1&apiKey=${API_KEY}`
//     console.log("fetching from URL:", url)
//     const res = await fetch(url);
//     const data = await res.json();
//     console.log("data ireh", data.articles)
//     if (!data.articles || data.articles.length === 0) return;
//     const article = data.articles[0];
//     const newId = article.url;
//     const lastId = await getLastArticleId();
//     if (newId !== lastId) {
//         await setLastArticleId(newId);
//         showNotification(article.title, article.url);
//     }
// };
// const showNotification = (title: string, url: string) => {
//     const notificationId =`news-${Date.now()}`
//     chrome.notifications.create(notificationId,{
//         type: "basic",
//         iconUrl: "icons/icon.png",
//         title: "New Article Found",
//         message: title || "New article available"
//     });
//     chrome.notifications.onClicked.addListener(() => {
//         chrome.tabs.create({url});
//     });
//     console.log("notification ireh", title)
// };
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.alarms.create("checkNews", {
//         periodInMinutes: 1.0
//     });
// });
// chrome.alarms.onAlarm.addListener((alarm) => {
//     if (alarm.name === "checkNews") {
//         fetchNews();
//         console.log("Current Time:", new Date().toLocaleTimeString());
//     }
// });
import { getLastArticleId, getTopic, setLastArticleId } from "./storage.js";
console.log("Background service worker active");
const API_KEY = "5baa431731ad44deaa6207d1a83b931c";
// 1. Move Listener to Top Level
// This prevents multiple tabs opening and works even if the worker restarts
chrome.notifications.onClicked.addListener((notificationId) => {
    // We used the URL as the ID in showNotification below
    if (notificationId.startsWith("https")) {
        chrome.tabs.create({ url: notificationId });
        chrome.notifications.clear(notificationId);
    }
});
const fetchNews = async () => {
    const topic = await getTopic();
    if (!topic)
        return;
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&pageSize=1&apiKey=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (!data.articles || data.articles.length === 0)
            return;
        console.log("aa", data.articles);
        const article = data.articles[0];
        const newId = article.url;
        const lastId = await getLastArticleId();
        if (newId !== lastId) {
            await setLastArticleId(newId);
            showNotification(article.title, article.url);
        }
    }
    catch (error) {
        console.error("Fetch failed:", error);
    }
};
const showNotification = (title, url) => {
    // We use the article URL as the notification ID so the listener knows where to go
    chrome.notifications.create(url, {
        type: "basic",
        iconUrl: "icons/icon.png", // Ensure this exists in your 'dist' folder!
        title: "New Article Found",
        message: title || "Click to read more",
        priority: 2
    }, (id) => {
        if (chrome.runtime.lastError) {
            console.error("Notification Error:", chrome.runtime.lastError.message);
            // PRO TIP: If it fails, try again WITHOUT the icon to prove the icon is the issue
            showNotificationFallback(title, url);
        }
    });
};
// Fallback for when the icon is causing the "Unable to download" error
const showNotificationFallback = (title, url) => {
    chrome.notifications.create(url, {
        type: "basic",
        iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // Tiny transparent pixel
        title: "New Article (Icon Load Failed)",
        message: title
    });
};
chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("checkNews", { periodInMinutes: 1.0 });
    fetchNews(); // Run once immediately on install
});
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkNews") {
        fetchNews();
    }
});
//# sourceMappingURL=background.js.map