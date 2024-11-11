import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class UserFormValidator {
  static pastDate(control: AbstractControl): ValidationErrors {
    const date = new Date(control.value);
    const today = new Date();

    // clearing the time
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      return { futureDate: 'Birthdate cannot be in the future' };
    }
    return null;
  }
}
