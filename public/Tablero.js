export class Tablero {
  constructor(canvas) {
    this.canvas = canvas;
    canvas.addEventListener("click", function () {}, false);
    this.margenes = 1;
    this.escala = 4;
    this.tamañoCasilla = 10;
    this.datosTablero = null;

    this.posicionMouse = [-1, -1];
    this.coordenadaApuntada = { x: -1, y: -1 };

    this.casillas = new Object();
  }
  getCoorSelec() {
    return this.coordenadaApuntada;
  }

  setMousePosition(coord) {
    this.posicionMouse = coord;
  }

  setDatosTablero(datos) {
    this.datosTablero = datos;
    this.casillas = new Object();
    let contadorX = 0;
    while (contadorX < this.datosTablero.ancho) {
      let contadorY = 0;
      while (contadorY < this.datosTablero.alto) {
        let rect = new Path2D();
        rect.rect(
          contadorX * (this.tamañoCasilla + this.margenes) * this.escala,
          contadorY * (this.tamañoCasilla + this.margenes) * this.escala,
          this.tamañoCasilla * this.escala,
          this.tamañoCasilla * this.escala
        );

        if (datos.casillas[`${contadorX},${contadorY}`]) {
          this.casillas[`${contadorX},${contadorY}`] = new CasillaBoton(
            rect,
            "white",
            `${contadorX},${contadorY}`
          );
        } else {
          this.casillas[`${contadorX},${contadorY}`] = new CasillaBoton(
            rect,
            "black",
            `${contadorX},${contadorY}`
          );
        }
        contadorY++;
      }
      contadorX++;
    }
    this.draw();
  }

  draw() {
    let ctx = canvas.getContext("2d");
    if (this.datosTablero != null) {
      this.canvas.width =
        (this.tamañoCasilla + this.margenes) *
        this.datosTablero.ancho *
        this.escala;
      this.canvas.height =
        (this.tamañoCasilla + this.margenes) *
        this.datosTablero.alto *
        this.escala;

      let contadorX = 0;
      while (contadorX < this.datosTablero.ancho) {
        let contadorY = 0;
        while (contadorY < this.datosTablero.alto) {
          if (
            ctx.isPointInPath(
              this.casillas[`${contadorX},${contadorY}`].rect,
              this.posicionMouse[0],
              this.posicionMouse[1]
            )
          ) {
            this.coordenadaApuntada = { x: contadorX, y: contadorY };
            let rect = new Path2D();
            rect.rect(
              (contadorX * (this.tamañoCasilla + this.margenes) -
                this.margenes) *
                this.escala,
              (contadorY * (this.tamañoCasilla + this.margenes) -
                this.margenes) *
                this.escala,
              (this.tamañoCasilla + this.margenes * 2) * this.escala,
              (this.tamañoCasilla + this.margenes * 2) * this.escala
            );
            ctx.fillStyle = "blue";
            ctx.fill(rect);
          }

          ctx.fillStyle = this.casillas[`${contadorX},${contadorY}`].color;
          ctx.fill(this.casillas[`${contadorX},${contadorY}`].rect);

          contadorY++;
        }
        contadorX++;
      }

      //pendiente: onclick: comunica que casilla fue clickeada al servidor

      //lleno todo naranjo oscuro
      //pinto cada casilla segun su color
      //si el mouse esta encima, marcar el vorde azul
    } else {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
class CasillaBoton {
  constructor(rect, color, mensaje) {
    this.rect = rect;
    this.color = color;
    this.mensaje = mensaje;
  }
  getRect() {
    return this.rect;
  }
  getColor() {
    return this.color;
  }
  getMensaje() {
    return this.mensaje;
  }
}
