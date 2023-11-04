import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';


@NgModule({
  exports: [
    ButtonModule,
    MenuModule,
    TableModule,
    ToolbarModule
  ]
})
export class PrimengModule { }
