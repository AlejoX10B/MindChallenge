import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { User } from '../models';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient)

  private _url = `${env.backUrl}/${env.endpoints.users}`

  private _users = signal<User[]>([])
  users = computed<User[]>(() => this._users())


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this._url)
      .pipe(
        tap(users => this._users.set(users)),
        catchError(e => throwError(() => e.error))
      )
  }

  addUser(user: User): Observable<boolean> {
    return this.http.post(this._url, user)
      .pipe(
        map(() => true),
        catchError(e => throwError(() => e.error))
      )
  }

  editUser(user: User): Observable<boolean> {
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
