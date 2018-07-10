import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuienesSomosComponent } from './quienes-somos.component';
const routes: Routes = [
	{
        path: '',
        component: QuienesSomosComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuienesSomosRoutingModule { }
