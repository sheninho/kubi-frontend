// components/Modal.js
import React from 'react';

const Modal = ({ show, children}) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                {children}
            </div>
        </div>
    );
};

export default Modal;
