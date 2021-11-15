import { Tablero } from "/Tablero.js";

const canvas = document.getElementById("canvas");

document.onkeydown = (key) => {
  if (key.key == " ") {
    socket.emit("decision", { id: "procesarMomento" });
  }
};

const socket = io();

let tablero = new Tablero(canvas);
tablero.draw();

socket.on("serverMsg", (msg) => {
  msg.forEach((s) => {
    console.log(s);
  });
});
socket.on("tablero", (datos) => {
  tablero.setDatosTablero(datos);
  tablero.draw();
});

canvas.addEventListener("mousemove", function (event) {
  let coord = [event.offsetX, event.offsetY];
  tablero.setMousePosition(coord);
  tablero.draw();
});
canvas.addEventListener("click", () => {
  const { x, y } = tablero.getCoorSelec();
  socket.emit("decision", {
    id: "seleccionCasilla",
    variables: { coordenadas: { x, y } },
  });
});
