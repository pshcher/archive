import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared.module';
import { HttpErrorHandler } from './http-error-handler.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { MessageService } from './message.service';
import { AuthService } from './auth/auth.service';
import { ReportsComponent } from './reports/reports.component';
import { ConfirmDeleteComponent } from './helpers/components/overlay/confirm-delete/confirm-delete.component';
import { AdminService } from './admin/admin.service';
import { ConfirmConfirmComponent } from './helpers/components/overlay/confirm-confirm/confirm-confirm.component';
import { UpdateUserComponent } from './helpers/components/overlay/update-user/update-user.component';
import { AddUserComponent } from './helpers/components/overlay/add-user/add-user.component';
import { EditUserManagersComponent } from './helpers/components/overlay/edit-user-managers/edit-user-managers.component';
import { ProceedActionComponent } from './helpers/components/overlay/proceed-action/proceed-action.component';
import { ConfirmdlgService } from './confirmdlg.service';
import { AbandonActionComponent } from './helpers/components/overlay/abandon-action/abandon-action.component';
import { LoaderInterceptorService } from './loader-interceptor.service';
import { LoaderComponent } from './helpers/components/overlay/loader/loader.component';
import { LoaderService } from './loader.service';
import { EditComboComponent } from './helpers/components/controls/edit-combo/edit-combo.component';
import { ForbiddenValidatorDirective } from './helpers/directives/forbidden-name.directive';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { OrdersService } from './orders/orders.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  declarations: [
    AppComponent,
    // EditComboComponent,
    PageNotFoundComponent,
    ReportsComponent,
    ConfirmDeleteComponent,
    ConfirmConfirmComponent,
    UpdateUserComponent,
    AddUserComponent,
    EditUserManagersComponent,
    ProceedActionComponent,
    AbandonActionComponent,
    LoaderComponent
  ],
  entryComponents: [ConfirmDeleteComponent, ConfirmConfirmComponent,
    UpdateUserComponent, AddUserComponent, EditUserManagersComponent,
    ProceedActionComponent, AbandonActionComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    SharedModule,
    AppRoutingModule, 
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    HttpErrorHandler,
    AuthService,
    AdminService,
    MessageService,
    ConfirmdlgService,
    OrdersService,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
