export type FormSubmit = {
  status: 'success' | 'error';
};

export type InputErrors = {
  [key: string]: string;
};

export type FormSubmitSuccess = FormSubmit & {
  msg: string;
};

export type FormDataSubmitError = FormSubmit & {
  fields: InputErrors;
};

export type FormValidateInitProps = {
  formRole: string;
  formSubmitHandler: Function;
};
