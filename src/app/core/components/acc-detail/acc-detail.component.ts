import { Component, DestroyRef, Input, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';

import { AccountsService } from '../../services/accounts.service';
import { TeamsService } from '../../services/teams-service.service';

import { Actions, markAllAsDirty } from '../../../shared/constants';

import { Account, MinTeam, Team } from '../../models';


@Component({
  selector: 'app-acc-detail',
  templateUrl: './acc-detail.component.html',
  styles: [`
    :host ::ng-deep .p-dropdown {
      width: 100%;
    }

    h2 {
      color: var(--text-color);
    }
  `]
})
export class AccDetailComponent implements OnInit {

  readonly Actions = Actions


  private accountsService = inject(AccountsService)
  private destroyRef = inject(DestroyRef)
  private msgService = inject(MessageService)
  private teamsService = inject(TeamsService)


  @Input() accId?: number

  action!: Actions

  accForm = new FormBuilder().group({
    id:         [null],
    account:    [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    client:     [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    supervisor: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    team:       [null, [Validators.required]]
  })

  account = computed<Account|null>(() => this.accountsService.accounts()?.find((acc) => acc.id == this.accId) || null)
  teams = computed<MinTeam[]>(() => this.teamsService.teams().map((team) => ({id: team.id, name: team.name})))

  ngOnInit() {
    console.log('ACC', this.account())

    this.teamsService.getTeams()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()

    if (this.accId) {
      this.accForm.patchValue({ ...this.account(), team: this.account()?.team.id } as never)
      this.action = Actions.Edit
      return
    }

    this.action = Actions.Add
  }

  onSave() {
    const form = this.accForm

    if (form.invalid) {
      markAllAsDirty(form)
      this.msgService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Parece que faltan datos o hay datos incorrectos'
      })
      return
    }

    console.log('FORM', form.value)

  }

}
