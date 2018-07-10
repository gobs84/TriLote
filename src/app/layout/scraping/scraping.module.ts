import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { ScrapingRoutingModule } from './scraping-routing.module';
import { ScrapingComponent } from './scraping.component';

@NgModule({
  imports: [
    CommonModule,
    ScrapingRoutingModule,
    HttpModule
  ],
  declarations: [ScrapingComponent]
})
export class ScrapingModule { }
