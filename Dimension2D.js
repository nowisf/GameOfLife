export class Plano2D {
  constructor(nombre, tipo) {
    this.nombre = nombre;
    this.casillas = {};

    this.tipo = tipo; //esferico, bordeado, infinito

    //en caso de esferico o bordeado, se define con setters
    this.alto = undefined;
    this.ancho = undefined;

    this.operador = null;

    this.espectadores = [];
  }
  ilustrarEspectadores() {
    this.espectadores.forEach((espectador) => {
      this.ilustrarEspectador(espectador);
    });
  }
  ilustrarEspectador(espectador) {
    espectador.emit("tablero", this.getDatosVisualizacion());
  }
  addEspectador(espectador) {
    this.espectadores.push(espectador);
    this.ilustrarEspectador(espectador);
  }
  removeEspectador(espectador) {
    const index = this.espectadores.indexOf(espectador);
    if (index > -1) {
      this.espectadores.splice(index, 1);
    }
  }

  getOperador() {
    return this.operador;
  }
  setOperador(operador) {
    this.operador = operador;
  }
  getDatosVisualizacion() {
    const datosSegunTipo = {
      esferico: {
        alto: this.alto,
        ancho: this.ancho,
        casillas: this.casillas,
      },
    };
    const casillas = {};
    const returnar = datosSegunTipo[this.tipo];
    for (const key in returnar.casillas) {
      casillas[coord2DToString(returnar.casillas[key].coordenadas)] =
        returnar.casillas[key].contenido;
    }

    returnar.casillas = casillas;
    return returnar;
  }
  setAlto(alto) {
    this.alto = alto;
  }
  setAncho(ancho) {
    this.ancho = ancho;
  }
  addToCasilla(coordenadas, contenido) {
    const strCoord = coord2DToString(coordenadas);
    if (this.casillas[strCoord] == undefined) {
      this.casillas[strCoord] = new Casilla(this, coordenadas);
    }
    this.casillas[strCoord].añadir(contenido);
  }

  // trasladarFicha(ficha, newCoordenadas) {
  //   const strFichaCoord = ficha.getStrCoord();
  //   const strNewCoord = `${newCoordenadas.x},${newCoordenadas.y}`;

  //   //cambiar la coordenada de la ficha
  // }

  getCasillasRectasInmediatas(coordenadas) {
    const cri = [];
    cri.push(
      this.getCasillaContenido({ x: coordenadas.x, y: coordenadas.y + 1 })
    );
    cri.push(
      this.getCasillaContenido({ x: coordenadas.x, y: coordenadas.y - 1 })
    );
    cri.push(
      this.getCasillaContenido({ x: coordenadas.x + 1, y: coordenadas.y })
    );
    cri.push(
      this.getCasillaContenido({ x: coordenadas.x - 1, y: coordenadas.y })
    );
    return cri;
  }
  getCasillasDiagonalesInmediatas(coordenadas) {
    const cdi = [];
    cdi.push(
      this.getCasillaContenido({ x: coordenadas.x + 1, y: coordenadas.y + 1 })
    );
    cdi.push(
      this.getCasillaContenido({ x: coordenadas.x - 1, y: coordenadas.y + 1 })
    );
    cdi.push(
      this.getCasillaContenido({ x: coordenadas.x + 1, y: coordenadas.y - 1 })
    );
    cdi.push(
      this.getCasillaContenido({ x: coordenadas.x - 1, y: coordenadas.y + 1 })
    );
    return cdi;
  }
  getCasillasRodeantes(coordenadas) {
    const casillasRodeantes = [];
    casillasRodeantes.push(this.getCasillasDiagonalesInmediatas(coordenadas));
    casillasRodeantes.push(this.getCasillasRectasInmediatas(coordenadas));
    return casillasRodeantes.flat();
  }

  // getSector(ancho, alto, centro) {
  //   //quiza el equivalente a ficha tiene "getSectorCircundante"
  // }

  getCoordenadasRodeantes(coordenada) {
    const casosDeTipos = {
      esferico: () => {
        const paquete = [];
        const cambios = [
          { x: -1, y: 1 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
          { x: -1, y: -1 },
          { x: 0, y: -1 },
          { x: 1, y: -1 },
        ];
        cambios.forEach((cambio) => {
          let xFinal = coordenada.x + cambio.x;
          let yFinal = coordenada.y + cambio.y;

          if (xFinal < 0) {
            xFinal = this.ancho - 1;
          }
          if (yFinal < 0) {
            yFinal = this.alto - 1;
          }
          if (xFinal >= this.ancho) {
            xFinal = 0;
          }
          if (yFinal >= this.alto) {
            yFinal = 0;
          }

          paquete.push({
            x: xFinal,
            y: yFinal,
          });
        });
        return paquete;
      },
    };
    return casosDeTipos[this.tipo]();
  }

  getCasillaContenido(coordenada) {
    if (this.casillas[coord2DToString(coordenada)] == null) {
      return [];
    }
    return this.casillas[coord2DToString(coordenada)].getContenido();
  }
  eliminarCasilla(coordenada) {
    delete this.casillas[coord2DToString(coordenada)];
  }
  //delete nombre_del_objeto.clave;
  //usar al vaciar una casilla
}

class Casilla {
  constructor(planoContenedor, coordenadas) {
    this.planoContenedor = planoContenedor;
    this.contenido = [];
    this.coordenadas = coordenadas;
  }
  añadir(ficha) {
    this.contenido.push(ficha);
  }
  // quitar(ficha) {}
  getContenido() {
    return this.contenido;
  }
  getCasillasRodeantes() {
    return this.planoContenedor.getCasillasRodeantes(this.coordenadas);
  }
}

//el procesador dimensional 1ro anota que sucesos se ejecutaran en este instante
//  (x moviendose hacia y  o algo asi)
// y luego realiza lo que deberia pasar, de esta forma si dos casillas deberian moverse a la misma wea, se puede realizar una colicion

export class Ficha {
  constructor() {
    this.entidad = null;
    this.coordenada = null;
    this.dimension = null;
  }
  setCoordenada(x, y) {
    this.coordenada = [x, y];
  }

  // getSector(ancho, alto, centro) {
  //   //quiza el equivalente a ficha tiene "getSectorCircundante"
  // }
}

export class Operador {
  constructor(d2d) {
    this.d2d = d2d;
    this.procesosPosibles = {
      ejecucionAlgoritmoDeLaVida: () => {
        const casillasAPerderFV = [];
        const casSinFVRodCasConFV = [];
        const casillasQueObtendranFV = [];
        this.espaciosDeMemoria.casillasConVida.forEach((coordenada) => {
          const coordsRod = this.d2d.getCoordenadasRodeantes(
            stringToCoord2D(coordenada)
          );
          let vidaContadaAlrededor = 0;
          coordsRod.forEach((coordRod) => {
            const contenido = this.d2d.getCasillaContenido(coordRod);
            if (contenido.includes("vida")) {
              vidaContadaAlrededor++;
            } else {
              if (!contenido.includes("marca")) {
                casSinFVRodCasConFV.push(coordRod);
                this.d2d.addToCasilla(coordRod, "marca");
              }
            }
          });
          if (vidaContadaAlrededor < 2 || vidaContadaAlrededor > 3) {
            casillasAPerderFV.push(stringToCoord2D(coordenada));
          }
        });
        casSinFVRodCasConFV.forEach((coord) => {
          this.d2d.eliminarCasilla(coord);
          const coordsRod = this.d2d.getCoordenadasRodeantes(coord);
          let contadorDeVidaRodeante = 0;
          coordsRod.forEach((coordRod) => {
            const contenido = this.d2d.getCasillaContenido(coordRod);
            if (contenido.includes("vida")) {
              contadorDeVidaRodeante++;
            }
          });
          if (contadorDeVidaRodeante == 3) {
            casillasQueObtendranFV.push(coord);
          }
        });
        casillasQueObtendranFV.forEach((coordNacido) => {
          this.d2d.addToCasilla(coordNacido, "vida");
          this.ejecutar("añadirAMemoria", {
            nombreMemoria: "casillasConVida",
            dato: coord2DToString(coordNacido),
          });
        });
        casillasAPerderFV.forEach((coordMuerto) => {
          this.d2d.eliminarCasilla(coordMuerto);
          this.ejecutar("quitarDeMemoria", {
            nombreMemoria: "casillasConVida",
            dato: coord2DToString(coordMuerto),
          });
        });

        this.d2d.ilustrarEspectadores();
      },
      invertirPosesionVida: (variables) => {
        const casilla = this.d2d.getCasillaContenido(variables.coordenadas);
        if (casilla.includes("vida")) {
          d2d.eliminarCasilla(variables.coordenadas);
          this.ejecutar("quitarDeMemoria", {
            nombreMemoria: "casillasConVida",
            dato: coord2DToString(variables.coordenadas),
          });
        } else {
          d2d.addToCasilla(variables.coordenadas, "vida");
          this.ejecutar("añadirAMemoria", {
            nombreMemoria: "casillasConVida",
            dato: coord2DToString(variables.coordenadas),
          });
        }
        d2d.ilustrarEspectadores();
      },
      añadirAMemoria: (variables) => {
        this.espaciosDeMemoria[variables.nombreMemoria].push(variables.dato);
      },
      quitarDeMemoria: (variables) => {
        const index = this.espaciosDeMemoria[variables.nombreMemoria].indexOf(
          variables.dato
        );
        if (index > -1) {
          this.espaciosDeMemoria[variables.nombreMemoria].splice(index, 1);
        }
      },
    }; //id:[comando, comando, ...]
    this.espaciosDeMemoria = { casillasConVida: [] }; //id:[]
  }
  ejecutar(operacion, variables) {
    this.procesosPosibles[operacion](variables);
  }
  /*
    alterarContenidoDeCasillaQueCumplaCondicion(funcion){
        let funcion = funcion
        contenido.forEach((ficha)=>{
            if(ficha.cumpleCondicion()){
                funcion(ficha)
            }
        })
    }*/
}

function coord2DToString(coord2D) {
  return `${coord2D.x},${coord2D.y}`;
}
function stringToCoord2D(s) {
  const coordenadasEnArray = s.split(",");
  return {
    x: parseInt(coordenadasEnArray[0]),
    y: parseInt(coordenadasEnArray[1]),
  };
}
