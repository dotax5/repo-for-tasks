const pole = document.querySelector(".pole")
const ships_container = document.querySelector(".ships-container")

for (let i = 0; i < 100; i++) {
    pole.insertAdjacentHTML("beforeend", `<div class="ceil" id="${i}">`)
}


const ships = document.querySelectorAll(".x2, .x3, .x4")

dct = {}

ships.forEach(e => { dct[e] = [e.getBoundingClientRect().x, e.getBoundingClientRect().y] });

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
        let shiftX = e.clientX - ship.getBoundingClientRect().left;
        let shiftY = e.clientY - ship.getBoundingClientRect().top;

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


            const ceilRect = targetElement.getBoundingClientRect();
            ship.style.left = `${ceilRect.left}px`;
            ship.style.top = `${ceilRect.top}px`;

            const rect_ship = ship.getBoundingClientRect();
            // let rect_for_check = {}
            // for (let i = 0; i < rect_ship.x/40; i++) {
            //     rect_for_check[`x${i}`] = [rect_ship.left + 20*i, rect_ship]

            // }
            const x1 = rect_ship.left + 5;
            const y1 = rect_ship.top + 5;

            const x2 = rect_ship.right - 5;
            const y2 = rect_ship.top + 5;

            const x3 = rect_ship.left + 5;
            const y3 = rect_ship.bottom - 5;
            ship.style.display = "none"
            const edge_1 = document.elementFromPoint(x1, y1);
            const edge_2 = document.elementFromPoint(x2, y2);
            const edge_3 = document.elementFromPoint(x3, y3);
            const isEdge1Valid = edge_1.classList.contains("ceil");
            const isEdge2Valid = edge_2.classList.contains("ceil");
            const isEdge3Valid = edge_3.classList.contains("ceil");
            if (!isEdge1Valid || !isEdge2Valid || !isEdge3Valid) {
                ships_home();
            }
            ship.style.display = "";
        }




    })
});
