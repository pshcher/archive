import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { ReportsComponent } from './reports/reports.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
  },
  {
    path: 'orders',
    loadChildren: './orders/orders.module#OrdersModule'
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        onSameUrlNavigation: 'reload',
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: PreloadAllModules //SelectivePreloadingStrategyService,
      }

    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
