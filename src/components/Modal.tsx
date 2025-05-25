import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClickOutside: () => void;
}

const Modal = ({ children, open, onClickOutside }: ModalProps) => {
  const handleClickOutside = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClickOutside();
    }
  };

  return (
    <dialog className="modal" open={open} onMouseDown={handleClickOutside}>
      <div className="modal-box">{children}</div>
    </dialog>
  );
};

export default Modal;
