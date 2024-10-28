import { FormDataSubmitError, FormSubmitSuccess } from './types';
import { getFormData, getFormNameFieldsWithError } from './utils';

const formSubmited = 'form-submited';
const formSubmitedError = `${formSubmited}--error`;
const formSubmitedSucces = `${formSubmited}--success`;
const formSubmitedMessage = 'Ваша заявка успешно отправлена';
const formSubmitedServerError = 'Сервер временно недоступен, попробуйте позже';
const formSubmitMessageSelector = '.form-submit__message';
const formSubmitURL = 'http://localhost:9090/api/registration';

export const formRegistrationRequest = async (
  form: HTMLFormElement
): Promise<FormSubmitSuccess | FormDataSubmitError> => {
  const nameFieldsWithError = getFormNameFieldsWithError(form);
  const response = await fetch(formSubmitURL, {
    method: 'POST',
    body: JSON.stringify(getFormData(form)),
  });

  if (response.status === 400) {
    return {
      status: 'error',
      fields: {
        serverError: response.statusText,
      },
    };
  }

  if (Object.keys(nameFieldsWithError).length) {
    return {
      status: 'error',
      fields: nameFieldsWithError,
    };
  }

  return {
    status: 'success',
    msg: formSubmitedMessage,
  };
};

export const formRegistrationHandler = async (form: HTMLFormElement) => {
  const formMessage = form.querySelector(formSubmitMessageSelector);

  try {
    const response = await formRegistrationRequest(form);

    if (response.status === 'success') {
      if (formMessage) {
        formMessage.textContent = (response as FormSubmitSuccess).msg;
      }

      form.reset();
      form.classList.remove(formSubmitedError);
      form.classList.add(formSubmitedSucces);
    }

    if (response.status === 'error') {
      if (formMessage) {
        const errors = (response as FormDataSubmitError).fields;
        let errorText = '';

        for (const key in errors) {
          errorText += `<p>${key} - ${errors[key]}</p>`;
        }

        formMessage.innerHTML = errorText;
      }

      form.classList.remove(formSubmitedSucces);
      form.classList.add(formSubmitedError);
    }
  } catch (error) {
    if (formMessage) {
      formMessage.textContent = formSubmitedServerError;

      form.classList.remove(formSubmitedSucces);
      form.classList.add(formSubmitedError);
    }

    console.log(error);
  }
};
