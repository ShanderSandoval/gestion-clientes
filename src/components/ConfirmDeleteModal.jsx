import React from "react";

const ConfirmDeleteModal = ({ cliente, onClose, onConfirm }) => {
  return (
    <>
      {/* Fondo opacado */}
      <div className="modal-backdrop show"></div>

      {/* Contenido del modal */}
      <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar al cliente <b>{cliente.nombre}</b>?
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
