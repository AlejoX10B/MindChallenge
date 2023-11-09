import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';

import { hasRole } from './guards/roles.guard';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

import { Roles } from '../shared/models';


const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
    children: [
      {
        path: 'users',
        title: 'Usuarios',
        canActivate: [ hasRole([Roles.Super, Roles.Admin]) ],
        component: UsersComponent
      },
      {
        path: 'users/add',
        title: 'Crear usuario',
        canActivate: [ hasRole([Roles.Super, Roles.Admin ])],
        component: UserDetailComponent
      },
      {
        path: 'user/:userId',
        title: 'Detalle de usuario',
        canActivate: [ hasRole([Roles.Super, Roles.Admin ])],
        component: UserDetailComponent
      },
      {
        path: 'accounts',
        title: 'Cuentas',
        canActivate: [ hasRole([Roles.Super, Roles.Admin]) ],
        component: AccountsComponent
      },
      {
        path: 'profile',
        title: 'Mi usuario',
        component: UserDetailComponent

      },
      { path: '**', redirectTo: 'users' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
})
export class CoreRoutingModule { }
