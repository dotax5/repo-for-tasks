const pole = document.querySelector(".pole")
const ships_container = document.querySelector(".ships-container")
const field = Array.from({ length: 10 }, () => Array(10).fill(0));

for (let i = 0; i < 100; i++) {
    pole.insertAdjacentHTML("beforeend", `<div class="ceil" id="${i}">`)

}



const ships = document.querySelectorAll(".x2, .x3, .x4")

dct = {}
ships.forEach(e => { dct[e] = [e.getBoundingClientRect().x, e.getBoundingClientRect().y] });

function to_mass(ship, size, course, ceil) {
    const ceil_x = ceil.id % 10
    const ceil_y = Math.trunc(ceil.id / 10);
    if (course === "right") {
        if (ceil_x + size <= 10) {
            for (let i = 0; i < size; i++) {
                field[ceil_y][ceil_x+i] = 1
            }
        } else {return false}
    }
    if (course === "left") {
        if (ceil_x - size >= -1) {
            for (let i = 0; i < size; i++) {
                field[ceil_y][ceil_x-i] = 1
            }
        } else {return false}
    }
    if (course === "down") {
        if (ceil_y + size <= 10) {
            for (let i = 0; i < size; i++) {
                field[ceil_x][ceil_y+i] = 1
            }
        } else {return false}
    }
    if (course === "up") {
        if (ceil_x - size >= -1) {
            for (let i = 0; i < size; i++) {
                field[ceil_x][ceil_y-i] = 1
            }
        } else {return false}
    }
    return true


}

ships.forEach(ship => {
    ship.addEventListener("mousedown", (e) => {
        function ships_home() {
            ship.style.position = "";
            ship.style.left = "";
            ship.style.top = "";
            ship.style.zIndex = "";
            ship.style.rotate = ""
            ships_container.appendChild(ship);
        }

        let angle = Number((ship.style.rotate).replace(/\D/g, ''));
        let course = "right"


        ship.style.position = "absolute";
        ship.style.zIndex = 2;
        ship.style.left = ship.getBoundingClientRect().left + "px";
        ship.style.top = ship.getBoundingClientRect().top + "px";

        document.addEventListener("mousemove", onCursorMove);
        document.addEventListener("keydown", rotate)
        document.addEventListener("mouseup", onCursorUp);


        function rotate(e) {
            if (e.code !== "KeyR" && /^x[1-4]$/.test(e.className)) return;
            angle += 90;
            if (angle >= 360) {
                course = "right";
                angle = 0
            }
            if (angle === 90) {
                course = "down";
            }
            if (angle === 180) {
                course = "left";
            }
            if (angle === 270) {
                course = "up";
            }
            ship.style.rotate = angle + "deg";
        }

        function onCursorMove(e) {
            let newX = e.clientX - 20
            let newY = e.clientY - 20

            ship.style.left = newX + "px";
            ship.style.top = newY + "px";
        }

        function onCursorUp(e) {
            document.removeEventListener("mousemove", onCursorMove);
            document.removeEventListener("mouseup", onCursorUp);
            document.removeEventListener("keydown", rotate)

            ship.style.display = "none";
            const targetElement = document.elementFromPoint(e.clientX, e.clientY);
            ship.style.display = "";


            if (!targetElement || !targetElement.classList.contains("ceil")) {
                ships_home();
                return
            }
            const ceilRect = targetElement.getBoundingClientRect();
            ship.style.left = `${ceilRect.left}px`;
            ship.style.top = `${ceilRect.top}px`;

            const size = +ship.className.at(-1)
            if (!to_mass(ship, size, course, targetElement)) {
                ships_home();
            }

        }




    })
});
