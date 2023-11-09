import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { Account, FullAccount } from '../models';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private http = inject(HttpClient)

  private _url = `${env.backUrl}/${env.endpoints.accounts}`


  private _accounts = signal<Account[]>([])
  accounts = computed<Account[]>(() => this._accounts())


  getAccounts(): Observable<Account[]> {
    const params = new HttpParams().append('_embed', 'teams')

    return this.http.get<FullAccount[]>(this._url, { params })
     .pipe(
        map(accounts => {
          return accounts.map(({teams, ...acc}) => {
            return {
              ...acc,
              team: { id: teams[0].id, name: teams[0].name }
            }
          })
        }),
        tap(accounts => this._accounts.set(accounts)),
        catchError(e => throwError(() => e.error))
      )
  }
}
