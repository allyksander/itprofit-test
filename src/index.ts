import { formRegistrationHandler } from './form/form-registration';
import { formValidateInit } from './form/form-validate';

formValidateInit([
  {
    formRole: 'registration',
    formSubmitHandler: formRegistrationHandler,
  },
]);
