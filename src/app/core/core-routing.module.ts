import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { AccountsComponent } from './pages/accounts/accounts.component';


const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: '**', redirectTo: 'users' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
