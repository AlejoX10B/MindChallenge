import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { AuthService } from '../../auth/services/auth.service';

import { User } from '../../shared/models';
import { UserForm } from '../models';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private _url = `${env.backUrl}/${env.endpoints.users}`

  private _users = signal<User[]>([])
  private _currentUser = computed<User|null>(() => this.authService.currentUser())

  users = computed<User[]>(() => this._users())


  getUsers(): Observable<User[]> {
    const params = new HttpParams().append('id_ne', this._currentUser()?.id || '')

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

  editUser(user: UserForm): Observable<boolean> {
    const url = `${this._url}/${user.id}`

    return this.http.patch(url, user)
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
