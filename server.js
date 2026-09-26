const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("."));

let tasks = [];

io.on("connection", (socket) => {
    // Отправляем текущий список при подключении
    socket.emit("update", tasks);

    socket.on("add", (data) => {
        if (data && data.text) {
            tasks.push(data.text);
            io.emit("update", tasks);
        }
    });

    socket.on("delete", (data) => {
        if (data && typeof data.index === "number") {
            tasks.splice(data.index, 1);
            io.emit("update", tasks);
        }
    });
});

server.listen(3000, () => {
    console.log("Server started on port 3000!");
});
