import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { Account } from '../models';


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

    return this.http.get<Account[]>(this._url, { params })
     .pipe(
        tap(accounts => this._accounts.set(accounts)),
        catchError(e => throwError(() => e.error))
      )
  }
}
