import { Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../../auth/services/auth.service';

import { ROLE_NAMES } from '../../../shared/constants';
import { Roles, User } from '../../../shared/models';


@Component({
  template: `
    <p-toast/>
    <p-confirmDialog/>
    
    <body>
      <aside>
          <header>
              <h1>{{ user()?.fullname }}</h1>
              <h5>{{ ROLE_NAMES.get(user()?.role || '') }}</h5>
          </header>
          <hr>
          <p-menu [model]="items" styleClass="menu"/>
      </aside>
      
      <main>
          <router-outlet/>
      </main>
    </body>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  readonly ROLE_NAMES = ROLE_NAMES


  private authService = inject(AuthService)


  private _isRestricted = computed<boolean>(() => this.authService.currentUser()?.role === Roles.User)
  
  user = computed<User|null>(() => this.authService.currentUser())

  items: MenuItem[] = [
    {
      label: 'Usuarios',
      icon: 'pi pi-fw pi-users',
      routerLink: '/users',
      disabled: this._isRestricted()
    },
    {
      label: 'Equipos',
      icon: 'pi pi-fw pi-sitemap',
      routerLink: '/teams',
      disabled: this._isRestricted()
    },
    {
      label: 'Cuentas',
      icon: 'pi pi-fw pi-star',
      routerLink: '/accounts',
      disabled: this._isRestricted()
    },
    { separator: true },
    {
      label: 'Mi usuario',
      icon: 'pi pi-fw pi-user',
      routerLink: '/profile'
    },
    { separator: true },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-power-off',
      command: () => this.authService.logout()
    }
  ];
  
}
