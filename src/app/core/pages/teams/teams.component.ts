import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TeamsService } from '../../services/teams-service.service';
import { Team } from '../../models';


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {

  private confirmService = inject(ConfirmationService)
  private destroyRef = inject(DestroyRef)
  private msgService = inject(MessageService)
  private teamsService = inject(TeamsService)


  teams = computed<Team[]>(() => this.teamsService.teams())

  selectedTeams: Team[] = []


  ngOnInit() {
    this._getTeams()
  }


  private _getTeams() {
    this.teamsService.getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  deleteSelectedUsers() {
    if (this.selectedTeams.length == 0) return

    this.confirmService.confirm({
      header: 'Eliminar equipos',
      message: 'Estás seguro que deseas eliminar los equipos seleccionados?',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.teamsService.deleteTeams(this.selectedTeams)
          .subscribe({
            next: () => {
              this.selectedTeams = []
              this.msgService.add({
                severity: 'success',
                summary: 'Éxito!',
                detail: 'Los equipos seleccionados se han eliminado'
              })
              this._getTeams()
            },
            error: () => {
              this.msgService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo eliminar los equipos seleccionados'
              })
            }
          })
      }
    })
  }

  deleteTeam(team: Team) {
    this.confirmService.confirm({
      header: 'Eliminar equipo',
      message: `Seguro que quieres eliminar al equipo: ${team.name}?`,
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.teamsService.deleteTeam(team)
          .subscribe({
            next: () => {
              this.msgService.add({
                severity: 'success',
                summary: 'Éxito!',
                detail: 'Equipo eliminado'
              })
            },
            error: () => {
              this.msgService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo eliminar el equipo'
              })
            }
          })
      }
    })
  }

}
