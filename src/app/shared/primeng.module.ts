import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  exports: [
    ButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    DropdownModule,
    FieldsetModule,
    InputTextareaModule,
    InputTextModule,
    MenuModule,
    PasswordModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    TooltipModule
  ]
})
export class PrimengModule { }
