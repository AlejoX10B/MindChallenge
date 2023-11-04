import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';


@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Mind Challenge';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

}
