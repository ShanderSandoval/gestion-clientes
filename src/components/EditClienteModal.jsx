import React, { useState } from "react";
import axios from "axios";

// Cargar `env.js` dinámicamente en tiempo de ejecución
const loadEnvConfig = async () => {
  try {
    const response = await fetch("/env.js"); // Carga `env.js` desde el servidor Nginx
    const scriptText = await response.text();
    eval(scriptText); // Evalúa el contenido de `env.js` para definir `window.env`
    console.log("Configuración cargada:", window.env);
  } catch (error) {
    console.error("Error al cargar `env.js`", error);
  }
};

const EditClienteModal = ({ cliente, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...cliente });
  const [errors, setErrors] = useState({});

  // Manejar cambios en los inputs con validación
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Solo permitir números en cédula y celular
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

  // Validaciones
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

  // Manejo del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.put(`${API_URL}/${formData.idCliente}`, formData);
      onSave();
      onClose();
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
                  required
                />
                <input
                  type="text"
                  name="cedula"
                  placeholder="Cédula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className={`form-control mb-2 ${errors.cedula ? "is-invalid" : ""}`}
                  required
                />
                {errors.cedula && <div className="invalid-feedback">{errors.cedula}</div>}
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="form-control mb-2"
                  required
                />
                <input
                  type="text"
                  name="celular"
                  placeholder="Celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className={`form-control mb-2 ${errors.celular ? "is-invalid" : ""}`}
                  required
                />
                {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
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
