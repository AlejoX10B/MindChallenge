import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { UsersService } from '../../services/users.service';

import { alphabeticValidator, emailValidator, markAllAsDirty, ROLES_OPTIONS } from '../../../shared/constants';

import { UserForm } from '../../models';


enum Actions {
  Add = 'add',
  Edit = 'edit',
}


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: [`
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-password,
    :host ::ng-deep .p-password-input {
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
})
export class AddUserComponent implements OnInit {

  public ref = inject(DynamicDialogRef)
  private conf = inject(DynamicDialogConfig)
  private msgService = inject(MessageService)
  private usersService = inject(UsersService)

  readonly Actions = Actions
  readonly roles = ROLES_OPTIONS
  
  action!: Actions

  userForm = new FormBuilder().group({
    id:       [null],
    fullname: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50), alphabeticValidator()]],
    email:    [null, [Validators.required, emailValidator()]],
    password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
    role:     [null, [Validators.required]]
  })

  ngOnInit() {
    if (!this.conf.data) {
      this.action = Actions.Add
      return
    }

    this.action = Actions.Edit
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

    const actions = {
      add: () => this.usersService.addUser(this.userForm.value as UserForm),
      edit: () => this.usersService.editUser(this.userForm.value as UserForm),
    }

    actions[this.action]().subscribe({
      next: () => {
        this.msgService.add({
          severity: 'success',
          summary: 'Éxito!',
          detail: `El usuario ha sido ${(this.action == Actions.Add) ? 'creado' : 'editado'}`
        })
      },
      error: () => {
        this.msgService.add({
          severity: 'error',
          summary: 'Error!',
          detail: `No se ha podido ${(this.action == Actions.Add) ? 'crear' : 'editar'} el usuario, revisa los datos`
        })
      }
    })

    this.ref.close(true)
  }

}
