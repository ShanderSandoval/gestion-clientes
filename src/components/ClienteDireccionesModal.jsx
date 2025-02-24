import React, { useEffect, useState } from "react";
import axios from "axios";

const ClienteDireccionesModal = ({ cliente, onClose }) => {
  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    cliente: { idCliente: cliente.idCliente },
  });
  const [errorCodigoPostal, setErrorCodigoPostal] = useState("");

  // 🔄 Función para obtener las direcciones actualizadas desde la API
  const cargarDirecciones = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/cm-app/clientes/${cliente.idCliente}`);
      setDirecciones(response.data.direcciones); // ✅ Se actualiza con los datos del backend
    } catch (error) {
      console.error("Error al obtener direcciones:", error);
    }
  };

  useEffect(() => {
    cargarDirecciones(); // 🔄 Se ejecuta cada vez que se abre el modal
  }, [cliente]); // 🔄 Se ejecuta cuando `cliente` cambia

  // Manejar cambios en el formulario con validación del código postal
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "codigoPostal") {
      if (!/^\d*$/.test(value)) {
        setErrorCodigoPostal("Solo se permiten números.");
        return;
      }
      if (value.length > 6) {
        setErrorCodigoPostal("Máximo 6 dígitos.");
        return;
      }
      setErrorCodigoPostal("");
    }

    setNuevaDireccion({ ...nuevaDireccion, [name]: value });
  };

  // Agregar nueva dirección y recargar datos desde la API
  const handleAgregarDireccion = async (e) => {
    e.preventDefault();
    if (direcciones.length >= 4 || errorCodigoPostal) return;

    try {
      await axios.post("http://localhost:8080/cm-app/direcciones", nuevaDireccion);
      await cargarDirecciones(); // 🔄 Recargar direcciones después de agregar
      setNuevaDireccion({ direccion: "", ciudad: "", codigoPostal: "", cliente: { idCliente: cliente.idCliente } });
    } catch (error) {
      console.error("Error al agregar dirección:", error);
    }
  };

  // Eliminar dirección y recargar datos desde la API
  const handleEliminarDireccion = async (idDetalleDireccion) => {
    try {
      await axios.delete(`http://localhost:8080/cm-app/direcciones/${idDetalleDireccion}`);
      await cargarDirecciones(); // 🔄 Recargar direcciones después de eliminar
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
                    📍 {dir.direccion}, {dir.ciudad}, {dir.codigoPostal}
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminarDireccion(dir.idDetalleDireccion)}>❌</button>
                  </li>
                ))
              ) : (
                <p>No hay direcciones registradas</p>
              )}
            </ul>

            {/* 🔹 Formulario para agregar nueva dirección (se oculta si ya hay 4 direcciones) */}
            {direcciones.length < 4 && (
              <>
                <h6 className="mt-3">Agregar Nueva Dirección</h6>
                <form onSubmit={handleAgregarDireccion}>
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={nuevaDireccion.direccion}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  />
                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={nuevaDireccion.ciudad}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  />
                  <input
                    type="text"
                    name="codigoPostal"
                    placeholder="Código Postal"
                    value={nuevaDireccion.codigoPostal}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  />
                  {errorCodigoPostal && <p className="text-danger">{errorCodigoPostal}</p>}
                  <button type="submit" className="btn btn-primary w-100" disabled={errorCodigoPostal}>
                    Agregar Dirección
                  </button>
                </form>
              </>
            )}

            {/* Mensaje si se alcanzó el límite de direcciones */}
            {direcciones.length >= 4 && (
              <p className="text-danger mt-3">Se ha alcanzado el límite de 4 direcciones.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDireccionesModal;
