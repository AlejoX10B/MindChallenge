import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../services/users.service';

import { alphabeticValidator, emailValidator, FULL_ROLES_OPTIONS, LANG_LEVEL_OPTIONS, markAllAsDirty, ROLES_OPTIONS, urlValidator } from '../../../shared/constants';
import { Dropdown, Roles, User } from '../../../shared/models';
import { FullUserForm } from '../../models';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [`
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-password,
    :host ::ng-deep .p-password-input {
      width: 100%;
    }

    :host ::ng-deep .p-fieldset {
      height: 100%;
    }

    .fieldsets {
      gap: 1rem;
      display: flex;

      p-fieldset {
        flex: 1;
      }
    }
  `],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class ProfileComponent implements OnInit {

  readonly langLevels = LANG_LEVEL_OPTIONS
  
  private authService = inject(AuthService)
  private confirmService = inject(ConfirmationService)
  private msgService = inject(MessageService)
  private usersService = inject(UsersService)
  
  private _currentUser = computed<User|null>(() => this.authService.currentUser())
  
  roles?: Dropdown[]

  userForm = new FormBuilder().group({
    id:         [null, [Validators.required]],
    role:       [{value: null, disabled: true}, [Validators.required]],
    fullname:   [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50), alphabeticValidator()]],
    email:      [{value: null, disabled: true}, [Validators.required]],
    password:   [null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
    engLevel:   [null, [Validators.required]],
    knowledge:  [null, [Validators.minLength(2), Validators.maxLength(520)]],
    link:       [null, [Validators.required, urlValidator()]]
  })


  ngOnInit() {
    this.roles = (this._currentUser()?.role === Roles.Super)
      ? FULL_ROLES_OPTIONS
      : ROLES_OPTIONS
    
    this.userForm.patchValue(this._currentUser() as any)
  }

  onSave() {
    const form = this.userForm

    if (form.invalid) {
      markAllAsDirty(this.userForm)
      this.msgService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Parece que faltan datos o hay datos incorrectos'
      })
      return
    }

    this.confirmService.confirm({
      header: 'Actualizar mi perfil',
      message: `Estás seguro que deseas guardar estos cambios?`,
      acceptLabel: 'Guardar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.editUser(form.getRawValue() as FullUserForm)
          .subscribe({
            next: () => {
              this.msgService.add({
                severity: 'success',
                summary: 'Éxito!',
                detail: 'Los cambios han sido guardados'
              })
            },
            error: () => {
              this.msgService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo guardar los cambios'
              })
            }
          })
      }
    })
  }

}
