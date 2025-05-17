import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';


//forwardref Permite que un componente padre controle el modal desde afuera con funciones open() y close().
const Modal = forwardRef(function Modal({ children }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
      close: () => {
        dialog.current.close();
      },
    };
  });

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
});

export default Modal;
