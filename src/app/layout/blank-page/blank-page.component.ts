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
    showMenu: string = '';
//    Variables para estadisticas con todos los datos
    items = [];
    precios = [];
    global: Estadistica;
    preciosAlquilerGlobal = [];
    preciosVentaGlobal = [];
    preciosAnticreticoGlobal = [];
    alquilerGlobal: Estadistica;
    ventaGlobal: Estadistica;
    anticreticoGlobal: Estadistica;
//    Variables para estadisticas con los datos de los lotes
    itemsLote = [];
    preciosLote = [];
    lotes: Estadistica;
    preciosAlquilerLotes = [];
    preciosVentaLotes = [];
    preciosAnticreticoLotes = [];
    alquilerLote: Estadistica;
    ventaLote: Estadistica;
    anticreticoLote: Estadistica;
//    Variables para estadisticas con los datos de los departamentos
    itemsDepartamento = [];
    preciosDepartamento = [];
    departamentos: Estadistica;
    preciosAlquilerDepartamentos = [];
    preciosVentaDepartamentos = [];
    preciosAnticreticoDepartamentos = [];
    alquilerDepartamento: Estadistica;
    ventaDepartamento: Estadistica;
    anticreticoDepartamento: Estadistica;
//    Variables para estadisticas con los datos de las casas
    itemsCasa = [];
    preciosCasa = [];
    casas: Estadistica;
    preciosAlquilerCasas = [];
    preciosVentaCasas = [];
    preciosAnticreticoCasas = [];
    alquilerCasa: Estadistica;
    ventaCasa: Estadistica;
    anticreticoCasa: Estadistica;
//    Variables para estadisticas con los datos de los locales comerciales
    itemsLocal = [];
    preciosLocal = [];
    locales: Estadistica;
    preciosAlquilerLocales = [];
    preciosVentaLocales = [];
    preciosAnticreticoLocales = [];
    alquilerLocal: Estadistica;
    ventaLocal: Estadistica;
    anticreticoLocal: Estadistica;
