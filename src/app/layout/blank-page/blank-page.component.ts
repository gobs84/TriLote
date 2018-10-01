import { Component, OnInit, Input } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { KmlLayerManager, AgmKmlLayer } from '@agm/core';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss'],
    animations: [routerTransition()]
})
export class BlankPageComponent implements OnInit {
    dt = new Date;
    showMenu: string = '';
    municipios = [];
    distritos = [];
    otbs = [];
    av = [];
    mediafiltrada = 0;
    variablefiltrada = 'Click en un área';
    filtro = 'municipio';
    filtrosec = 'casa';
    filtrotipo = 'alquiler';
    preciosMediaMunicipio = [];
    preciosMediaDistrito = [];
    preciosMediaOtb = [];
    opcion;
    year = this.dt.getFullYear();
    month = this.dt.getMonth() + 1;
    months = [{ nombre: "Enero", num: 1 }, { nombre: "Febrero", num: 2 }, { nombre: "Marzo", num: 3 }, { nombre: "Abril", num: 1 },
    { nombre: "Mayo", num: 5 }, { nombre: "Junio", num: 6 }, { nombre: "Julio", num: 7 }, { nombre: "Agosto", num: 8 },
    { nombre: "Septiembre", num: 9 }, { nombre: "Octubre", num: 10 }, { nombre: "Noviembre", num: 11 }, { nombre: "Diciembre", num: 12 }]
    years = [];


    onMouseOver(infoWindow, gm) {
        if (gm.lastOpen != null) {
            gm.lastOpen.close();
        }
        gm.lastOpen = infoWindow;
        infoWindow.open();
    }

    //    Coordenadas iniciales del mapa
    lat: number = -17.382179;
    lng: number = -66.176434;
    mapTypeId = 'terrain';
    //    URL's donde se encuentran los archivos KML, creado en un repositorio de google nuestro
    otbsKmlUrl = 'https://sites.google.com/site/trilotescraping/kml-files/OTBS%20AMC%20andres.kml';
    distritosKmlUrl = 'https://sites.google.com/site/trilotescraping/kml-files/Distritos%20AMC%20andres.kml';

