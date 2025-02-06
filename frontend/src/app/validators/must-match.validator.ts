import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function MustMatch(
  password: string,
  confirmPassword: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(password);
    const confirmPasswordControl = control.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }
    const match = passwordControl.value === confirmPasswordControl.value;

    if (match) {
      if (confirmPasswordControl.errors) {
        delete confirmPasswordControl.errors['mustMatch'];
        if (!Object.keys(confirmPasswordControl.errors).length) {
          confirmPasswordControl.setErrors(null);
        }
      }
    } else {
      confirmPasswordControl.setErrors({ mustMatch: true });
    }
    return null;
  };
}
