import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-scraping',
  templateUrl: './scraping.component.html',
  styleUrls: ['./scraping.component.scss']
})
export class ScrapingComponent implements OnInit {

	items: Item;
	constructor(private _dataService: DataService) { 

	}

 	ngOnInit() {
 		this._dataService.getUsers()
 		.subscribe(response => {
  		this.items = response['data'];
	      console.log('Servicio:', this.items);
	      return this.items;
	  	},
	  	error => {
	  		console.log(error);
	  	});
  	}

}

interface Item {

latitud : number;
longitud : number;
precio : number; 
seccion : string; 
tipo : string; 

}
