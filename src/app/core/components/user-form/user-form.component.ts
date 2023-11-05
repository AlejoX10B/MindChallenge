import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { alphabeticValidator, emailValidator, markAllAsDirty } from '../../../shared/constants';
import { UsersService } from '../../services/users.service';
import { User } from '../../models';


@Component({
  styles: [`
    :host ::ng-deep .p-dropdown {
      width: 100%;
    }
    
    .buttons {
      gap: 1rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  `],
  templateUrl: './user-form.component.html',
})
export class AddUserComponent implements OnInit {

  roles = [
    { value: 'SUPER', label: 'Superuser' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'USER', label: 'Usuario' },
  ]

  public ref = inject(DynamicDialogRef)
  private conf = inject(DynamicDialogConfig)
  private msgService = inject(MessageService)
  private usersService = inject(UsersService)

  userForm = new FormBuilder().group({
    id:       [null],
    name:     [null, [Validators.required, Validators.minLength(3), alphabeticValidator()]],
    lastname: [null, [Validators.required, Validators.minLength(3), alphabeticValidator()]],
    email:    [null, [Validators.required, emailValidator()]],
    role:     [null, [Validators.required]]
  })

  ngOnInit() {
    if (!this.conf.data) return
    this.userForm.setValue(this.conf.data)
  }

  onCancel() {
    this.ref.close()
  }

  onSave() {
    if (this.userForm.invalid) {
      markAllAsDirty(this.userForm)
      this.msgService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'No se ha podido crear el usuario, revisa los datos'
      })
      return
    }

    this.usersService.addUser(this.userForm.value as any)
      .subscribe({
         next: () => {
          this.msgService.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: 'El usuario ha sido creado'
          })
         },
         error: () => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'No se ha podido crear el usuario, revisa los datos'
          })
         }
      })
    
    this.ref.close()
  }

}
