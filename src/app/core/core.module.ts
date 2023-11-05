import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../shared/primeng.module';
import { CoreRoutingModule } from './core-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { AddUserComponent } from './components/user-form/user-form.component';
import { ErrorCheckerDirective } from '../shared/directives/error-checker.directive';


@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent,
    AccountsComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    CoreRoutingModule,
    ErrorCheckerDirective
  ]
})
export class CoreModule { }
