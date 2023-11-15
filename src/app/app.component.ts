import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

import { AuthService } from './auth/services/auth.service';

import { AuthStatus } from './auth/models';


@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Mind Challenge';

  private authService = inject(AuthService)
  private primengConfig = inject(PrimeNGConfig)
  private router = inject(Router)

  private _authStatus = computed(() => this.authService.authStatus())

  authStatusChanged = effect(() => {
    if (this._authStatus() === AuthStatus.NotAuthenticated) {
      this.router.navigateByUrl('/auth')
      return
    }
  })
  

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

}
