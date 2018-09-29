import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetodologiaRoutingModule } from './metodologia-routing.module';
import { MetodologiaComponent } from './metodologia.component';

@NgModule({
  imports: [
    CommonModule,
    MetodologiaRoutingModule
  ],
  declarations: [MetodologiaComponent]
})
export class MetodologiaModule { }