    otbsFlag: boolean = false;
    distritosFlag: boolean = false;
    constructor(private _dataService: DataService) { }
    //    Funciona como un constructor para angular, obtenemos los datos del server mediante un observable(subscribe)
    //    aprovechando la obtencion de los datos, realizamos la reparticion al resto de nuestras variables con los datos de interes
    ngOnInit() {
        for (let index = 0; index < 20; index++) {
            this.years.push(2018 + index);
        }
        console.log('years: ' + this.years);

        this.opcion = "Media";
        this._dataService.getAvisosM(this.year,this.month)
            .subscribe(response => {
                var datos = <Array<any>>response;
                for (let dato of datos) {
                    this.av.push({
                        precio: dato.precio,
                        seccion: dato.seccion,
                        tipo: dato.tipo,
                        municipio: dato.municipio,
                        distrito: dato.distrito,
                        otb: dato.otb,
                        dia: dato.dia,
                        mes: dato.mes,
                        year: dato.year
                    });
                }
                console.log('avisos:', this.av);
                this._dataService.getMunicipios()
                    .subscribe(response => {
                        var datos = <Array<any>>response;
                        datos.sort((n1, n2) => n1.ID - n2.ID)
                        var count = -1;
                        var nombre = "";
                        for (let dato of datos) {
                            if (dato.NOM_MUN === nombre) {
                                this.municipios[count].puntos.push({
                                    lat: dato.lng,
                                    lng: dato.lat
                                })
                            } else {
                                count++;
                                nombre = dato.NOM_MUN;
                                this.municipios.push({
                                    nombre: dato.NOM_MUN,
                                    intensidad: 0,
                                    puntos: [{
                                        lat: dato.lng,
                                        lng: dato.lat
                                    }]
                                });
                            }
                        }
                        this.vectorMedia("municipio");
                        this.setIntensidades(this.municipios, this.preciosMediaMunicipio);
                        console.log('municipios:', this.municipios);
                    },
                        error => {
                            console.log(error);
                        });
                this._dataService.getDistritos()
                    .subscribe(response => {
                        var datos = <Array<any>>response;
                        datos.sort((n1, n2) => n1.ID - n2.ID)
                        var count = -1;
                        var nombre = "";
                        for (let dato of datos) {
                            if (dato.Nomb_dist === nombre) {
                                this.distritos[count].puntos.push({
                                    lat: dato.LNG,
                                    lng: dato.LAT
                                })
                            } else {
                                count++;
                                nombre = dato.Nomb_dist;
                                this.distritos.push({
                                    nombre: dato.Nomb_dist,
                                    intensidad: 0,
                                    puntos: [{
                                        lat: dato.LNG,
                                        lng: dato.LAT
                                    }]
                                });
                            }
                        }
                        this.vectorMedia("distrito");
                        this.setIntensidades(this.distritos, this.preciosMediaDistrito);
                        console.log('distritos:', this.distritos);
                    },
                        error => {
                            console.log(error);
                        });
                this._dataService.getOtbs()
                    .subscribe(response => {
                        var datos = <Array<any>>response;
                        datos.sort((n1, n2) => n1.ID - n2.ID)
                        var count = -1;
                        var nombre = "";
                        for (let dato of datos) {
                            if (dato.OTB === nombre) {
                                this.otbs[count].puntos.push({
                                    lat: dato.Lng,
                                    lng: dato.Lat
                                })
                            } else {
                                count++;
                                nombre = dato.OTB;
                                this.otbs.push({
                                    nombre: dato.OTB,
                                    intensidad: 0,
                                    puntos: [{
                                        lat: dato.Lng,
                                        lng: dato.Lat
                                    }]
                                });
                            }
                        }
                        this.vectorMedia("otb");
                        this.setIntensidades(this.otbs, this.preciosMediaOtb);
                        console.log('otbs:', this.otbs);
                    },
                        error => {
                            console.log(error);
                        });

            },
                error => {
                    console.log(error);
                });
    }
    setIntensidades(vector1, vector2) {
        var indice = 0;
        for (let dato of vector1) {
            dato.intensidad = 0;
        }
        for (let dato of vector2) {
            if (dato.media === 0) {
                indice++;
            }
            else break;
        }
        if (vector2[vector2.length - 1] && vector2[indice]) {
            if (indice == vector2.length - 1) {
                for (let dato of vector1) {
                    if (vector2[vector2.length - 1].nombre === dato.nombre)
                        dato.intensidad = 0.8;
                }
            } else {
                var intervalo = (vector2[vector2.length - 1].media - vector2[indice].media) / 5;
                for (let dato of vector1) {
                    for (let dato2 of vector2) {
                        if (dato2.nombre === dato.nombre) {
                            if (dato2.media != 0) {
                                var a = dato2.media - vector2[indice].media;
                                dato.intensidad = 0.1 + (a / intervalo) * 0.15;
                            }
                        }
                    }
                }
            }
        }
    }
    vectorMedia(filtro) {
        switch (filtro) {
            case "municipio":
                this.preciosMediaMunicipio = [];
                for (let dato of this.municipios) {
                    this.preciosMediaMunicipio.push({
                        nombre: dato.nombre,
                        media: this.getMedia(dato.nombre, filtro)
                    })
                }
                this.preciosMediaMunicipio.sort((n1, n2) => n1.media - n2.media);
                break;
            case "distrito":
                this.preciosMediaDistrito = [];
                for (let dato of this.distritos) {
                    this.preciosMediaDistrito.push({
                        nombre: dato.nombre,
                        media: this.getMedia(dato.nombre, filtro)
                    })
                }
                this.preciosMediaDistrito.sort((n1, n2) => n1.media - n2.media);
                break;
            case "otb":
                this.preciosMediaOtb = [];
                for (let dato of this.otbs) {
                    this.preciosMediaOtb.push({
                        nombre: dato.nombre,
                        media: this.getMedia(dato.nombre, filtro),
                        moda: 0
                    })
                }
                this.preciosMediaOtb.sort((n1, n2) => n1.media - n2.media);
                break;
        }
    }
    vectorModa(filtro) {
        switch (filtro) {
            case "municipio":
                this.preciosMediaMunicipio = [];
                for (let dato of this.municipios) {
                    this.preciosMediaMunicipio.push({
                        nombre: dato.nombre,
                        media: this.getModa(dato.nombre, filtro)
                    })
                }
                this.preciosMediaMunicipio.sort((n1, n2) => n1.media - n2.media);
                break;
            case "distrito":
                this.preciosMediaDistrito = [];
                for (let dato of this.distritos) {
                    this.preciosMediaDistrito.push({
                        nombre: dato.nombre,
                        media: this.getModa(dato.nombre, filtro)
                    })
                }
                this.preciosMediaDistrito.sort((n1, n2) => n1.media - n2.media);
                break;
            case "otb":
                this.preciosMediaOtb = [];
                for (let dato of this.otbs) {
                    this.preciosMediaOtb.push({
                        nombre: dato.nombre,
                        media: this.getModa(dato.nombre, filtro),
                        moda: 0
                    })
                }
                this.preciosMediaOtb.sort((n1, n2) => n1.media - n2.media);
                break;
        }
    }
    vectorMediana(filtro) {
        switch (filtro) {
            case "municipio":
                this.preciosMediaMunicipio = [];
                for (let dato of this.municipios) {
                    this.preciosMediaMunicipio.push({
                        nombre: dato.nombre,
                        media: this.getMediana(dato.nombre, filtro)
                    })
                }
                this.preciosMediaMunicipio.sort((n1, n2) => n1.media - n2.media);
                break;
            case "distrito":
                this.preciosMediaDistrito = [];
                for (let dato of this.distritos) {
                    this.preciosMediaDistrito.push({
                        nombre: dato.nombre,
                        media: this.getMediana(dato.nombre, filtro)
                    })
                }
                this.preciosMediaDistrito.sort((n1, n2) => n1.media - n2.media);
                break;
            case "otb":
                this.preciosMediaOtb = [];
                for (let dato of this.otbs) {
                    this.preciosMediaOtb.push({
                        nombre: dato.nombre,
                        media: this.getMediana(dato.nombre, filtro),
                        moda: 0
                    })
                }
                this.preciosMediaOtb.sort((n1, n2) => n1.media - n2.media);
                break;
        }
    }
    vectorMax(filtro) {
        switch (filtro) {
            case "municipio":
                this.preciosMediaMunicipio = [];
                for (let dato of this.municipios) {
                    this.preciosMediaMunicipio.push({
                        nombre: dato.nombre,
                        media: this.getMax(dato.nombre, filtro)
                    })
                }
                this.preciosMediaMunicipio.sort((n1, n2) => n1.media - n2.media);
                break;
            case "distrito":
                this.preciosMediaDistrito = [];
                for (let dato of this.distritos) {
                    this.preciosMediaDistrito.push({
                        nombre: dato.nombre,
                        media: this.getMax(dato.nombre, filtro)
                    })
                }
                this.preciosMediaDistrito.sort((n1, n2) => n1.media - n2.media);
                break;
            case "otb":
                this.preciosMediaOtb = [];
                for (let dato of this.otbs) {
                    this.preciosMediaOtb.push({
                        nombre: dato.nombre,
                        media: this.getMax(dato.nombre, filtro),
                        moda: 0
                    })
                }
                this.preciosMediaOtb.sort((n1, n2) => n1.media - n2.media);
                break;
        }
    }
    vectorMin(filtro) {
        switch (filtro) {
            case "municipio":
                this.preciosMediaMunicipio = [];
                for (let dato of this.municipios) {
                    this.preciosMediaMunicipio.push({
                        nombre: dato.nombre,
                        media: this.getMin(dato.nombre, filtro)
                    })
                }
                this.preciosMediaMunicipio.sort((n1, n2) => n1.media - n2.media);
                break;
            case "distrito":
                this.preciosMediaDistrito = [];
                for (let dato of this.distritos) {
                    this.preciosMediaDistrito.push({
                        nombre: dato.nombre,
                        media: this.getMin(dato.nombre, filtro)
                    })
                }
                this.preciosMediaDistrito.sort((n1, n2) => n1.media - n2.media);
                break;
            case "otb":
                this.preciosMediaOtb = [];
                for (let dato of this.otbs) {
                    this.preciosMediaOtb.push({
                        nombre: dato.nombre,
                        media: this.getMin(dato.nombre, filtro),
                        moda: 0
                    })
                }
                this.preciosMediaOtb.sort((n1, n2) => n1.media - n2.media);
                break;
        }

    }


