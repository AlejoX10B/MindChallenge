import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

import { environment as env } from '../../../environments/environment';

import { Credentials } from '../models';
import { User } from '../../core/models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private http = inject(HttpClient)
  private router = inject(Router)

  private _user = signal<User | null>(null)
  user = computed(() => this._user())


  private _saveSession(user: User) {
    this._user.set(user)
    localStorage.setItem('userId', String(user.id))
  }


  logout() {
    localStorage.removeItem('userId')

    this._user.set(null)
    this.router.navigateByUrl('/auth')
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
        catchError(e => throwError(() => e))
      )
  }

  getCurrentUser(): Observable<User> | undefined {
    const userId = localStorage.getItem('userId')    
    if (!userId) {
      this.router.navigateByUrl('/auth')
      return
    }

    const url = `${env.backUrl}/${env.endpoints.users}/${userId}`
    return this.http.get<User>(url)
      .pipe(
        tap((user) => this._user.set(user)),
        catchError(e => throwError(() => e))
      )
  }
}
