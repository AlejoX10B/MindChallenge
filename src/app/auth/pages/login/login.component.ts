import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../services/auth.service';

import { emailValidator, markAllAsDirty } from '../../../shared/constants';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .p-password,
    :host ::ng-deep .p-password-input {
        width: 100%;
    }

    main {
      padding: 3rem;
      height: 100vh;
      height: 100svh;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }

    .fieldset {
      min-width: 550px
    }

    .buttons {
      display: flex;
      justify-content: center;
    }
  `],
  providers: [MessageService]
})
export class LoginComponent {
  

  private authService = inject(AuthService)
  private msgService = inject(MessageService)
  private router = inject(Router)


  loginForm = new FormBuilder().group({
    username: [null, [Validators.required, emailValidator()]],
    password: [null, [Validators.required]]
  })

  login() {
    if (this.loginForm.invalid) {
      markAllAsDirty(this.loginForm)
      this.msgService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Revisa los datos del formulario'
      })
      return
    }

    this.authService.login(this.loginForm.value as any)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('')
        },
        error: (e) => {
          console.error(e)

          this.msgService.add({
            severity: 'error',
            summary: 'Error!',
            detail: e.message || 'Ocurrió un error al iniciar sesión'
          })
        }
      })
  }

}
