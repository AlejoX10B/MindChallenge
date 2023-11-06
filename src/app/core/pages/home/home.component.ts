import { Component, OnInit, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../../auth/services/auth.service';


@Component({
  template: `
    <body>
      <aside>
          <header>
              <h1>App</h1>
          </header>
          <hr>
          <p-menu [model]="items" styleClass="menu"/>
      </aside>
      
      <main>
          {{ user() | json }}
          <router-outlet/>
      </main>
    </body>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  private authService = inject(AuthService)


  items: MenuItem[] = [
    {
      label: 'Usuarios',
      icon: 'pi pi-fw pi-users',
      routerLink: '/users'
    },
    {
      label: 'Cuentas',
      icon: 'pi pi-fw pi-star',
      routerLink: '/accounts'
    },
    {
      label: 'Movimientos',
      icon: 'pi pi-fw pi-calendar',
      routerLink: '/'
    },
    {
      separator: true
    },
    {
      label: 'Mi usuario',
      icon: 'pi pi-fw pi-user',
      routerLink: '/'
    },
    {
      separator: true
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-power-off',
      command: () => this.authService.logout()
    }
  ];

  user = computed(() => this.authService.user())

  ngOnInit() {
    if (!this.user()) this.authService.getCurrentUser()?.subscribe()
  }
}
