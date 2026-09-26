const socket = io();
const input = document.querySelector("input");
const btn = document.querySelector("button");
const tasksDiv = document.querySelector(".tasks");

socket.on("update", (tasks) => {
    tasksDiv.innerHTML = "";
    tasks.forEach((task) => {
        const div = document.createElement("div");
        div.textContent = task;
        tasksDiv.appendChild(div);
    });
});

tasksDiv.addEventListener("click", (e) => {
    const tasksList = Array.from(tasksDiv.children);
    const index = tasksList.indexOf(e.target);

    if (index !== -1) {
        socket.emit("delete", index);
    }
});

btn.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
        socket.emit("add", {text});
        input.value = "";
    }
});
