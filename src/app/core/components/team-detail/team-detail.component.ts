import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';

import { TeamsService } from '../../services/teams-service.service';
import { UsersService } from '../../services/users.service';

import { datesRangeValidator, markAllAsDirty } from '../../../shared/constants';
import { TeamForm, TeamMember } from '../../models';
import { mergeMap, switchMap } from 'rxjs';


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

  private destroyRef = inject(DestroyRef)
  private msgService = inject(MessageService)
  private teamsService = inject(TeamsService)
  private usersService = inject(UsersService)

  users = computed(() => {
    const users = this.usersService.users()
      .filter((user) => user?.teamId == null)
      .map((user) => ({id: user?.id, fullname: user?.fullname}))
    
    return [...users]
  })

  teamForm = new FormBuilder().group({
    id:       [null],
    name:     [null, [Validators.required, Validators.maxLength(20)]],
    users:    new FormBuilder().array([])
  })

  get members() {
    return this.teamForm.get('users') as FormArray
  }


  ngOnInit() {
    if (this.users().length == 0) {
      this.usersService.getUsers()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe()
    }

    this.addMember()
  }


  addMember() {
    const memberFields = new FormBuilder().group({
      userId:    [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate:   [null]
    },
    {
      validators: [datesRangeValidator()]
    })

    this.members.push(memberFields)
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
    
    this.teamsService.addTeam(form.value as TeamForm)
      .pipe(
        switchMap(teamId => this.usersService.editUsers(form.value.users as TeamMember[], teamId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.msgService.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: 'El equipo ha sido creado'
          })
        },
        error: () => {
          this.msgService.add({
            severity: 'error',
            summary: 'Error!',
            detail: 'No se ha podido crear el equipo'
          })
        }
      })

    console.log(form.value);
    
  }

}
