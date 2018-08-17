import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsPageRoutingModule } from './statistics-page-routing.module';
import { StatisticsPageComponent } from './statistics-page.component';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    StatisticsPageRoutingModule,
    Ng2Charts
  ],
  declarations: [StatisticsPageComponent]
})
export class StatisticsPageModule { }
