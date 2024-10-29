const dataAction = 'data-action';
const actionOpen = 'modal-open';
const overflowHiddenClass = 'overflow-hidden';
const showModalSelector = '[data-modal-id][open]';
const modalContentSelector = '.modal__content';
const overflowHiddenRemoveDelay = 300;

const toggleBodyOverflow = () => document.body.classList.toggle(overflowHiddenClass);

const modalCloseCallback = () => setTimeout(toggleBodyOverflow, overflowHiddenRemoveDelay);

const isModalOutsideClick = (eTarget: HTMLElement) => {
  const openModal = eTarget.closest(showModalSelector);
  const isModalContentClick = eTarget.closest(modalContentSelector);

  return !!(openModal && !isModalContentClick);
};

const showModal = (id: string | undefined) => {
  const modal = document.querySelector<HTMLDialogElement>(`[data-modal-id="${id}"]`);

  if (modal) {
    modal.addEventListener('close', modalCloseCallback, { once: true });
    toggleBodyOverflow();
    modal.showModal();
  }
};

const modalClose = (eTarget: HTMLElement) => eTarget.closest<HTMLDialogElement>('.modal')?.close();

export const modalControlerInit = () => {
  document.addEventListener('click', (event: Event) => {
    const eTarget = event.target as HTMLElement | null;

    if (eTarget) {
      const targetNode = event.target as HTMLElement;

      eTarget
        .getAttribute(dataAction)
        ?.split(' ')
        ?.map((item) => {
          if (item === actionOpen) {
            showModal(targetNode?.dataset.openModalId);
          }
        });

      if (isModalOutsideClick(targetNode)) {
        modalClose(eTarget);
      }
    }
  });
};
