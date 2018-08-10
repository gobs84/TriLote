import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import '../../rxjs/add/operator/map';
//import { Observable } from 'rxjs/Rx';

@Injectable()
export class DataService {

  result:any;

  constructor(private _http: HttpClient){ }

  getUsers() {
  	this.result = null;
  	return this._http.get("http://localhost:3000/api/users");

  	// return this.result;
    /*return this._http.get("http://localhost:3000/api/users")
      .map(result => this.result = result.json().data);*/
  }
  getMunicipios(){
    return this._http.get("http://localhost:3000/api/municipios");
  }
  getDistritos(){
    return this._http.get("http://localhost:3000/api/distritos");
  }
  getOtbs(){
    return this._http.get("http://localhost:3000/api/otbs")
  }

  getAvisos(){
    return this._http.get("http://localhost:3000/api/avisos");
  }


}
