import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PrimengModule } from '../shared/primeng.module';
import { CoreRoutingModule } from './core-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { AccDetailComponent } from './components/acc-detail/acc-detail.component';

import { ErrorCheckerDirective } from '../shared/directives/error-checker.directive';



@NgModule({
  declarations: [
    HomeComponent,
    UsersComponent,
    AccountsComponent,
    TeamsComponent,
    UserDetailComponent,
    AccDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimengModule,
    CoreRoutingModule,
    ErrorCheckerDirective,
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class CoreModule { }
