/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @angular-eslint/directive-selector */

import { DestroyRef, Directive, ElementRef, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroupDirective } from '@angular/forms';


@Directive({
  standalone: true,
  selector: '[errorChecker]',
})
export class ErrorCheckerDirective implements OnInit, OnDestroy {

  private destroyRef = inject(DestroyRef)
  private elementRef = inject(ElementRef)
  private formGroupDirective = inject(FormGroupDirective)
  private renderer = inject(Renderer2)

  private errorElement: HTMLElement | null = null


  ngOnInit() {
    const control = this._findFormControl()
    if (!control) {
      console.error('No se pudo encontrar el control en el formulario.')
      return
    }

    control.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateErrorMessage())

    this.formGroupDirective.ngSubmit
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateErrorMessage())
  }

  ngOnDestroy() {
    if (this.errorElement) {
      this.errorElement.remove()
    }
  }

  private updateErrorMessage() {
    const control = this._findFormControl()
    if (!control) return

    if (control.invalid && (control.dirty || control.touched)) {
      let errMsg = ''
      const errors = control.errors
      
      if (errors?.['required']) {
        errMsg = 'Este campo es obligatorio.'
      }
      else if (errors?.['minlength']) {
        errMsg = `Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`
      }
      else if (errors?.['maxlength']) {
        errMsg = `No debe tener más de ${errors['maxlength'].requiredLength} caracteres.`
      }
      else if (errors?.['pattern']) {
        errMsg = 'Este campo no tiene un formato válido'
      }
      else if (errors?.['alpha']) {
        errMsg = 'El campo solo permite caracteres alfabéticos.'
      }
      else if (errors?.['email']) {
        errMsg = 'El email no tiene un formato válido.'
      }
      else if (errors?.['password']) {
        errMsg = 'La contraseña no tiene un formato válido.'
      }
      else if (errors?.['notEqual']) {
        errMsg = 'Las contraseñas no coinciden.'
      }
      else if (errors?.['url']) {
        errMsg = 'La url no es válida.'
      }

      if (!this.errorElement) {
        this.errorElement = this.renderer.createElement('span')
        this.renderer.appendChild(this.elementRef.nativeElement.parentNode, this.errorElement)
      }
      
      this.errorElement!.textContent = errMsg
      this.errorElement!.className = 'err-msg'

    } else {
      if (this.errorElement) {
        this.errorElement.remove()
        this.errorElement = null
      }
    }
  }

  private _findFormControl(): AbstractControl | null {
    const formGroup = this.formGroupDirective.form
    const controlName = this.elementRef.nativeElement.getAttribute('formControlName')
    return formGroup.get(controlName)
  }

}
