import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


const ALPHABETIC_REGEX = new RegExp('^[a-záéíóúñü\\s]+$', 'i')
const EMAIL_REGEX = new RegExp('^[\\w.-]+@[\\w.-]+\\.\\w+$')
const PASSWORD_REGEX = new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$')
const URL_REGEX = new RegExp('^((https?:\\/\\/)?(www\\.)?([a-zA-Z0-9-]+)\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?([/?].*)?)$')


// Generic custom validators


export function alphabeticValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null

    return (ALPHABETIC_REGEX.test(control.value)) ? null : { alpha: true }
  }
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null

    return (EMAIL_REGEX.test(control.value)) ? null : { email: true }
  }
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null

    return (PASSWORD_REGEX.test(control.value)) ? null : { password: true }
  }
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null

    return (URL_REGEX.test(control.value)) ? null : { url: true }
  }
}

export function equalPasswordValidator() {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const password = formGroup.get('password')?.value
    const password_2 = formGroup.get('password_2')?.value

    if (password !== password_2) {
      formGroup.get('password_2')?.setErrors({ notEqual: true })
      return { notEqual: true }
    }

    formGroup.get('password_2')?.setErrors(null)
    return null
  }
}

export function datesRangeValidator() {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const startDate = formGroup.get('startDate')?.value
    const endDate = formGroup.get('endDate')?.value

    if ((startDate && endDate) && (startDate > endDate)) {
      formGroup.get('endDate')?.setErrors({ dates: true })
      return null
    }

    return null
  }
}


// Mark all fields as dirty with PrimeNg Fields

export function markAllAsDirty(form: FormGroup | FormArray | AbstractControl) { 

  if (form instanceof FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key)

      if (control) markAllAsDirty(control)
    })
  }
  else if (form instanceof FormArray) {
    form.controls.forEach((control) => markAllAsDirty(control))
  }
  else if (form instanceof AbstractControl) {
    form.markAsDirty();
  }

}