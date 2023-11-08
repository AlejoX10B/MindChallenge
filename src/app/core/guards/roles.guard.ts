import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../../auth/services/auth.service';

import { Roles } from '../../shared/models';


export function hasRole(allowedRoles: Roles[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService)
    const router = inject(Router)

    const currentUser = authService.currentUser()
  
    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true
    }
  
    return router.navigateByUrl('/profile')
  }
}
