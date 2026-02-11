export const saveTopic = async (topic: string) => {
  await chrome.storage.local.set({ topic });
};

export const getTopic = async (): Promise<string | null> => {
  const result = await chrome.storage.local.get("topic") as {topic?: string}
  return result.topic || null;
}

export const getLastArticleId = async (): Promise<string | null> => {
  const result = await chrome.storage.local.get("LastArticleId") as {LastArticleId?: string}
  return result.LastArticleId || null;
}

export const setLastArticleId = async (id: string) => {
  await chrome.storage.local.set({LastArticleId: id});
};