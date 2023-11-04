import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimengModule } from '../shared/primeng.module';
import { CoreRoutingModule } from './core-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { AccountsComponent } from './pages/accounts/accounts.component';


@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent,
    AccountsComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
