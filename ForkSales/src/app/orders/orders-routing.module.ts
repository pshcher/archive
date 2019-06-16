import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuard } from '../auth/auth.guard';
import { NewOrderComponent } from './new-order/new-order.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
// 
// const routes: Routes = [
//     { path: 'neworder', component: NewOrderComponent, canActivate: [AuthGuard]},
//     { path: 'pendingorders', component: PendingOrdersComponent, canActivate: [AuthGuard]},
//     { path: '', redirectTo: 'neworder', pathMatch: 'full'}
// ];

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'neworder', component: NewOrderComponent },
          { path: 'pendingorders', component: PendingOrdersComponent },
          { path: '', redirectTo: 'neworder', pathMatch: 'full' },
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
