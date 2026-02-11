import { getTopic, saveTopic } from "./storage.js";

const button = document.getElementById("save") as HTMLButtonElement;
const input = document.getElementById("topic") as HTMLInputElement;

document.addEventListener("DOMContentLoaded", async () => {
  const topic = await getTopic();
  if (topic) {
    input.value = topic;
  }
});

button.addEventListener("click", async () => {
  const topic = input.value.trim();
  if (!topic) return;
  await saveTopic(topic);
  alert("Topic saved!")
});
