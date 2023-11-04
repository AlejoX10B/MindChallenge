import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-home',
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
          <router-outlet/>
      </main>
    </body>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
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
        routerLink: '/auth/login'
      }
    ];
  }


}
