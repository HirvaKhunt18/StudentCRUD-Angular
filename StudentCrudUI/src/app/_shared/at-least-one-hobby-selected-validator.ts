import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneHobbySelectedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedHobbies = control.value as number[];
  if (selectedHobbies && selectedHobbies.length > 0) {
    return null;
  } else {
    return { 'atLeastOneHobbySelectedValidator': true };
  }
  };
}