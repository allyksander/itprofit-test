import Inputmask from 'inputmask';

export const formValidateInit = () => {
  const dataAction = 'data-action';
  const inputPhone = 'input-phone';
  const requiredSelector = '[required]';
  const validataForm = 'validate-form';
  const validateText = 'validate-text';
  const validateEmail = 'validate-email';
  const formFieldClass = 'form-field';
  const validClass = `${formFieldClass}--valid`;
  const invalidClass = `${formFieldClass}--invalid`;
  const wrapperSelector = `.${formFieldClass}`;
  const formSubmited = 'form-submited';
  const formSubmitedError = `${formSubmited}--error`;
  const formSubmitedSucces = `${formSubmited}--success`;

  const checkNodeValidity = (node: HTMLInputElement | HTMLTextAreaElement) => {
    const wrapper = node.closest(wrapperSelector);

    if (wrapper) {
      node.validity.valid ? wrapperSetValid(wrapper) : wrapperSetInvalid(wrapper);
    }
  };

  const wrapperSetValid = (wrapper: Element) => {
    wrapper.classList.add(validClass);
    wrapper.classList.remove(invalidClass);
  };

  const wrapperSetInvalid = (wrapper: Element) => {
    wrapper.classList.add(invalidClass);
    wrapper.classList.remove(validClass);
  };

  const validateEmailField = (node: HTMLInputElement) => {
    const nodeValue = node.value;

    nodeValue.length > 0 && (nodeValue.match(/[a-z0-9]\@.+[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}/g) || []).length !== 1
      ? node.setCustomValidity('Заполните это поле')
      : node.setCustomValidity('');

    checkNodeValidity(node);
  };

  const inputPhoneInit = (node: HTMLInputElement) => {
    const nodeMask = node.dataset.mask || '';
    const nodePlaceholder = node.dataset.placeholder;
    const config = {
      clearMaskOnLostFocus: true,
      clearIncomplete: true,
      oncleared: function () {
        if (node.required) {
          node.setCustomValidity('Invalid field');
          checkNodeValidity(node);
        }
      },
      onincomplete: function () {
        if (node.required) {
          node.setCustomValidity('Invalid field');
          checkNodeValidity(node);
        }
      },
      oncomplete: function () {
        if (node.required) {
          node.setCustomValidity('');
          checkNodeValidity(node);
        }
      },
      placeholder: '',
    };

    if (nodePlaceholder) {
      config.placeholder = nodePlaceholder;
    }

    Inputmask(nodeMask, config).mask(node);
  };

  class InputPhone extends HTMLInputElement {
    constructor() {
      super();
      inputPhoneInit(this);
    }
  }

  customElements.define(inputPhone, InputPhone, { extends: 'input' });

  document.addEventListener('click', (event: Event) => {
    const eTarget = event.target as HTMLInputElement | HTMLTextAreaElement | null;

    if (eTarget) {
      const targetNode = event.target as Element;

      eTarget
        .getAttribute(dataAction)
        ?.split(' ')
        ?.map((item) => {
          if (item === validataForm) {
            const form = targetNode.closest('form');
            const selectors = [
              `[${dataAction}*="${validateText}"]`,
              `[${dataAction}*="${validateEmail}"]`,
              `[is="${inputPhone}"]${requiredSelector}`,
            ];
            const toValidateInputs = form?.querySelectorAll(selectors.join(', '));

            if (form) {
              form.classList.remove(formSubmitedSucces);
              form.classList.add(formSubmitedError);
            }

            if (toValidateInputs?.length) {
              [...toValidateInputs].map((item) => checkNodeValidity(item as HTMLInputElement | HTMLTextAreaElement));
            }
          }
        });
    }
  });

  document.addEventListener('input', (event: Event) => {
    const eTarget = event.target as HTMLInputElement | HTMLTextAreaElement | null;

    if (eTarget) {
      const actiones: string | null = eTarget.getAttribute(dataAction);

      actiones?.split(' ').map((item) => {
        if (item === validateText) {
          checkNodeValidity(eTarget);
        }

        if (item === validateEmail) {
          validateEmailField(eTarget as HTMLInputElement);
        }
      });
    }
  });

  document.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement | undefined;

    if (form) {
      form.reset();
      form.classList.remove(formSubmitedError);
      form.classList.add(formSubmitedSucces);
    }
  });
};
