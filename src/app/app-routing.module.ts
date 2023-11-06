import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { isAuthenticatedGuard, isNotLoggedGuard } from './auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'auth',
    canActivate: [ isNotLoggedGuard ],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    canActivate: [ isAuthenticatedGuard ],
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
  },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
