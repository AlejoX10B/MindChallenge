import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authService = {
    login: jest.fn(() => throwError(() => new Error('Error')))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule],
      providers: [
        MessageService,
        { provide: AuthService, useValue: authService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })

  describe('ngSubmit cases', () => {
    it('should not do ngSubmit with invalid form message', () => {
      component.login()
      expect(component.loginForm.invalid).toBeTruthy()
    })
  
    it('should do ngSubmit with success message', () => {
      
      component.loginForm.patchValue({
        username: 'super@user.com',
        password: '12345'
      })
      component.login()
      
      authService.login.mockReturnValue(of(true) as never)
      expect(component.loginForm.invalid).toBeFalsy()
      expect(authService.login).toHaveBeenCalled()
    })
  
    it('should do ngSubmit with server error message', () => {
      component.loginForm.patchValue({
        username: 'super@user.com',
        password: '12345'
      })
      component.login()
  
      expect(component.loginForm.invalid).toBeFalsy()
      expect(authService.login).toHaveBeenCalled()
    })
  })

});
