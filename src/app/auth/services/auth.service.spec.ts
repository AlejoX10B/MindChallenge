import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';

import { environment as env } from '../../../environments/environment';

import { AuthService } from './auth.service';
import { AuthStatus, Credentials } from '../models';
import { Roles, User } from '../../shared/models';


describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute logout()', () => {
    service.logout()
    expect(service.authStatus()).toBe(AuthStatus.NotAuthenticated)
    expect(service.currentUser()).toBeNull()
  })

  it('should execute login()', () => {
    const credentials: Credentials = {
      username: 'super@user.com',
      password: '12345'
    }
    
    const params = new HttpParams()
    .append('email', credentials.username)
    .append('password', credentials.password)
    
    const url = `${env.backUrl}/${env.endpoints.users}?` + params.toString()

    service.login(credentials).subscribe()

    const http = httpTesting.expectOne({ method: 'GET', url: url })
    expect(http.request.method).toEqual('GET')
    expect(http.request.urlWithParams).toEqual(url)
  })

  describe('should execute getCurrentUser()', () => {
    it('return false because there is no user in local storage', () => {
      service.getCurrentUser().subscribe({next: (value) => {
        expect(value).toBeFalsy()
      }})      
    })

    it('return user because there is an active session', () => {
      localStorage.setItem('userId', String(1))
      const user: User = {
        id: 1,
        fullname: 'Super User',
        email: 'super@user.com',
        password: '12345',
        role: Roles.User,
      }

      const url = `${env.backUrl}/${env.endpoints.users}/${user.id}`

      service.getCurrentUser().subscribe()

      const http = httpTesting.expectOne({ method: 'GET', url: url })
      expect(http.request.method).toEqual('GET')
      expect(http.request.urlWithParams).toEqual(url)
      http.flush(user)

      expect(service.currentUser()).toEqual(user)
      expect(service.authStatus()).toBe(AuthStatus.Authenticated)
      expect(service.isRestricted()).toBeTruthy()
    })
  })
});
