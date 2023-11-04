import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../shared/primeng.module';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthComponent } from './pages/auth/auth.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
