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
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'quienes-somos', loadChildren: './quienes-somos/quienes-somos.module#QuienesSomosModule' },
            { path: 'scraping', loadChildren: './scraping/scraping.module#ScrapingModule' },
            { path: 'statistics-page', loadChildren: './statistics-page/statistics-page.module#StatisticsPageModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
