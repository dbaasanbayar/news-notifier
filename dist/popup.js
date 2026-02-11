import { getTopic, saveTopic } from "./storage.js";
const button = document.getElementById("save");
const input = document.getElementById("topic");
document.addEventListener("DOMContentLoaded", async () => {
    const topic = await getTopic();
    if (topic) {
        input.value = topic;
    }
});
button.addEventListener("click", async () => {
    const topic = input.value.trim();
    if (!topic)
        return;
    await saveTopic(topic);
    alert("Topic saved!");
});
//# sourceMappingURL=popup.js.map