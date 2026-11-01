const pole = document.querySelector(".pole")
const ships_container = document.querySelector(".ships-container")
const field = Array.from({ length: 10 }, () => Array(10).fill(0));

for (let i = 0; i < 100; i++) {
    pole.insertAdjacentHTML("beforeend", `<div class="ceil" id="${i}">`)
}

const ships = document.querySelectorAll(".x1, .x2, .x3, .x4")

function render() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            field[i][j] = 0;
        }
    }

    ships.forEach(ship => {
        if (ship.parentElement === pole && ship.dataset.startCellId !== undefined) {
            const size = +ship.className.at(-1);
            const startId = Number(ship.dataset.startCellId);
            const ceil_x = startId % 10;
            const ceil_y = Math.trunc(startId / 10);
            const course = ship.dataset.course || "right";

            if (course === "right" && ceil_x + size <= 10) {
                for (let i = 0; i < size; i++) field[ceil_y][ceil_x + i] = ship.className;
            } else if (course === "left" && ceil_x - size + 1 >= 0) {
                for (let i = 0; i < size; i++) field[ceil_y][ceil_x - i] = ship.className;
            } else if (course === "down" && ceil_y + size <= 10) {
                for (let i = 0; i < size; i++) field[ceil_y + i][ceil_x] = ship.className;
            } else if (course === "up" && ceil_y - size + 1 >= 0) {
                for (let i = 0; i < size; i++) field[ceil_y - i][ceil_x] = ship.className;
            }
        }
    });

}

function check_space(size, course, ceil) {
    const ceil_x = ceil.id % 10;
    const ceil_y = Math.trunc(ceil.id / 10);

    if (course === "right" && ceil_x + size > 10) return false;
    if (course === "left" && ceil_x - size + 1 < 0) return false;
    if (course === "down" && ceil_y + size > 10) return false;
    if (course === "up" && ceil_y - size + 1 < 0) return false;

    if (course === "right") {
        for (let i = 0; i < size; i++) {
            if (field[ceil_y][ceil_x + i] !== 0) return false;
        }
    } else if (course === "left") {
        for (let i = 0; i < size; i++) {
            if (field[ceil_y][ceil_x - i] !== 0) return false;
        }
    } else if (course === "down") {
        for (let i = 0; i < size; i++) {
            if (field[ceil_y + i][ceil_x] !== 0) return false;
        }
    } else if (course === "up") {
        for (let i = 0; i < size; i++) {
            if (field[ceil_y - i][ceil_x] !== 0) return false;
        }
    }

    return true;
}

ships.forEach(ship => {
    ship.addEventListener("mousedown", () => {
        function ships_home() {
            delete ship.dataset.startCellId;
            delete ship.dataset.course;
            ship.style.position = "";
            ship.style.left = "";
            ship.style.top = "";
            ship.style.zIndex = "";
            ship.style.rotate = "";
            ships_container.appendChild(ship);
            render();
        }

        delete ship.dataset.startCellId;
        delete ship.dataset.course;
        render();

        let angle = Number((ship.style.rotate).replace(/\D/g, '')) || 0;
        let course = "right";
        if (angle === 90) course = "down";
        else if (angle === 180) course = "left";
        else if (angle === 270) course = "up";

        ship.style.position = "absolute";
        ship.style.zIndex = 2;
        ship.style.left = ship.getBoundingClientRect().left + "px";
        ship.style.top = ship.getBoundingClientRect().top + "px";

        document.addEventListener("mousemove", onCursorMove);
        document.addEventListener("keydown", rotate);
        document.addEventListener("mouseup", onCursorUp);

        function rotate(e) {
            if (e.code !== "KeyR") return;
            angle += 90;
            if (angle >= 360) {
                course = "right";
                angle = 0;
            } else if (angle === 90) {
                course = "down";
            } else if (angle === 180) {
                course = "left";
            } else if (angle === 270) {
                course = "up";
            }
            ship.style.rotate = angle + "deg";
        }

        function onCursorMove(e) {
            ship.style.left = (e.clientX - 20) + "px";
            ship.style.top = (e.clientY - 20) + "px";
        }

        function onCursorUp(e) {
            document.removeEventListener("mousemove", onCursorMove);
            document.removeEventListener("mouseup", onCursorUp);
            document.removeEventListener("keydown", rotate);

            ship.style.display = "none";
            const targetElement = document.elementFromPoint(e.clientX, e.clientY);
            ship.style.display = "";

            if (!targetElement || !targetElement.classList.contains("ceil")) {
                ships_home();
                return;
            }

            const size = +ship.className.at(-1);

            if (!check_space(size, course, targetElement)) {
                ships_home();
            } else {
                const ceilRect = targetElement.getBoundingClientRect();
                ship.style.left = `${ceilRect.left}px`;
                ship.style.top = `${ceilRect.top}px`;

                ship.dataset.startCellId = targetElement.id;
                ship.dataset.course = course;
                pole.appendChild(ship);
                render();
            }
        }
    });
});
