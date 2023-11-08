import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { AuthService } from '../../auth/services/auth.service';

import { User, Roles } from '../../shared/models';
import { FullUserForm, UserForm } from '../models';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private _url = `${env.backUrl}/${env.endpoints.users}`

  private _users = signal<User[]>([])
  private _currentUser = computed<User|null>(() => this.authService.currentUser())
  private _isRestricted = computed<boolean>(() => this.authService.isRestricted())

  users = computed<User[]>(() => this._users())


  getUsers(): Observable<User[]> {
    let params = new HttpParams().append('id_ne', this._currentUser()?.id || '')
    
    if(this._isRestricted()) {
      params = params.append('role_ne', Roles.Super)
    }

    return this.http.get<User[]>(this._url, { params })
      .pipe(
        tap(users => this._users.set(users)),
        catchError(e => throwError(() => e.error))
      )
  }

  addUser(user: UserForm): Observable<boolean> {
    return this.http.post(this._url, user)
      .pipe(
        map(() => true),
        catchError(e => throwError(() => e.error))
      )
  }

  editUser(user: UserForm | FullUserForm): Observable<boolean> {
    const url = `${this._url}/${user.id}`

    return this.http.put(url, user)
      .pipe(
        map(() => true),
        catchError(e => throwError(() => e.error))
      )
  }

  deleteUser(userId: number): Observable<boolean> {
    const url = `${this._url}/${userId}`
    
    return this.http.delete(url)
      .pipe(
        map(() => true),
        catchError((e) => throwError(() => e.error))
      )
  }

  deleteUsers(userIds: number[]) {
    const obs = userIds.map(id => this.deleteUser(id))
    return forkJoin(obs)
  }

}