    getMedia(variable, filtro) {
        var media = 0;
        var quantity = 0;
        switch (filtro) {
            case "municipio":
                for (let aviso of this.av) {
                    if (aviso.municipio === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        media += aviso.precio;
                        quantity++;
                    }
                }
                if (quantity === 0) media = 0;
                else media = (media / quantity);
                break;
            case "distrito":
                for (let aviso of this.av) {
                    if (aviso.distrito === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        media += aviso.precio;
                        quantity++;
                    }
                }
                if (quantity === 0) media = 0;
                else media = (media / quantity);
                break;
            case "otb":
                for (let aviso of this.av) {
                    if (aviso.otb === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        media += aviso.precio;
                        quantity++;
                    }
                }
                if (quantity === 0) media = 0;
                else media = (media / quantity);
                break;
        }
        return media;
    }

    getMediana(variable, filtro) {
        var mediana = 0;
        var vector = [];
        var aux = 0;
        switch (filtro) {
            case "municipio":
                for (let aviso of this.av) {
                    if (aviso.municipio === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        vector.push({
                            precio: aviso.precio
                        });
                    }
                }
                vector.sort((n1, n2) => n1.precio - n2.precio);
                aux = Math.trunc(vector.length / 2)
                if (vector.length === 0) {
                    mediana = 0;
                } else if ((vector.length % 2) === 0)
                    mediana = (vector[aux - 1].precio + vector[aux].precio) / 2;
                else
                    mediana = vector[aux].precio;
                break;
            case "distrito":
                for (let aviso of this.av) {
                    if (aviso.distrito === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        vector.push({
                            precio: aviso.precio
                        });
                    }
                }
                vector.sort((n1, n2) => n1.precio - n2.precio);
                aux = Math.trunc(vector.length / 2)
                if (vector.length === 0) {
                    mediana = 0;
                } else if ((vector.length % 2) === 0)
                    mediana = (vector[aux - 1].precio + vector[aux].precio) / 2;
                else
                    mediana = vector[aux].precio;
                break;
            case "otb":
                for (let aviso of this.av) {
                    if (aviso.otb === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        vector.push({
                            precio: aviso.precio
                        });
                    }
                }
                vector.sort((n1, n2) => n1.precio - n2.precio);
                aux = Math.trunc(vector.length / 2)
                if (vector.length === 0) {
                    mediana = 0;
                } else if ((vector.length % 2) === 0)
                    mediana = (vector[aux - 1].precio + vector[aux].precio) / 2;
                else
                    mediana = vector[aux].precio;
                break;
        }
        return mediana;
    }

