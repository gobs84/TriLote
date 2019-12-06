import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'map-page', loadChildren: './map-page/map-page.module#MapPageModule' },
            { path: 'quienes-somos', loadChildren: './quienes-somos/quienes-somos.module#QuienesSomosModule' },
            { path: 'statistics-page', loadChildren: './statistics-page/statistics-page.module#StatisticsPageModule' },
            { path: 'metodologia', loadChildren: './metodologia/metodologia.module#MetodologiaModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