//    Variables iniciales para el grafico de barras
    public barChartOptions: any = { scaleShowVerticalLines: false, responsive: true };
    public barChartLabels: string[] = ['Media','Moda','Mediana','Rango'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartData: any[] = [ { data: [65, 59, 80, 81], label: 'Precios($)' } ];
//    Variables iniciales para el grafico de radar
    public radarChartLabels: string[] = ['Media','Moda','Mediana','Rango'];
    public radarChartData: any = [ { data: [65, 59, 90, 81], label: 'Precios($)' } ];
    public radarChartType: string = 'radar';
//    Variables iniciales para el graficos de pie
    public pieChartLabels: string[] = ['Lotes','Departamentos','Casas','Locales'];
    public pieChartData: number[] = [0,0,0,0];
    public pieChartType: string = 'pie';
//    Variables iniciales para el grafico del polar pie
    public polarAreaChartLabels: string[] = ['Lotes','Departamentos','Casas','Locales'];
    public polarAreaChartData: number[] = [0,0,0,0];
    public polarAreaLegend: boolean = true;
    public polarAreaChartType: string = 'polarArea';

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    onMouseOver(infoWindow, gm) {
        if (gm.lastOpen != null) {
            gm.lastOpen.close();
        }
        gm.lastOpen = infoWindow;
        infoWindow.open();
    }
//    Metodo para ordenar una lista de datos de menor a mayor
    ordenarLista(datos: any) {
        var resultado: any;
        resultado = datos.sort((n1,n2) => n1 - n2);
        return resultado;
    }
//    Metodo para calcular la moda de un arreglo de datos
     calcularModa(datos: any){
         //iniciamos las variables necesarias en todo el codigo
         var moda, moda2;
         var contador = 0, contador2 = 0;
         //Recorremos los datos
         for (var x=0; x<datos.length; x++){
             //Miramos que el numero cogido no sea el de la moda
             if(datos[x] != moda){
                 var contadorReinicia=0;
                 //Recorremos la array para encontrar concordancias on el numero sacado de la array de X
                 for(var i=0; i<datos.length; i++){
                     //cunado el numero sea igual al de la array de x le añadimos 1 al contador
                     if (datos[i] == datos[x]) contadorReinicia++;
                 }
                 //si el contador que se reinicia nos da mas alto que el contador general añadimos el numero a la variable moda y cambiamos el contador general por el que reinicia
                 if (contadorReinicia>contador){
                     contador = contadorReinicia;
                     moda = datos[x];
                 }
             }
         }
         //Miramos que no hayan 2 con la misma cantidad
         for ( var x=0; x<datos.length; x++ ){
             //Miramos que el numero cogido no sea el de la moda
             if(datos[x] != moda && datos[x] != moda2){
                 var contadorReinicia=0;
                 //Recorremos la array para encontrar concordancias on el numero sacado de la array de X
                 for(var i=0; i<datos.length; i++){
                     //cunado el numero sea igual al de la array de x le añadimos 1 al contador
                     if (datos[i] == datos[x]) contadorReinicia++;
                 }
                 //si el contador que se reinicia nos da mas alto que el contador general añadimos el numero a la variable moda y cambiamos el contador general por el que reinicia
                 if (contadorReinicia>contador2){
                     contador2 = contadorReinicia;
                     moda2 = datos[x];
                 }
                 //Si tenemos 2 de la misma cantidad retornamos -1
                 if (contador2 == contador) return -1;
             }
         }
         //Retornamos la moda!!!
         return moda;
     }
//    Metodo para calcular la Media de un arreglo de datos
    calcularMedia(datos: any) {
        var resultado: number = 0;
        for(let item of datos) {
            resultado += item;
            console.log(item);
        }
        resultado = resultado / datos.length;
        return resultado;
    }
// Metodo para calcular la Mediana de un arreglo de datos
    calcularMediana(datos: any) {
        var resultado,aux: number = 0;
        aux = Math.trunc(datos.length/2);
        console.log(aux);
        if(datos.length%2 == 0) {
            console.log("par");
            resultado = (datos[aux-1] + datos[aux])/2;
        }else {
            console.log("impar");
            resultado = datos[aux];
        }
        return resultado;
    }
//    Metodo para calcular el rango de un arreglo de datos
    calcularRango(datos: any) {
        var resultado: number = 0;
        resultado = datos[datos.length-1] - datos[0];
        return resultado;
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
     statisticsFlag: boolean = false;
    constructor(private _dataService: DataService) { }
    click(event){
        //    Evento para el mapa.....
    }
//    Funciona como un constructor para angular, obtenemos los datos del server mediante un observable(subscribe)
//    aprovechando la obtencion de los datos, realizamos la reparticion al resto de nuestras variables con los datos de interes
    ngOnInit() {
        this._dataService.getUsers()
        .subscribe(response => {
            this.items = response['data'];
            console.log('Servicio:', this.items);
            for(let item of this.items) {
                this.precios.push(item.precio);
                if(item.seccion === "casa") {
                    this.itemsCasa.push(item);
                    this.preciosCasa.push(item.precio);
                }else if (item.seccion === "departamento") {
                    this.itemsDepartamento.push(item);
                    this.preciosDepartamento.push(item.precio);
                }else if (item.seccion === "lote") {
                    this.itemsLote.push(item);
                    this.preciosLote.push(item.precio);
                }else {
                    this.itemsLocal.push(item);
                    this.preciosLocal.push(item.precio);
                }
            }
            this.preciosCasa = this.ordenarLista(this.preciosCasa);
            this.preciosDepartamento = this.ordenarLista(this.preciosDepartamento);
            this.preciosLocal = this.ordenarLista(this.preciosLocal);
            this.preciosLote = this.ordenarLista(this.preciosLote);
            this.precios = this.ordenarLista(this.precios);
        },
        error => {
            console.log(error);
        });
    }
//    Metodo para controlar los botones de radio, Global, Distritos, Otb's
    radioButtonChange(event) {
        var id = event.target.id;
        console.log(id);
        if(id === 'otbs') {
            this.otbsFlag = true;
            this.distritosFlag = false;
        }else if(id === 'distritos') {
            this.distritosFlag = true;
            this.otbsFlag = false;
        }else {
            this.otbsFlag = false;
            this.distritosFlag = false;
        }
    }
//    Metodo encargado de cargar todos los datos a las graficas y de contener los metodos de los calculos
    cargarDatos() {
        this.calcularEstadisticas();
        this.statisticsFlag = true;
        this.cargarGraficaPie(this.itemsLote,this.itemsDepartamento,this.itemsCasa,this.itemsLocal);
        this.cargarGraficaArea(this.itemsLote,this.itemsDepartamento,this.itemsCasa,this.itemsLocal);
        this.cargarGraficaRadar(this.global);
        this.cargarGraficaBarras(this.global);
    }
//    Calculamos los datos estadisticos y los almacenamos en objetos tipo estadistico
    calcularEstadisticas() {
        this.global = { media: this.calcularMedia(this.precios),
                        moda: this.calcularModa(this.precios),
                        mediana: this.calcularMediana(this.precios),
                        rango: this.calcularRango(this.precios)};
        this.casas = { media: this.calcularMedia(this.preciosCasa),
                        moda: this.calcularModa(this.preciosCasa),
                        mediana: this.calcularMediana(this.preciosCasa),
                        rango: this.calcularRango(this.preciosCasa)};
        this.departamentos = { media: this.calcularMedia(this.preciosDepartamento),
                        moda: this.calcularModa(this.preciosDepartamento),
                        mediana: this.calcularMediana(this.preciosDepartamento),
                        rango: this.calcularRango(this.preciosDepartamento)};
        this.locales = { media: this.calcularMedia(this.preciosLocal),
                        moda: this.calcularModa(this.preciosLocal),
                        mediana: this.calcularMediana(this.preciosLocal),
                        rango: this.calcularRango(this.preciosLocal)};
        this.lotes = { media: this.calcularMedia(this.preciosLote),
                        moda: this.calcularModa(this.preciosLote),
                        mediana: this.calcularMediana(this.preciosLote),
                        rango: this.calcularRango(this.preciosLote)};
        this.calculoTipoTransaccionGlobal();
        this.calculoTipoTransaccionCasas();
        this.calculoTipoTransaccionDepartamentos();
        this.calculoTipoTransaccionLotes();
        this.calculoTipoTransaccionLocales();
    }
//    Obtencion de los precios globales por tipo: alquiler,venta,anticretico. Calculo y carga de variables para uso general
    calculoTipoTransaccionGlobal() {
        for(let item of this.items) {
            if(item.tipo === "alquiler"){
                this.preciosAlquilerGlobal.push(item.precio);
            }else if(item.tipo === "venta") {
                this.preciosVentaGlobal.push(item.precio);
            }else {
                this.preciosAnticreticoGlobal.push(item.precio);
            }
        }
        this.preciosAlquilerGlobal = this.ordenarLista(this.preciosAlquilerGlobal);
        this.preciosVentaGlobal = this.ordenarLista(this.preciosVentaGlobal);
        this.preciosAnticreticoGlobal = this.ordenarLista(this.preciosAnticreticoGlobal);

        this.alquilerGlobal = { media: this.calcularMedia(this.preciosAlquilerGlobal),
                                moda: this.calcularModa(this.preciosAlquilerGlobal),
                                mediana: this.calcularMediana(this.preciosAlquilerGlobal),
                                rango: this.calcularRango(this.preciosAlquilerGlobal)};
        this.ventaGlobal = { media: this.calcularMedia(this.preciosVentaGlobal),
                            moda: this.calcularModa(this.preciosVentaGlobal),
                            mediana: this.calcularMediana(this.preciosVentaGlobal),
                            rango: this.calcularRango(this.preciosVentaGlobal)};
        this.anticreticoGlobal = { media: this.calcularMedia(this.preciosAnticreticoGlobal),
                                    moda: this.calcularModa(this.preciosAnticreticoGlobal),
                                    mediana: this.calcularMediana(this.preciosAnticreticoGlobal),
                                    rango: this.calcularRango(this.preciosAnticreticoGlobal)};
    }
//    Obtencion de los precios de casas por tipo: alquiler,venta,anticretico. Calculo y carga de variables para uso general
    calculoTipoTransaccionCasas() {
        for(let item of this.itemsCasa) {
            if(item.tipo === "alquiler"){
                this.preciosAlquilerCasas.push(item.precio);
            }else if(item.tipo === "venta") {
                this.preciosVentaCasas.push(item.precio);
            }else {
                this.preciosAnticreticoCasas.push(item.precio);
            }
        }
        this.preciosAlquilerCasas = this.ordenarLista(this.preciosAlquilerCasas);
        this.preciosVentaCasas = this.ordenarLista(this.preciosVentaCasas);
        this.preciosAnticreticoCasas = this.ordenarLista(this.preciosAnticreticoCasas);

        this.alquilerCasa= { media: this.calcularMedia(this.preciosAlquilerCasas),
                                moda: this.calcularModa(this.preciosAlquilerCasas),
                                mediana: this.calcularMediana(this.preciosAlquilerCasas),
                                rango: this.calcularRango(this.preciosAlquilerCasas)};
        this.ventaCasa = { media: this.calcularMedia(this.preciosVentaCasas),
                            moda: this.calcularModa(this.preciosVentaCasas),
                            mediana: this.calcularMediana(this.preciosVentaCasas),
                            rango: this.calcularRango(this.preciosVentaCasas)};
        this.anticreticoCasa = { media: this.calcularMedia(this.preciosAnticreticoCasas),
                                    moda: this.calcularModa(this.preciosAnticreticoCasas),
                                    mediana: this.calcularMediana(this.preciosAnticreticoCasas),
                                    rango: this.calcularRango(this.preciosAnticreticoCasas)};
    }
//    Obtencion de los precios de departamentos por tipo: alquiler,venta,anticretico. Calculo y carga de variables para uso general
    calculoTipoTransaccionDepartamentos() {
        for(let item of this.itemsDepartamento) {
            if(item.tipo === "alquiler"){
                this.preciosAlquilerDepartamentos.push(item.precio);
            }else if(item.tipo === "venta") {
                this.preciosVentaDepartamentos.push(item.precio);
            }else {
                this.preciosAnticreticoDepartamentos.push(item.precio);
            }
        }
        this.preciosAlquilerDepartamentos = this.ordenarLista(this.preciosAlquilerDepartamentos);
        this.preciosVentaDepartamentos = this.ordenarLista(this.preciosVentaDepartamentos);
        this.preciosAnticreticoDepartamentos = this.ordenarLista(this.preciosAnticreticoDepartamentos);

        this.alquilerDepartamento = { media: this.calcularMedia(this.preciosAlquilerDepartamentos),
                                    moda: this.calcularModa(this.preciosAlquilerDepartamentos),
                                    mediana: this.calcularMediana(this.preciosAlquilerDepartamentos),
                                    rango: this.calcularRango(this.preciosAlquilerDepartamentos)};
        this.ventaDepartamento = { media: this.calcularMedia(this.preciosVentaDepartamentos),
                                    moda: this.calcularModa(this.preciosVentaDepartamentos),
                                    mediana: this.calcularMediana(this.preciosVentaDepartamentos),
                                    rango: this.calcularRango(this.preciosVentaDepartamentos)};
        this.anticreticoDepartamento = { media: this.calcularMedia(this.preciosAnticreticoDepartamentos),
                                    moda: this.calcularModa(this.preciosAnticreticoDepartamentos),
                                    mediana: this.calcularMediana(this.preciosAnticreticoDepartamentos),
                                    rango: this.calcularRango(this.preciosAnticreticoDepartamentos)};
    }
//    Obtencion de los precios de lotes por tipo: alquiler,venta,anticretico. Calculo y carga de variables para uso general
    calculoTipoTransaccionLotes() {
        for(let item of this.itemsLote) {
            if(item.tipo === "alquiler"){
                this.preciosAlquilerLotes.push(item.precio);
            }else if(item.tipo === "venta") {
                this.preciosVentaLotes.push(item.precio);
            }else {
                this.preciosAnticreticoLotes.push(item.precio);
            }
        }
        this.preciosAlquilerLotes = this.ordenarLista(this.preciosAlquilerLotes);
        this.preciosVentaLotes = this.ordenarLista(this.preciosVentaLotes);
        this.preciosAnticreticoLotes = this.ordenarLista(this.preciosAnticreticoLotes);

        this.alquilerLote = { media: this.calcularMedia(this.preciosAlquilerLotes),
                                moda: this.calcularModa(this.preciosAlquilerLotes),
                                mediana: this.calcularMediana(this.preciosAlquilerLotes),
                                rango: this.calcularRango(this.preciosAlquilerLotes)};
        this.ventaLote = { media: this.calcularMedia(this.preciosVentaLotes),
                            moda: this.calcularModa(this.preciosVentaLotes),
                            mediana: this.calcularMediana(this.preciosVentaLotes),
                            rango: this.calcularRango(this.preciosVentaLotes)};
        this.anticreticoLote = { media: this.calcularMedia(this.preciosAnticreticoLotes),
                                    moda: this.calcularModa(this.preciosAnticreticoLotes),
                                    mediana: this.calcularMediana(this.preciosAnticreticoLotes),
                                    rango: this.calcularRango(this.preciosAnticreticoLotes)};
    }
//    Obtencion de los precios de locales comerciales por tipo: alquiler,venta,anticretico. Calculo y carga de variables para uso general
    calculoTipoTransaccionLocales() {
        for(let item of this.itemsLocal) {
            if(item.tipo === "alquiler"){
                this.preciosAlquilerLocales.push(item.precio);
            }else if(item.tipo === "venta") {
                this.preciosVentaLocales.push(item.precio);
            }else {
                this.preciosAnticreticoLocales.push(item.precio);
            }
        }
        this.preciosAlquilerLocales = this.ordenarLista(this.preciosAlquilerLocales);
        this.preciosVentaLocales = this.ordenarLista(this.preciosVentaLocales);
        this.preciosAnticreticoLocales = this.ordenarLista(this.preciosAnticreticoLocales);

        this.alquilerLocal = { media: this.calcularMedia(this.preciosAlquilerLocales),
                                moda: this.calcularModa(this.preciosAlquilerLocales),
                                mediana: this.calcularMediana(this.preciosAlquilerLocales),
                                rango: this.calcularRango(this.preciosAlquilerLocales)};
        this.ventaLocal = { media: this.calcularMedia(this.preciosVentaLocales),
                            moda: this.calcularModa(this.preciosVentaLocales),
                            mediana: this.calcularMediana(this.preciosVentaLocales),
                            rango: this.calcularRango(this.preciosVentaLocales)};
        this.anticreticoLocal = { media: this.calcularMedia(this.preciosAnticreticoLocales),
                                    moda: this.calcularModa(this.preciosAnticreticoLocales),
                                    mediana: this.calcularMediana(this.preciosAnticreticoLocales),
                                    rango: this.calcularRango(this.preciosAnticreticoLocales)};
    }
//    Metodo para controlar los botones de radio del grafico de barras,
    radioButtonBarControl(event) {
        var id = event.target.id;
        console.log(id);
        if(id === 'localesB') {
            this.cargarGraficaBarras(this.locales);
        }else if(id === 'casasB') {
            this.cargarGraficaBarras(this.casas);
        }else if(id === 'departamentosB') {
            this.cargarGraficaBarras(this.departamentos);
        }else if(id === 'lotesB') {
            this.cargarGraficaBarras(this.lotes);
        }else if(id === 'localalqui') {
            this.cargarGraficaBarras(this.alquilerLocal);
        }else if(id === 'localventa') {
            this.cargarGraficaBarras(this.ventaLocal);
        }else if(id === 'localanti') {
            this.cargarGraficaBarras(this.anticreticoLocal);
        }else if(id === 'casaalqui') {
            this.cargarGraficaBarras(this.alquilerCasa);
        }else if(id === 'casaventa') {
            this.cargarGraficaBarras(this.ventaCasa);
        }else if(id === 'casaanti') {
            this.cargarGraficaBarras(this.anticreticoCasa);
        }else if(id === 'depaalqui') {
            this.cargarGraficaBarras(this.alquilerDepartamento);
        }else if(id === 'depaventa') {
            this.cargarGraficaBarras(this.ventaDepartamento);
        }else if(id === 'depaanti') {
            this.cargarGraficaBarras(this.anticreticoDepartamento);
        }else if(id === 'lotealqui') {
            this.cargarGraficaBarras(this.alquilerLote);
        }else if(id === 'loteventa') {
            this.cargarGraficaBarras(this.ventaLote);
        }else if(id === 'loteanti') {
            this.cargarGraficaBarras(this.anticreticoLote);
        }else {
            this.cargarGraficaBarras(this.global);
        }
    }
    cargarGraficaBarras(obj : Estadistica) {
        this.barChartData = [
        { data: [obj.media, obj.moda, obj.mediana, obj.rango], label: 'Precios($)' }
        ];
    }
//    Metodo para controlar los botones de radio del grafico de barras,
    radioButtonRadarControl(event) {
        var id = event.target.id;
        console.log(id);
        if(id === 'localesR') {
            this.cargarGraficaRadar(this.locales);
        }else if(id === 'casasR') {
            this.cargarGraficaRadar(this.casas);
        }else if(id === 'departamentosR') {
            this.cargarGraficaRadar(this.departamentos);
        }else if(id === 'lotesR') {
            this.cargarGraficaRadar(this.lotes);
        }else if(id === 'localalqui') {
            this.cargarGraficaRadar(this.alquilerLocal);
        }else if(id === 'localventa') {
            this.cargarGraficaRadar(this.ventaLocal);
        }else if(id === 'localanti') {
            this.cargarGraficaRadar(this.anticreticoLocal);
        }else if(id === 'casaalqui') {
            this.cargarGraficaRadar(this.alquilerCasa);
        }else if(id === 'casaventa') {
            this.cargarGraficaRadar(this.ventaCasa);
        }else if(id === 'casaanti') {
            this.cargarGraficaRadar(this.anticreticoCasa);
        }else if(id === 'depaalqui') {
            this.cargarGraficaRadar(this.alquilerDepartamento);
        }else if(id === 'depaventa') {
            this.cargarGraficaRadar(this.ventaDepartamento);
        }else if(id === 'depaanti') {
            this.cargarGraficaRadar(this.anticreticoDepartamento);
        }else if(id === 'lotealqui') {
            this.cargarGraficaRadar(this.alquilerLote);
        }else if(id === 'loteventa') {
            this.cargarGraficaRadar(this.ventaLote);
        }else if(id === 'loteanti') {
            this.cargarGraficaRadar(this.anticreticoLote);
        }else {
            this.cargarGraficaRadar(this.global);
        }
    }
    cargarGraficaRadar(obj : Estadistica) {
        this.radarChartData = [
        { data: [obj.media, obj.moda, obj.mediana, obj.rango], label: 'Precios($)' }
        ];
    }
//    Metodo para controlar los botones de radio del grafico de pie,
    radioButtonPieControl(event) {
        var id = event.target.id;
        console.log(id);
        if(id === 'alquilerG') {
            this.cargarGraficaPie(this.preciosAlquilerLotes,this.preciosAlquilerDepartamentos,this.preciosAlquilerCasas,this.preciosAlquilerLocales);
        }else if(id === 'ventaG') {
            this.cargarGraficaPie(this.preciosVentaLotes,this.preciosVentaDepartamentos,this.preciosVentaCasas,this.preciosVentaLocales);
        }else if(id === 'anticreticoG') {
            this.cargarGraficaPie(this.preciosAnticreticoLotes,this.preciosAnticreticoDepartamentos,this.preciosAnticreticoCasas,this.preciosAnticreticoLocales);
        }else {
            this.cargarGraficaPie(this.itemsLote,this.itemsDepartamento,this.itemsCasa,this.itemsLocal);
        }
    }
    cargarGraficaPie(lote : any, depa: any, casa: any, loca: any) {
        this.pieChartData = [lote.length,depa.length,casa.length,loca.length];
    }
//    Metodo para controlar los botones de radio del grafico de area
    radioButtonAreaControl(event) {
        var id = event.target.id;
        console.log(id);
        if(id === 'alquiler') {
            this.cargarGraficaArea(this.preciosAlquilerLotes,this.preciosAlquilerDepartamentos,this.preciosAlquilerCasas,this.preciosAlquilerLocales);
        }else if(id === 'venta') {
            this.cargarGraficaArea(this.preciosVentaLotes,this.preciosVentaDepartamentos,this.preciosVentaCasas,this.preciosVentaLocales);
        }else if(id === 'anticretico') {
            this.cargarGraficaArea(this.preciosAnticreticoLotes,this.preciosAnticreticoDepartamentos,this.preciosAnticreticoCasas,this.preciosAnticreticoLocales);
        }else {
            this.cargarGraficaArea(this.itemsLote,this.itemsDepartamento,this.itemsCasa,this.itemsLocal);
        }
    }
    cargarGraficaArea(lote : any, depa: any, casa: any, loca: any) {
        this.polarAreaChartData = [lote.length,depa.length,casa.length,loca.length];
    }
}

//Interfaz para tener variable con estas caracteristicas
interface Estadistica {
    media: number; 
    moda: number;
    mediana: number;
    rango: number;
}