    getMax(variable, filtro) {
        var max = 0;
        switch (filtro) {
            case "municipio":
                for (let aviso of this.av) {
                    if (aviso.municipio === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        if (aviso.precio > max)
                            max = aviso.precio;
                    }
                }
                break;
            case "distrito":
                for (let aviso of this.av) {
                    if (aviso.distrito === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        if (aviso.precio > max)
                            max = aviso.precio;
                    }
                }
                break;
            case "otb":
                for (let aviso of this.av) {
                    if (aviso.otb === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        if (aviso.precio > max)
                            max = aviso.precio;
                    }
                }
        }
        return max;
    }

    getMin(variable, filtro) {
        var min = 0;

        switch (filtro) {
            case "municipio":
                for (let aviso of this.av) {
                    if (aviso.municipio === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        min = aviso.precio;
                        break;
                    }
                }
                for (let aviso of this.av) {
                    if (aviso.municipio === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        if (aviso.precio < min)
                            min = aviso.precio;
                    }
                }
                break;
            case "distrito":
                for (let aviso of this.av) {
                    if (aviso.distrito === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        min = aviso.precio;
                        break;
                    }
                }
                for (let aviso of this.av) {
                    if (aviso.distrito === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        if (aviso.precio < min)
                            min = aviso.precio;
                    }
                }
                break;
            case "otb":
                for (let aviso of this.av) {
                    if (aviso.otb === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        min = aviso.precio;
                        break;
                    }
                }
                for (let aviso of this.av) {
                    if (aviso.otb === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        if (aviso.precio < min)
                            min = aviso.precio;
                    }
                }
        }
        return min;
    }

    getModa(variable, filtro) {
        var moda = 0;
        var count = 0;
        var counter = 0;
        var vector = [];
        var moda2 = 0;
        switch (filtro) {
            case "municipio":
                for (let aviso of this.av) {
                    if (aviso.municipio === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        vector.push({
                            precio: aviso.precio
                        });
                    }
                }

                for (let element of vector) {
                    moda2 = element.precio
                    for (let dato of vector) {
                        if (dato.precio === moda2) {
                            count++;
                        }
                    }
                    if (count > counter) {
                        counter = count;
                        moda = moda2;
                    }
                }
                break;
            case "distrito":
                for (let aviso of this.av) {
                    if (aviso.distrito === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        vector.push({
                            precio: aviso.precio
                        });
                    }
                }

                for (let element of vector) {
                    moda2 = element.precio
                    for (let dato of vector) {
                        if (dato.precio === moda2) {
                            count++;
                        }
                    }
                    if (count > counter) {
                        counter = count;
                        moda = moda2;
                    }
                }
                break;
            case "otb":
                for (let aviso of this.av) {
                    if (aviso.otb === variable && aviso.tipo === this.filtrotipo && aviso.seccion === this.filtrosec) {
                        vector.push({
                            precio: aviso.precio
                        });
                    }
                }

                for (let element of vector) {
                    moda2 = element.precio
                    for (let dato of vector) {
                        if (dato.precio === moda2) {
                            count++;
                        }
                    }
                    if (count > counter) {
                        counter = count;
                        moda = moda2;
                    }
                }
        }
        return moda;
    }


