import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

export const requireVisibleValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  // const formGroup = control.parent.controls;  
  // const name = Object.keys(formGroup).find(name => control === formGroup[name]) || "reqVisibleControl";
 
  console.log( name + " requireVisibleValidator called, value: " + ( value ? value : "None Yet"));

  return !value ? { 'cname' : true } : null;
};

@Directive({
  selector: '[apprequireVisible]',
  providers: [{ provide: NG_VALIDATORS, useExisting: requireVisibleValidatorDirective, multi: true }]
})
export class requireVisibleValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return requireVisibleValidator(control)
  }
}

