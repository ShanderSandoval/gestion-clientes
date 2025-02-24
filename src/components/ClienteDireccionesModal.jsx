import React, { useEffect, useState } from "react";
import axios from "axios";

const ClienteDireccionesModal = ({ cliente, onClose, onUpdateCliente }) => {
  const [direcciones, setDirecciones] = useState(cliente.direcciones);

  const [nuevaDireccion, setNuevaDireccion] = useState({
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    cliente: { idCliente: cliente.idCliente } // ✅ Relacionamos con el cliente
  });

  useEffect(() => {
    setDirecciones(cliente.direcciones);
  }, [cliente]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setNuevaDireccion({ ...nuevaDireccion, [e.target.name]: e.target.value });
  };

  // Agregar nueva dirección
  const handleAgregarDireccion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/cm-app/direcciones", nuevaDireccion);
      const nuevasDirecciones = [...direcciones, response.data];
      setDirecciones(nuevasDirecciones);
      setNuevaDireccion({ direccion: "", ciudad: "", codigoPostal: "", cliente: { idCliente: cliente.idCliente } });

      // 🔄 Llamar a la función para actualizar el cliente en `ClienteApp`
      onUpdateCliente({ ...cliente, direcciones: nuevasDirecciones });
    } catch (error) {
      console.error("Error al agregar dirección:", error);
    }
  };

  // Eliminar dirección
  const handleEliminarDireccion = async (idDetalleDireccion) => {
    try {
      await axios.delete(`http://localhost:8080/cm-app/direcciones/${idDetalleDireccion}`);
      const nuevasDirecciones = direcciones.filter(dir => dir.idDetalleDireccion !== idDetalleDireccion);
      setDirecciones(nuevasDirecciones);

      // 🔄 Actualizar la lista de direcciones en ClienteApp
      onUpdateCliente({ ...cliente, direcciones: nuevasDirecciones });
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Direcciones de {cliente.nombre}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ul className="list-group">
              {direcciones.length > 0 ? (
                direcciones.map((dir) => (
                  <li key={dir.idDetalleDireccion} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>📍 {dir.direccion}, {dir.ciudad}, {dir.codigoPostal}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminarDireccion(dir.idDetalleDireccion)}>
                      ❌
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-muted">No hay direcciones registradas</p>
              )}
            </ul>

            {/* 🔹 Formulario para agregar nueva dirección */}
            {direcciones.length < 4 && (
              <>
                <h6 className="mt-3">Agregar Nueva Dirección</h6>
                <form onSubmit={handleAgregarDireccion}>
                  <input type="text" name="direccion" placeholder="Dirección" value={nuevaDireccion.direccion} onChange={handleChange} className="form-control mb-2" required />
                  <input type="text" name="ciudad" placeholder="Ciudad" value={nuevaDireccion.ciudad} onChange={handleChange} className="form-control mb-2" required />
                  <input type="text" name="codigoPostal" placeholder="Código Postal" value={nuevaDireccion.codigoPostal} onChange={handleChange} className="form-control mb-2" required maxLength="6" pattern="[0-9]*" />
                  <button type="submit" className="btn btn-primary w-100">➕ Agregar Dirección</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDireccionesModal;
