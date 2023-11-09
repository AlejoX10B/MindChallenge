import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AuthService } from '../../../auth/services/auth.service';
import { UsersService } from '../../services/users.service';

import { Roles, User } from '../../../shared/models';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  private authService = inject(AuthService)
  private confirmService = inject(ConfirmationService)
  private destroyRef = inject(DestroyRef)
  private msgService = inject(MessageService)
  private usersService = inject(UsersService)


  readonly Roles = Roles
  
  users = computed<User[]>(() => this.usersService.users())
  isRestricted = computed<boolean>(() => this.authService.isRestricted())

  selectedUsers: User[] = []


  constructor() {
    this.isRowSelectable = this.isRowSelectable.bind(this)
  }


  ngOnInit() {
    this._getUsers()
  }


  private _getUsers() {
    this.usersService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  isRowSelectable(event: any) {
    return !this.isSuper(event.data)
  }

  isSuper(data: User) {
    return data.role === Roles.Super
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
        this.usersService.deleteUsers(this.selectedUsers.map((user) => user.id))
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
