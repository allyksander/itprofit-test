import { formRegistrationHandler } from './form/form-registration';
import { formValidateInit } from './form/form-validate';
import { modalControlerInit } from './modal/modal';

formValidateInit([
  {
    formRole: 'registration',
    formSubmitHandler: formRegistrationHandler,
  },
]);
modalControlerInit();
