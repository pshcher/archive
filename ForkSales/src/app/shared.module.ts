import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AllMaterialModule } from './material-module';
import { NavigationComponent } from './helpers/components/navigation/navigation.component';
import { LoginComponent } from './auth/login/login.component';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      RouterModule,
      AllMaterialModule
    ],
    declarations: [
      NavigationComponent
      ,LoginComponent
    ],
    exports: [
      NavigationComponent,
      LoginComponent,
      FormsModule,
      CommonModule,
      RouterModule,
      AllMaterialModule
    ]    
  })
  export class SharedModule {}