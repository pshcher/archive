import { NgModule } from '@angular/core';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { PendingOrdersComponent } from './pending-orders/pending-orders.component';
import { SharedModule } from '../shared.module';
import { NewOrderComponent } from './new-order/new-order.component';
import { EditComboComponent } from '../helpers/components/controls/edit-combo/edit-combo.component';
import { ForbiddenValidatorDirective } from '../helpers/directives/forbidden-name.directive';
import { requireVisibleValidatorDirective } from '../helpers/directives/required-visible.directive';
import { CustomInputComponent } from '../helpers/components/controls/InputField';
import { CustomCheckoutComponent } from '../helpers/components/controls/custom-checkout/custom-checkout.component';

@NgModule({
  declarations: [    ForbiddenValidatorDirective, //RequiredVisibleDirective,
    requireVisibleValidatorDirective, 
    CustomInputComponent,
    NewOrderComponent, OrdersComponent, PendingOrdersComponent, EditComboComponent, CustomCheckoutComponent],
  imports: [
    SharedModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
