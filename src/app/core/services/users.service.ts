import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, tap, throwError } from 'rxjs';

import { User } from '../models';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _url = 'http://localhost:3000'


  private http = inject(HttpClient)


  private _users = signal<User[]>([])
  users: Signal<User[]> = computed(() => this._users())


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this._url}/users`)
      .pipe(
        tap(users => this._users.set(users)),
        catchError(e => throwError(() => e.error?.detail))
      )
  }

  deleteUser(userId: number): Observable<boolean> {
    return this.http.delete(`${this._url}/users/${userId}`)
      .pipe(
        map(() => true),
        catchError((e) => throwError(() => e.error?.detail))
      )
  }

  deleteUsers(userIds: number[]) {
    const obs = userIds.map(id => this.deleteUser(id))
    return forkJoin(obs)
  }

}