    //    Metodo para controlar los botones de radio, Global, Distritos, Otb's
    radioButtonChange(event) {
        var id = event.target.id;
        console.log(id);
        if (id === 'otbs') {
            this.otbsFlag = true;
            this.distritosFlag = false;
            this.filtro = 'otb';
        } else if (id === 'distritos') {
            this.distritosFlag = true;
            this.otbsFlag = false;
            this.filtro = 'distrito';
        } else {
            this.otbsFlag = false;
            this.distritosFlag = false;
            this.filtro = 'municipio';
        }
    }

    setestadistica(event) {
        var id = event.target.id;
        this.setall(id);
    }

    setall(id) {
        switch (id) {
            case "Media":
                this.vectorMedia("municipio");
                this.vectorMedia("distrito");
                this.vectorMedia("otb");
                this.opcion = "Media";
                break;
            case "Moda":
                this.vectorModa("municipio");
                this.vectorModa("distrito");
                this.vectorModa("otb");
                this.opcion = "Moda";
                break;
            case "Mediana":
                this.vectorMediana("municipio");
                this.vectorMediana("distrito");
                this.vectorMediana("otb");
                this.opcion = "Mediana";
                break;
            case "Valor maximo":
                this.vectorMax("municipio");
                this.vectorMax("distrito");
                this.vectorMax("otb");
                this.opcion = "Valor maximo";
                break;
            case "Valor minimo":
                this.vectorMin("municipio");
                this.vectorMin("distrito");
                this.vectorMin("otb");
                this.opcion = "Valor minimo";
                break;
        }
        this.setIntensidades(this.otbs, this.preciosMediaOtb);
        this.setIntensidades(this.distritos, this.preciosMediaDistrito);
        this.setIntensidades(this.municipios, this.preciosMediaMunicipio);
    }

    settipo(event) {
        var id = event.target.id;
        switch (id) {
            case "alquiler":
                this.filtrotipo = "alquiler";
                break;
            case "venta":
                this.filtrotipo = "venta";
                break;
            case "anti":
                this.filtrotipo = "anticretico";
                break;
        }
        this.setall(this.opcion);
    }

    setseccion(event) {
        var id = event.target.id;
        switch (id) {
            case "casa":
                this.filtrosec = "casa";
                break;
            case "dept":
                this.filtrosec = "departamento";
                break;
            case "lote":
                this.filtrosec = "lote";
                break;
            case "local":
                this.filtrosec = "local_comercial";
                break;
        }
        this.setall(this.opcion);
    }
    clicked(nombre) {
        switch (this.filtro) {
            case "municipio":
                for (let element of this.preciosMediaMunicipio) {
                    if (element.nombre === nombre)
                        this.mediafiltrada = element.media;
                    this.variablefiltrada = nombre;
                }
                break;
            case "distrito":
                for (let element of this.preciosMediaDistrito) {
                    if (element.nombre === nombre)
                        this.mediafiltrada = element.media;
                    this.variablefiltrada = nombre;
                }
                break;
            case "otb":
                for (let element of this.preciosMediaOtb) {
                    if (element.nombre === nombre)
                        this.mediafiltrada = element.media;
                    this.variablefiltrada = nombre;
                }
                break;
        }
    }
    click(event) { }

    onDateChange(event:Event):void {
        
        this.av=[];
        this._dataService.getAvisosM(this.year,this.month)
          .subscribe(response => {
            var datos = <Array<any>>response;
            for (let dato of datos) {
              this.av.push({
                precio: dato.precio,
                seccion: dato.seccion,
                tipo: dato.tipo,
                municipio: dato.municipio,
                distrito: dato.distrito,
                otb: dato.otb,
                dia: dato.dia,
                mes: dato.mes,
                year: dato.year
              });
            }
            console.log('avisos:', this.av);
            this.setall(this.opcion);
          },
            error => {
              console.log(error);
            });
      }
}
