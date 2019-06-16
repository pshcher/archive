import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const confirmPwdValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPwd = control.get('newPassword');
  const rptPwd = control.get('repeatPassword');

  return newPwd && rptPwd && newPwd.value !== rptPwd.value ? { 'pwdMismatch': true } : null;
};

@Directive({
  selector: '[appConfirmPwd]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ConfirmPwdDirective, multi: true }]
})
export class ConfirmPwdDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return confirmPwdValidator(control);
  }

}
