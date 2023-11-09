import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AccountsService } from '../../services/accounts.service';

import { Account } from '../../models';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class AccountsComponent implements OnInit {

  private accountsService = inject(AccountsService)
  private destroyRef = inject(DestroyRef)


  accounts = computed<Account[]>(() => this.accountsService.accounts())


  ngOnInit() {
    this.accountsService.getAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

}
