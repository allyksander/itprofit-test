import Inputmask from 'inputmask';
import { type FormValidateInitProps } from './types';

export const formValidateInit = async (fromValidateList: FormValidateInitProps[]) => {
  const dataAction = 'data-action';
  const inputPhone = 'input-phone';
  const requiredSelector = '[required]';
  const validataForm = 'validate-form';
  const validateText = 'validate-text';
  const validateEmail = 'validate-email';
  const invelidValidationText = 'Поле заполнено некорректно';
  const formFieldClass = 'form-field';
  const validClass = `${formFieldClass}--valid`;
  const invalidClass = `${formFieldClass}--invalid`;
  const wrapperSelector = `.${formFieldClass}`;

  const isValidNode = (node: HTMLInputElement | HTMLTextAreaElement) => node.validity.valid;

  const setFormFieldClasses = (node: HTMLInputElement | HTMLTextAreaElement) => {
    const wrapper = node.closest(wrapperSelector);

    if (wrapper) {
      isValidNode(node) ? wrapperSetValid(wrapper) : wrapperSetInvalid(wrapper);
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
      ? node.setCustomValidity(invelidValidationText)
      : node.setCustomValidity('');

    setFormFieldClasses(node);
  };

  const inputPhoneInit = (node: HTMLInputElement) => {
    const nodeMask = node.dataset.mask || '';
    const nodePlaceholder = node.dataset.placeholder;
    const config = {
      clearMaskOnLostFocus: true,
      clearIncomplete: true,
      oncleared: function () {
        if (node.required) {
          node.setCustomValidity(invelidValidationText);
          setFormFieldClasses(node);
        }
      },
      onincomplete: function () {
        if (node.required) {
          node.setCustomValidity(invelidValidationText);
          setFormFieldClasses(node);
        }
      },
      oncomplete: function () {
        if (node.required) {
          node.setCustomValidity('');
          setFormFieldClasses(node);
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
        ?.map(async (item) => {
          if (item === validataForm) {
            const form = targetNode.closest('form');
            const selectors = [
              `[${dataAction}*="${validateText}"]`,
              `[${dataAction}*="${validateEmail}"]`,
              `[is="${inputPhone}"]${requiredSelector}`,
            ];

            if (form) {
              const toValidateInputs = [...form.querySelectorAll(selectors.join(', '))];
              toValidateInputs.map((item) => setFormFieldClasses(item as HTMLInputElement | HTMLTextAreaElement));

              fromValidateList.map(({ formRole, formSubmitHandler }) => {
                if (form.dataset.formRole === formRole) {
                  formSubmitHandler(form);
                }
              });
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
          setFormFieldClasses(eTarget);
        }

        if (item === validateEmail) {
          validateEmailField(eTarget as HTMLInputElement);
        }
      });
    }
  });

  document.addEventListener('submit', (event: SubmitEvent) => {
    if ((event.target as Element).classList.contains('form')) {
      event.preventDefault();
    }
  });
};
