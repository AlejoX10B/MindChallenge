import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { User } from '../models';


@Injectable({
  providedIn: 'root'
})
export class UsersService {


  private http = inject(HttpClient)


  private _users = signal<User[]>([])
  users: Signal<User[]> = computed(() => this._users())


  getUsers(): Observable<User[]> {
    const url = `${env.backUrl}/${env.endpoints.users}`

    return this.http.get<User[]>(url)
      .pipe(
        tap(users => this._users.set(users)),
        catchError(e => throwError(() => e.error))
      )
  }

  addUser(user: User): Observable<boolean> {
    const url = `${env.backUrl}/${env.endpoints.users}`

    return this.http.post(url, user)
      .pipe(
        map(() => true),
        catchError(e => throwError(() => e.error))
      )
  }

  editUser(user: User): Observable<boolean> {
    const url = `${env.backUrl}/${env.endpoints.users}/${user.id}`

    return this.http.put(url, user)
      .pipe(
        map(() => true),
        catchError(e => throwError(() => e.error))
      )
  }

  deleteUser(userId: number): Observable<boolean> {
    const url = `${env.backUrl}/${env.endpoints.users}/${userId}`
    
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
