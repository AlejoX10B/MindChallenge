import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TeamsService } from '../../services/teams-service.service';
import { Team } from '../../models';


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class TeamsComponent implements OnInit {


  private teamsService = inject(TeamsService)
  private destroyRef = inject(DestroyRef)


  teams = computed<Team[]>(() => this.teamsService.teams())


  ngOnInit() {
    this.teamsService.getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

}
