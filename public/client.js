import {Tablero} from '/Tablero.js'


var canvas = document.getElementById("canvas");

document.onkeydown = (key)=>{
    if(key.key== " "){
        socket.emit("desicion",{id:"procesarMomento"})
    }
}

var socket = io();


let tablero = new Tablero(canvas)
tablero.draw()

socket.on("serverMsg",(msg)=>{

    msg.forEach((string)=>{console.log(string)})
})
socket.on("tablero",(datos)=>{
    tablero.setDatosTablero(datos)
    tablero.draw()
})


canvas.addEventListener('mousemove', function(event) {

    let coord = [event.offsetX, event.offsetY]
    tablero.setMousePosition(coord)
    tablero.draw()
    
});
canvas.addEventListener('click', ()=>{
    socket.emit("desicion",{id:"seleccionCasilla",variables:{coordenadas:tablero.getCoorSelec()}})
});


