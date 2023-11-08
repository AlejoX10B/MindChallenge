import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../models';


export const isLoggedIn: CanActivateFn = () => {
  
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.authStatus() == AuthStatus.Authenticated) {
    return true
  }

  return router.navigateByUrl('/auth/login')
};

export const isNotLoggedIn: CanActivateFn = () => {
  
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.authStatus() === AuthStatus.Authenticated) {
    return router.navigateByUrl('/')
  }

  return true
};
