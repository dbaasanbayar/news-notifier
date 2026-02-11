export const saveTopic = async (topic) => {
    await chrome.storage.local.set({ topic });
};
export const getTopic = async () => {
    const result = await chrome.storage.local.get("topic");
    return result.topic || null;
};
export const getLastArticleId = async () => {
    const result = await chrome.storage.local.get("LastArticleId");
    return result.LastArticleId || null;
};
export const setLastArticleId = async (id) => {
    await chrome.storage.local.set({ LastArticleId: id });
};
//# sourceMappingURL=storage.js.map