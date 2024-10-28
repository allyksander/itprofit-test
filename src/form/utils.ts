export const getFormData = (form: HTMLFormElement) => Object.fromEntries(new FormData(form).entries());

export const getFormNameFieldsWithError = (form: HTMLFormElement) => {
  const nameFieldsWithError: { [key: string]: string } = {};

  for (const name in getFormData(form)) {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);

    if (!input?.validity.valid) {
      nameFieldsWithError[name] = 'сообщение об ошибке';
    }
  }

  return nameFieldsWithError;
};
