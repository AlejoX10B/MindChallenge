import { Component, DestroyRef, OnInit, Signal, computed, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UsersService } from '../../services/users.service';
import { User } from '../../models';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class UsersComponent implements OnInit {

  private confirmService = inject(ConfirmationService)
  private msgService = inject(MessageService)
  private usersService = inject(UsersService)
  private destroyRef = inject(DestroyRef)

  selectedUsers: User[] = []
  users: Signal<User[]> = computed(() => this.usersService.users())

  private _getUsers() {
    this.usersService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  ngOnInit() {
    this._getUsers()
  }

  deleteSelectedUsers() {
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
                detail: 'Todos los usuarios se han eliminado',
                life: 3000
              })
              this._getUsers()
            },
            error: () => {
              this.msgService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo eliminar los usuarios',
                life: 3000
              })
            }
          })
      }
    });
  }

  deleteUser(user: User) {
    this.confirmService.confirm({
      header: 'Eliminar usuario',
      message: `Seguro que quieres eliminar al usuario: ${user.name} ${user.lastname} ?`,
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
                detail: 'Usuario eliminado',
                life: 3000
              })
              this._getUsers()
            },
            error: () => {
              this.msgService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo eliminar el usuario',
                life: 3000
              })
            }
          })
      }
    });
  }

}
