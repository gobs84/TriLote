import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponent } from './blank-page.component';
import { AgmCoreModule } from '@agm/core';
import { KmlLayerManager } from '@agm/core';
import { GoogleMapsAPIWrapper  } from '@agm/core';
import { PageHeaderModule } from '../../shared';
@NgModule({
    imports: [CommonModule, BlankPageRoutingModule,Ng2Charts,PageHeaderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB0JrpDZNJmHRd4YbrYOHOUdZsHL3QS-DU',
      libraries: ['geometry']
    })],
    providers: [GoogleMapsAPIWrapper],
    declarations: [BlankPageComponent]
})
export class BlankPageModule {}
