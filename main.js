import { Operador, Plano2D } from "./Dimension2D.js";

import { Server } from "socket.io";
import express from "express";
import http from "http";

const PORT = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

server.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

io.on("connection", (socket) => {
  console.log("Se conectó un usuario");
  socket.variables = {};
  socket.variables.dimensionConectada = dimensionDeLaVida;
  dimensionDeLaVida.addEspectador(socket);
  socket.on("decision", ({ id, variables }) => {
    if (id === "seleccionCasilla") {
      socket.variables.dimensionConectada
        .getOperador()
        .ejecutar("invertirPosesionVida", variables);
    }

    if (id === "procesarMomento") {
      socket.variables.dimensionConectada
        .getOperador()
        .ejecutar("ejecucionAlgoritmoDeLaVida");
    }
  });

  socket.on("disconnect", () => {
    console.log("Se desconectó un usuario");
    dimensionDeLaVida.removeEspectador(socket);
  });
});

const dimensionesMostrables = [];
const dimensionDeLaVida = new Plano2D("JuegoDeLaVida10*10", "esferico");
dimensionDeLaVida.setAlto(10);
dimensionDeLaVida.setAncho(10);
dimensionDeLaVida.setOperador(new Operador(dimensionDeLaVida));
dimensionesMostrables.push(dimensionDeLaVida);
