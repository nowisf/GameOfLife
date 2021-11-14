//import { Enon } from "./Enon.js"
//import { Mundo } from "./Mundo.js"
const { Plano2D, Operador } = require('./Dimension2D.js');
const express = require("express")
const http = require("http")
const { Server } =require( "socket.io" )
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
//app.get('/', (req, res) => { res.sendFile(__dirname + '/public/index.html'); });

server.listen(3000, () =>  console.log('listening on *:3000'));

io.on('connection', (socket) => {
    console.log('Se conecto un usuario');
    socket.variables={}
    socket.variables.dimencionConectada = dimensionDeLaVida
    dimensionDeLaVida.addEspectador(socket)    
    socket.on("desicion",(desicion)=>{
        desiciones={
            "seleccionCasilla":(variables)=>{
                socket.variables.dimencionConectada.getOperador().ejecutar("invertirPosecionVida",variables)},
            "procesarMomento":()=>{socket.variables.dimencionConectada.getOperador().ejecutar("ejecucionAlgoritmoDeLaVida");}
        }[desicion.id](desicion.variables)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        dimensionDeLaVida.removeEspectador(socket)
    });
});





//let enon = new Enon
//si -en esta situacion- utilizo esta neurona(motora) tengo X probabilidad de que Y
//let mundo = new Mundo

let dimensionesMostrables = new Array
let dimensionDeLaVida = new Plano2D( "JuegoDeLaVida10*10", "esferico")
dimensionDeLaVida.setAlto( 10)
dimensionDeLaVida.setAncho( 10)
dimensionDeLaVida.setOperador(new Operador(dimensionDeLaVida))
dimensionesMostrables.push(dimensionDeLaVida)
