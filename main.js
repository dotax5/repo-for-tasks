const socket = io();
const input = document.querySelector("input");
const btn = document.querySelector("button");
const tasksDiv = document.querySelector(".tasks");

socket.on("update", (tasks) => {
    tasksDiv.innerHTML = "";
    tasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.textContent = task;
        div.style.cursor = "pointer";
        div.style.margin = "5px 0";
        div.onclick = () => {
            socket.emit("delete", { index });
        };
        tasksDiv.appendChild(div);
    });
});

btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
        socket.emit("add", { text });
        input.value = "";
    }
});
