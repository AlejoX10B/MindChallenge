import { Component, computed, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../services/users.service';

import { Actions, alphabeticValidator, assignRolesOptions, emailValidator, LANG_LEVEL_OPTIONS, markAllAsDirty, ROLES_OPTIONS, urlValidator } from '../../../shared/constants';
import { Dropdown, Roles, User } from '../../../shared/models';
import { UserForm } from '../../models';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styles: [`
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-password,
    :host ::ng-deep .p-password-input {
      width: 100%;
    }

    :host ::ng-deep .p-fieldset {
      height: 100%;
    }

    h2 {
      color: var(--text-color);
    }

    .fieldsets {
      gap: 1rem;
      display: flex;

      p-fieldset {
        flex: 1;
      }
    }
  `]
})
export class UserDetailComponent implements OnInit {

  readonly Actions = Actions
  readonly Roles = Roles
  readonly langLevels = LANG_LEVEL_OPTIONS
  
  private authService = inject(AuthService)
  private confirmService = inject(ConfirmationService)
  private destroyRef = inject(DestroyRef)
  private msgService = inject(MessageService)
  private usersService = inject(UsersService)
  private router = inject(Router)

  @Input() userId?: number
  
  action!: Actions
  roles!: Dropdown[]

  userForm = new FormBuilder().group({
    id:         [null],
    role:       [null, [Validators.required]],
    fullname:   [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50), alphabeticValidator()]],
    email:      [null, [Validators.required, emailValidator()]],
    password:   [null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
    engLevel:   [null],
    knowledge:  [null, [Validators.minLength(2), Validators.maxLength(520)]],
    link:       [null, [urlValidator()]]
  })

  user = computed<User|null>(() => this.usersService.users()?.find((user) => user.id == this.userId) || null)
  private sessionUser = computed<User|null>(() => this.authService.currentUser())

  ngOnInit() {
    this.roles = ROLES_OPTIONS
    
    const url = this.router.url

    if (url.includes('user') && this.userId) {
      this.action = Actions.Edit
      this.roles = assignRolesOptions(this.user() as User)
      this.userForm.patchValue(this.user() as any)
      this.userForm.disable()
      return
    }

    if (url.includes('profile')) {
      this.action = Actions.Edit
      this.roles = assignRolesOptions(this.sessionUser() as User)
      this.userForm.patchValue(this.sessionUser() as any)
      this.userForm.disable()
      return
    }

    this.action = Actions.Add
  }

  onEdit() {
    const form = this.userForm

    form.enable()

    form.controls.role.disable()
    form.controls.email.disable()

    form.controls.engLevel.addValidators([Validators.required])
    form.controls.engLevel.updateValueAndValidity()

    form.controls.link.addValidators([Validators.required])
    form.controls.link.updateValueAndValidity()
  }

  onSave() {
    const form = this.userForm

    if (form.invalid) {
      markAllAsDirty(form)
      this.msgService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Parece que faltan datos o hay datos incorrectos'
      })
      return
    }

    this.confirmService.confirm({
      header: (this.action === Actions.Add) ? 'Crear usuario' : 'Actualizar información',
      message: `Estás seguro que deseas ${(this.action === Actions.Add) ? 'crear el usuario' : 'guardar estos cambios'}?`,
      acceptLabel: (this.action === Actions.Add) ? 'Crear' : 'Guardar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this._executeAPICalls()
    })
  }

  private _executeAPICalls() {
    const actions = {
      add: () => this.usersService.addUser(this.userForm.value as UserForm),
      edit: () => this.usersService.editUser(this.userForm.value as UserForm),
    }

    actions[this.action]()
      .pipe(
        switchMap((data) => {
          return (this.action === Actions.Edit && !this.userId)
            ? this.authService.getCurrentUser()
            : of(data)
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.msgService.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: (this.action === Actions.Add)
              ? 'El usuario ha sido creado'
              : 'Los cambios han sido guardados'
          })
          this.userForm.disable()
          this.router.navigateByUrl('/users')
        },
        error: () => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error!',
            detail: (this.action === Actions.Add)
              ? 'No se ha podido crear el usuario'
              : 'No se pudo guardar los cambios'
          })
        }
      })
  }

}
