import React from "react";
import "./ModalWithForm.css";

export default function ModalWithForm({
  name,
  title,
  isOpen,
  onClose,
  onSubmit,
  submitText = "Save",
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className={`modal modal_type_${name}`}>
      <div className="modal__overlay" onClick={onClose} />

      <div className="modal__container">
        <button
          type="button"
          className="modal__close-button"
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>

        {title && <h2 className="modal__title">{title}</h2>}

        <form className="modal__form" onSubmit={onSubmit}>
          <div className="modal__content">{children}</div>

          <button type="submit" className="modal__submit-button">
            {submitText}
          </button>
        </form>
      </div>
    </div>
  );
}
