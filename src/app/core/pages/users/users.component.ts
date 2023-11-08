import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../services/users.service';
import { AddUserComponent } from '../../components/user-form/user-form.component';

import { Roles, User } from '../../../shared/models';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [
    ConfirmationService,
    DialogService,
    MessageService
  ]
})
export class UsersComponent implements OnInit {

  private authService = inject(AuthService)
  private confirmService = inject(ConfirmationService)
  private destroyRef = inject(DestroyRef)
  private dialogService = inject(DialogService)
  private msgService = inject(MessageService)
  private usersService = inject(UsersService)

  
  readonly Roles = Roles
  
  users = computed<User[]>(() => this.usersService.users())
  isRestricted = computed<boolean>(() => this.authService.isRestricted())

  selectedUsers: User[] = []


  ngOnInit() {
    this._getUsers()
  }


  private _getUsers() {
    this.usersService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  addOrEditUser(user: User | null) {
    const ref = this.dialogService.open(AddUserComponent, {
      header: `${(user == null) ? 'Añadir nuevo' : 'Editar'} usuario`,
      maximizable: false,
      width: '50%',
      data: user,
    })

    ref.onClose.subscribe((val) => {if (val) this._getUsers() })
  }

  deleteSelectedUsers() {
    if (this.selectedUsers.length == 0) return

    this.confirmService.confirm({
      header: 'Eliminar usuarios',
      message: 'Estás seguro que deseas eliminar los usuarios seleccionados?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUsers(
          this.selectedUsers.map((user) => user.id))
          .subscribe({
            next: () => {
              this.selectedUsers = []
              this.msgService.add({
                severity: 'success',
                summary: 'Éxito!',
                detail: 'Los usuarios seleccionados se han eliminado'
              })
              this._getUsers()
            },
            error: () => {
              this.msgService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo eliminar los usuarios seleccionados'
              })
            }
          })
      }
    })
  }

  deleteUser(user: User) {
    this.confirmService.confirm({
      header: 'Eliminar usuario',
      message: `Seguro que quieres eliminar al usuario: ${user.fullname}?`,
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(user.id)
          .subscribe({
            next: () => {
              this.msgService.add({
                severity: 'success',
                summary: 'Éxito!',
                detail: 'Usuario eliminado'
              })
              this._getUsers()
            },
            error: () => {
              this.msgService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo eliminar el usuario'
              })
            }
          })
      }
    })
  }

}
