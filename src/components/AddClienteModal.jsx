import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/cm-app/clientes";

const AddClienteModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    direccion: "",
    celular: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar solo números para cédula y celular
    if ((name === "cedula" || name === "celular") && !/^[0-9]*$/.test(value)) {
      setErrors({ ...errors, [name]: "Solo se permiten números." });
      return;
    } else {
      setErrors({ ...errors, [name]: "" });
    }

    // Limitar a 10 caracteres para cédula y celular
    if ((name === "cedula" || name === "celular") && value.length > 10) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (formData.cedula.length !== 10) {
      newErrors.cedula = "La cédula debe tener exactamente 10 dígitos.";
    }
    if (formData.celular.length !== 10) {
      newErrors.celular = "El celular debe tener exactamente 10 dígitos.";
    } else if (!formData.celular.startsWith("09")) {
      newErrors.celular = "El celular debe comenzar con '09'.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post(API_URL, formData);
      onSave();
    } catch (error) {
      console.error("Error al agregar el cliente", error);
    }
  };

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Nuevo Cliente</h5>
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
                  className={`form-control mb-2 ${errors.cedula ? "is-invalid" : ""}`}
                />
                {errors.cedula && <div className="invalid-feedback">{errors.cedula}</div>}
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
                  className={`form-control mb-2 ${errors.celular ? "is-invalid" : ""}`}
                />
                {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cerrar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClienteModal;