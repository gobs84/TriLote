import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { MapPageRoutingModule } from './map-page-routing.module';
import { MapPageComponent } from './map-page.component';
import { AgmCoreModule } from '@agm/core';
import { KmlLayerManager } from '@agm/core';
import { GoogleMapsAPIWrapper  } from '@agm/core';
import { PageHeaderModule } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [CommonModule, MapPageRoutingModule,Ng2Charts,PageHeaderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB0JrpDZNJmHRd4YbrYOHOUdZsHL3QS-DU',
      libraries: ['geometry']
       
    }),
    FormsModule],
    providers: [GoogleMapsAPIWrapper],
    declarations: [MapPageComponent]
})
export class MapPageModule {}
