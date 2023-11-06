import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../models';


export const isAuthenticatedGuard: CanActivateFn = () => {
  
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.authStatus() == AuthStatus.Authenticated) {
    return true
  }

  return router.navigateByUrl('/auth/login')
};

export const isNotLoggedGuard: CanActivateFn = () => {
  
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.authStatus() === AuthStatus.Authenticated) {
    router.navigateByUrl('')
    return false
  }

  return true
};