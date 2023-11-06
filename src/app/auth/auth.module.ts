import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng.module';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './pages/login/login.component';
import { ErrorCheckerDirective } from '../shared/directives/error-checker.directive';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    AuthRoutingModule,
    ErrorCheckerDirective
  ]
})
export class AuthModule { }
