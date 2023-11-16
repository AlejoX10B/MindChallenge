import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { UsersService } from './users.service';

import { Team, TeamForm } from '../models';


@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private http = inject(HttpClient)
  private usersService = inject(UsersService)

  private _url = `${env.backUrl}/${env.endpoints.teams}`


  private _teams = signal<Team[]>([])
  teams = computed<Team[]>(() => this._teams()
    .map(team => ({
      ...team,
      users: team.users.map(user => ({
        ...user,
        startDate: (user.startDate) ? new Date(user.startDate) : null,
        endDate: (user.endDate) ? new Date(user.endDate) : null
      }))
    }))
  )


  getTeams(): Observable<Team[]> {
    const params = new HttpParams().append('_embed', 'users')

    return this.http.get<Team[]>(this._url, { params })
     .pipe(
        tap(teams => this._teams.set(teams)),
        catchError(e => throwError(() => e.error))
      )
  }

  addTeam(team: TeamForm): Observable<boolean> {
    return this.http.post<Team>(this._url, { name: team.name })
      .pipe(
        switchMap(({ id }) => this.usersService.editUsers(team.users, id)),
        catchError(e => throwError(() => e.error))
      )
  }

  editTeam(oldTeam: TeamForm, newTeam: TeamForm) {
    const delMembers = oldTeam.users
      .filter(oldMem => !newTeam.users.find(newMem => newMem.userId === oldMem.userId))
      .map(member => ({ userId: member.userId, startDate: null, endDate: null, teamId: null }))

    const addMembers = newTeam.users.filter(newMem => !oldTeam.users.find(oldMem => oldMem.userId === newMem.userId))
      .map(member => ({ teamId: newTeam.id, ...member }))

    const url = `${this._url}/${newTeam.id}`

    return this.http.patch(url, { name: newTeam.name })
      .pipe(
        switchMap(() => this.usersService.editUsers(delMembers, null)),
        switchMap(() => this.usersService.editUsers(addMembers, newTeam.id)),
        catchError(e => throwError(() => e.error))
      )
  }
  
}
