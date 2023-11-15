import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { AuthStatus, Credentials } from '../models';
import { User, Roles } from '../../shared/models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private http = inject(HttpClient)

  private _user = signal<User | null>(null)
  private _authStatus = signal<AuthStatus>(AuthStatus.LoadingAuth)
  
  currentUser = computed(() => this._user())
  authStatus = computed(() => this._authStatus())
  isRestricted = computed(() => this._user()?.role === Roles.User)


  constructor() {
    this.getCurrentUser()?.subscribe()
  }


  private _saveSession(user: User) {
    localStorage.setItem('userId', String(user.id))

    this._authStatus.set(AuthStatus.Authenticated)
    this._user.set(user)
  }


  logout() {
    localStorage.removeItem('userId')

    this._authStatus.set(AuthStatus.NotAuthenticated)
    this._user.set(null)
  }

  login(credentials: Credentials): Observable<boolean> {
    const url = `${env.backUrl}/${env.endpoints.users}`

    const params = new HttpParams()
      .append('email', credentials.username)
      .append('password', credentials.password)

    return this.http.get<User[]>(url, { params })
      .pipe(
        map((query) => {
          if (query.length === 0) throw new Error('Usuario no encontrado')
          this._saveSession(query[0])
          return true
        }),
        catchError(e => throwError(() => e.message))
      )
  }

  getCurrentUser(): Observable<User|boolean> {
    const userId = localStorage.getItem('userId')    
    if (!userId) {
      this.logout()
      return of(false)
    }

    const url = `${env.backUrl}/${env.endpoints.users}/${userId}`
    return this.http.get<User>(url)
      .pipe(
        tap((user) => this._saveSession(user)),
        catchError(e => {
          this._authStatus.set(AuthStatus.NotAuthenticated)
          return throwError(() => e.message)
        })
      )
  }
}
