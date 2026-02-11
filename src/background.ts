import { getLastArticleId, getTopic, setLastArticleId } from "./storage.js";

console.log("Background running")

const API_KEY="5baa431731ad44deaa6207d1a83b931c";

const fetchNews = async () => {
    const topic = await getTopic();
    console.log(" Current Topic from storage:", topic)
    if (!topic) {
        console.warn("No topic found in storage.");
        return;
    }

    const url = `https://newsapi.org/v2/everything?q=${topic}&pageSize=1&apiKey=${API_KEY}`
    console.log("fetching from URL:", url)

    const res = await fetch(url);
    const data = await res.json();
    console.log("data ireh", data.articles)

    if (!data.articles || data.articles.length === 0) return;

    const article = data.articles[0];
    const newId = article.url;

    const lastId = await getLastArticleId();

    if (newId !== lastId) {
        await setLastArticleId(newId);
        showNotification(article.title, article.url);
    }
};

const showNotification = (title: string, url: string) => {
    chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon.png"),
        title: "New Article Found",
        message: title || "New article available"
    });

    chrome.notifications.onClicked.addListener(() => {
        chrome.tabs.create({url});
    });
    console.log("notification ireh", title)
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("checkNews", {
        periodInMinutes: 0.5
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkNews") {
        fetchNews();
        // console.log("Current Time:", new Date().toLocaleTimeString());
    }
});

