import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/cm-app/clientes";

const EditClienteModal = ({ cliente, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...cliente });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.idCliente}`, formData);
      onSave();
    } catch (error) {
      console.error("Error al editar el cliente", error);
    }
  };

  return (
    <>
      {/* Fondo opacado */}
      <div className="modal-backdrop show"></div>

      {/* Contenido del modal */}
      <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Cliente</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="cedula"
                  placeholder="Cédula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  name="celular"
                  placeholder="Celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cerrar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditClienteModal;
