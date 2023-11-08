import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { hasRole } from './guards/roles.guard';

import { Roles } from '../shared/models';


const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
    children: [
      {
        path: 'users',
        canActivate: [ hasRole([Roles.Super, Roles.Admin]) ],
        component: UsersComponent
      },
      {
        path: 'accounts',
        canActivate: [ hasRole([Roles.Super, Roles.Admin]) ],
        component: AccountsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent

      },
      { path: '**', redirectTo: 'users' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
