import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { Team } from '../models';


@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private http = inject(HttpClient)

  private _url = `${env.backUrl}/${env.endpoints.teams}`


  private _teams = signal<Team[]>([])
  teams = computed<Team[]>(() => this._teams())


  getTeams(): Observable<Team[]> {
    const params = new HttpParams().append('_embed', 'users')

    return this.http.get<Team[]>(this._url, { params })
     .pipe(
        tap(teams => this._teams.set(teams)),
        catchError(e => throwError(() => e.error))
      )
  }
  
}
