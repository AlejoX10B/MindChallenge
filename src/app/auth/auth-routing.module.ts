import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';


const routes: Routes = [
  {
    path: '',
    title: 'Auth',
    component: AuthComponent,
    children: [
      { path: 'login', title: 'Iniciar sesión', component: LoginComponent },
      { path: 'signup', title: 'Registrarme', component: SignupComponent },
      { path: '**', redirectTo: 'login' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
