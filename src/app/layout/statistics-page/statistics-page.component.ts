import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { routerTransition } from '../../router.animations';
import { element } from 'protractor';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
  animations: [routerTransition()]
})
export class StatisticsPageComponent implements OnInit {
  dt = new Date;
  selectedOption1 = { name: "Quillacollo", media: 0, moda: 0, mediana: 0, minimo: 0, maximo: 0 };
  selectedOption2 = { name: "Quillacollo", media: 0, moda: 0, mediana: 0, minimo: 0, maximo: 0 };
  municipios = [];
  avisos = [];
  distritos = [];
  filtro = "municipio";
  filtrotipo = "alquiler";
  filtrosec = "casa";
  flagDist = false;
  year = this.dt.getFullYear();
  month = this.dt.getMonth() + 1;
  months = [{ nombre: "Enero", num: 1 }, { nombre: "Febrero", num: 2 }, { nombre: "Marzo", num: 3 }, { nombre: "Abril", num: 1 },
  { nombre: "Mayo", num: 5 }, { nombre: "Junio", num: 6 }, { nombre: "Julio", num: 7 }, { nombre: "Agosto", num: 8 },
  { nombre: "Septiembre", num: 9 }, { nombre: "Octubre", num: 10 }, { nombre: "Noviembre", num: 11 }, { nombre: "Diciembre", num: 12 }]
  years = [];
  //    Variables iniciales para el grafico de barras
  public barChartOptions: any = { scaleShowVerticalLines: false, responsive: true };
  public barChartLabels: string[] = ['Media', 'Moda', 'Mediana', 'Maximo', 'Minimo'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [{ data: [65, 59, 80, 81, 35], label: 'Precios($)' }];
  //    Variables iniciales para el grafico de radar
  public radarChartLabels: string[] = ['Media', 'Moda', 'Mediana', 'Maximo', 'Minimo'];
  public radarChartData: any = [{ data: [65, 59, 90, 81, 35], label: 'Precios($)' }];
  public radarChartType: string = 'radar';
  //    Variables iniciales para el graficos de pie
  public pieChartLabels: string[] = ['Lotes', 'Departamentos', 'Casas', 'Locales'];
  public pieChartData: number[] = [0, 0, 0, 0];
  public pieChartType: string = 'pie';
  //    Variables iniciales para el grafico del polar pie
  public polarAreaChartLabels: string[] = ['Lotes', 'Departamentos', 'Casas', 'Locales'];
  public polarAreaChartData: number[] = [0, 0, 0, 0];
  public polarAreaLegend: boolean = true;
  public polarAreaChartType: string = 'polarArea';

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  //    Metodo para ordenar una lista de datos de menor a mayor
  ordenarLista(datos: any) {
    var resultado: any;
    resultado = datos.sort((n1, n2) => n1 - n2);
    return resultado;
  }

  statisticsFlag: boolean = false;
  compareFlag: boolean = false;
  reportFlag: boolean = false;
  constructor(private _dataService: DataService) { }



  getMedia(variable, tipo, seccion) {
    var media = 0;
    var quantity = 0;
    switch (this.filtro) {
      case "municipio":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
            media += aviso.precio;
            quantity++;
          }
        }
        if (quantity === 0) media = 0;
        else media = (media / quantity);
        break;
      case "distrito":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
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

  getMediana(variable, tipo, seccion) {
    var mediana = 0;
    var vector = [];
    var aux = 0;
    switch (this.filtro) {
      case "municipio":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
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
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
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

  getMax(variable, tipo, seccion) {
    var max = 0;
    switch (this.filtro) {
      case "municipio":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
            if (aviso.precio > max)
              max = aviso.precio;
          }
        }
        break;
      case "distrito":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
            if (aviso.precio > max)
              max = aviso.precio;
          }
        }
        break;
    }
    return max;
  }

  getMin(variable, tipo, seccion) {
    var min = 0;
    switch (this.filtro) {
      case "municipio":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
            min = aviso.precio;
            break;
          }
        }
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
            if (aviso.precio < min)
              min = aviso.precio;
          }
        }
        break;
      case "distrito":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
            min = aviso.precio;
            break;
          }
        }
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
            if (aviso.precio < min)
              min = aviso.precio;
          }
        }
        break;
    }
    return min;
  }

  getModa(variable, tipo, seccion) {
    var moda = 0;
    var count = 0;
    var counter = 0;
    var vector = [];
    var moda2 = 0;
    switch (this.filtro) {
      case "municipio":
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
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
        for (let aviso of this.avisos) {
          if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
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
    }
    return moda;
  }

  radioButtonChange(event) {
    this.statisticsFlag = false;
    this.compareFlag = false;
    this.reportFlag = false;
    var id = event.target.id;
    console.log(id);
    if (id === 'distritos') {
      this.flagDist = true;
      this.filtro = 'distrito';
    } else {
      this.flagDist = false;
      this.filtro = 'municipio';
    }
  }

  settipo(event) {
    this.statisticsFlag = false;
    this.compareFlag = false;
    this.reportFlag = false;
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
  }

  setseccion(event) {
    this.statisticsFlag = false;
    this.compareFlag = false;
    this.reportFlag = false;
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
  }

  getCount(variable, tipo, seccion) {
    var count = 0;
    for (let aviso of this.avisos) {
      if (aviso.municipio === variable && aviso.tipo === tipo && aviso.seccion === seccion) {
        count++;
      }
    }
    return count;
  }

  ngOnInit() {
    for (let index = 0; index < 20; index++) {
      this.years.push(2018+index);
    }
    console.log('years: '+this.years)

    this._dataService.getAvisosM(this.year,this.month)
      .subscribe(response => {
        var datos = <Array<any>>response;
        for (let dato of datos) {
          this.avisos.push({
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
        console.log('avisos:', this.avisos);
      },
        error => {
          console.log(error);
        });

    this._dataService.getMunicipios()
      .subscribe(response => {
        var datos = <Array<any>>response;
        datos.sort((n1, n2) => n1.ID - n2.ID);
        var nombre = "";
        for (let dato of datos) {
          if (!(dato.NOM_MUN === nombre)) {
            nombre = dato.NOM_MUN;
            this.municipios.push({
              nombre: dato.NOM_MUN,
              media: 0,
              mediana: 0,
              moda: 0,
              minimo: 0,
              maximo: 0
            });
          }
        }
        console.log('municipios:', this.municipios);
      },
        error => {
          console.log(error);
        });

    this._dataService.getDistritos()
      .subscribe(response => {
        var datos = <Array<any>>response;
        datos.sort((n1, n2) => n1.ID - n2.ID);
        var nombre = "";
        for (let dato of datos) {
          if (!(dato.Nomb_dist === nombre)) {
            nombre = dato.Nomb_dist;
            this.distritos.push({
              nombre: dato.Nomb_dist,
              media: 0,
              mediana: 0,
              moda: 0,
              minimo: 0,
              maximo: 0
            });
          }
        }
        console.log('distritos:', this.distritos);
      },
        error => {
          console.log(error);
        });
  }

  cargarComparar() {
    this.compareFlag = true;
    this.selectedOption1.media = this.getMedia(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.mediana = this.getMediana(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.moda = this.getModa(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.maximo = this.getMax(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.minimo = this.getMin(this.selectedOption1.name, this.filtrotipo, this.filtrosec);

    this.selectedOption2.media = this.getMedia(this.selectedOption2.name, this.filtrotipo, this.filtrosec);
    this.selectedOption2.mediana = this.getMediana(this.selectedOption2.name, this.filtrotipo, this.filtrosec);
    this.selectedOption2.moda = this.getModa(this.selectedOption2.name, this.filtrotipo, this.filtrosec);
    this.selectedOption2.maximo = this.getMax(this.selectedOption2.name, this.filtrotipo, this.filtrosec);
    this.selectedOption2.minimo = this.getMin(this.selectedOption2.name, this.filtrotipo, this.filtrosec);
  }

  cargarReport() {
    this.reportFlag = true;
    if (this.flagDist) {
      for (let distrito of this.distritos) {
        distrito.media = this.getMedia(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.mediana = this.getMediana(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.moda = this.getModa(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.maximo = this.getMax(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.minimo = this.getMin(distrito.nombre, this.filtrotipo, this.filtrosec);
      }
    } else {
      for (let municipio of this.municipios) {
        municipio.media = this.getMedia(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.mediana = this.getMediana(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.moda = this.getModa(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.maximo = this.getMax(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.minimo = this.getMin(municipio.nombre, this.filtrotipo, this.filtrosec);
      }
    }
  }

  getaviYears(){
    this.avisos=[];
    this._dataService.getAvisos()
      .subscribe(response => {
        var datos = <Array<any>>response;
        for (let dato of datos) {
          this.avisos.push({
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
        console.log('avisos:', this.avisos);
        this.cargarReportY();
      },
        error => {
          console.log(error);
        });
  }

  cargarReportY() {
    this.reportFlag = true;
    if (this.flagDist) {
      for (let distrito of this.distritos) {
        distrito.media = this.getMedia(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.mediana = this.getMediana(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.moda = this.getModa(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.maximo = this.getMax(distrito.nombre, this.filtrotipo, this.filtrosec);
        distrito.minimo = this.getMin(distrito.nombre, this.filtrotipo, this.filtrosec);
      }
    } else {
      for (let municipio of this.municipios) {
        municipio.media = this.getMedia(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.mediana = this.getMediana(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.moda = this.getModa(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.maximo = this.getMax(municipio.nombre, this.filtrotipo, this.filtrosec);
        municipio.minimo = this.getMin(municipio.nombre, this.filtrotipo, this.filtrosec);
      }
    }
  }


  //    Metodo encargado de cargar todos los datos a las graficas y de contener los metodos de los calculos
  cargarDatos() {
    this.selectedOption1.media = this.getMedia(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.mediana = this.getMediana(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.moda = this.getModa(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.maximo = this.getMax(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.selectedOption1.minimo = this.getMin(this.selectedOption1.name, this.filtrotipo, this.filtrosec);
    this.statisticsFlag = !(this.statisticsFlag);
    this.barChartData = [
      { data: [this.selectedOption1.media, this.selectedOption1.moda, this.selectedOption1.mediana, this.selectedOption1.maximo, this.selectedOption1.minimo], label: 'Precios($)' }
    ];
    this.radarChartData = [
      { data: [this.selectedOption1.media, this.selectedOption1.moda, this.selectedOption1.mediana, this.selectedOption1.maximo, this.selectedOption1.minimo], label: 'Precios($)' }
    ];
    console.log(this.getCount(this.selectedOption1.name, this.filtrotipo, "casa"));
    this.pieChartData = [this.getCount(this.selectedOption1.name, this.filtrotipo, "lote"), this.getCount(this.selectedOption1.name, this.filtrotipo, "departamento"), this.getCount(this.selectedOption1.name, this.filtrotipo, "casa"), this.getCount(this.selectedOption1.name, this.filtrotipo, "local_comercial")];
    this.polarAreaChartData = [this.getCount(this.selectedOption1.name, this.filtrotipo, "lote"), this.getCount(this.selectedOption1.name, this.filtrotipo, "departamento"), this.getCount(this.selectedOption1.name, this.filtrotipo, "casa"), this.getCount(this.selectedOption1.name, this.filtrotipo, "local_comercial")];
  }

  onMonthChange(event:Event):void {
    this.avisos=[];
    this._dataService.getAvisosM(this.year,this.month)
      .subscribe(response => {
        var datos = <Array<any>>response;
        for (let dato of datos) {
          this.avisos.push({
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
        console.log('avisos:', this.avisos);
      },
        error => {
          console.log(error);
        });
  }

  onYearChange(event:Event):void {
    this.avisos=[];
    this._dataService.getAvisosM(this.year,this.month)
      .subscribe(response => {
        var datos = <Array<any>>response;
        for (let dato of datos) {
          this.avisos.push({
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
        console.log('avisos:', this.avisos);
      },
        error => {
          console.log(error);
        });
  }



}
