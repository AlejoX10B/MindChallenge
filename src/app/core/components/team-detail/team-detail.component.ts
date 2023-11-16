import { Component, DestroyRef, Input, OnInit, computed, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TeamsService } from '../../services/teams-service.service';
import { UsersService } from '../../services/users.service';

import { Actions, datesRangeValidator, markAllAsDirty } from '../../../shared/constants';
import { TeamForm } from '../../models';


@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styles: [`
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-calendar {
      width: 100%;
    }

    h2 {
      color: var(--text-color);
    }

    .members {
      gap: 2rem;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: space-between;
    }

    .member {
      gap: 1rem;
      display: flex;
      align-items: center;
      align-content: center;

      p-dropdown {
        width: 100%
      }

      p-calendar {
        width: 100%
      }
    }
  `]
})
export class TeamDetailComponent implements OnInit {

  readonly Actions = Actions
  
  private confirmService = inject(ConfirmationService)
  private destroyRef = inject(DestroyRef)
  private msgService = inject(MessageService)
  private teamsService = inject(TeamsService)
  private usersService = inject(UsersService)

  @Input() teamId?: number

  action!: Actions

  teamForm = new FormBuilder().group({
    id: [null],
    name: [null, [Validators.required, Validators.maxLength(20)]],
    users: new FormBuilder().array([])
  })

  get members() {
    return this.teamForm.get('users') as FormArray
  }

  users = computed(() => this.usersService.users()
    .filter((user) => user?.teamId == null || user?.teamId == this.teamId)
    .map((user) => ({ id: user?.id, fullname: user?.fullname }))
  )

  team = computed<TeamForm|null>(() => {
    const team = this.teamsService.teams().find(team => team.id == this.teamId)
    return (team) ? {
      ...team,
      users: team?.users.map(user => ({
        userId: user.id,
        fullname: user.fullname,
        startDate: user.startDate,
        endDate: user.endDate
      }))
    } as TeamForm : null
  })

  teamEffect = effect(() => {
    if (this.action === Actions.Add || !this.team()) return

    this.teamForm.patchValue({
      id: this.team()?.id,
      name: this.team()?.name
    } as never)

    this._fillMembers()
    this.teamForm.disable()
  })


  ngOnInit() {
    this.teamsService.getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()

    this.usersService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()


    if (this.teamId) {
      this.action = Actions.Edit
      return
    }

    this.action = Actions.Add
    this.addMember()
  }


  private _fillMembers() {
    this.team()?.users?.forEach(user => {
      const memberForm = new FormBuilder().group({
        userId: [user.userId, [Validators.required]],
        startDate: [user.startDate, [Validators.required]],
        endDate: [user.endDate]
      },
      {
        validators: [datesRangeValidator()]
      })

      this.members.push(memberForm)
    })
  }

  addMember() {
    const memberForm = new FormBuilder().group({
      userId: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null]
    },
      {
        validators: [datesRangeValidator()]
      })

    this.members.push(memberForm)
  }

  deleteMember(index: number) {
    this.members.removeAt(index)
  }

  onSubmit() {
    const form = this.teamForm

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
      header: (this.action === Actions.Add) ? 'Crear equipo' : 'Actualizar información',
      message: `Estás seguro que deseas ${(this.action === Actions.Add) ? 'crear el equipo' : 'guardar estos cambios'}?`,
      acceptLabel: (this.action === Actions.Add) ? 'Crear' : 'Guardar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.executeAPICalls()
    })
  }

  private executeAPICalls() {
    const actions = {
      add: () => this.teamsService.addTeam(this.teamForm.value as TeamForm),
      edit: () => this.teamsService.editTeam(this.team() as TeamForm, this.teamForm.value as TeamForm),
    }

    actions[this.action]()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.msgService.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: (this.action === Actions.Add)
            ? 'El equipo ha sido creado'
            : 'Los cambios han sido guardados'
          })
        },
        error: () => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error!',
            detail: (this.action === Actions.Add)
            ? 'No se ha podido crear el equipo'
            : 'No se pudo guardar los cambios'
          })
        }
      })
  }

}
