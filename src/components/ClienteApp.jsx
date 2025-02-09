import React, { useState, useEffect } from "react";
import axios from "axios";

// Obtener automáticamente la IP del backend basada en la ubicación del frontend
const getBackendUrl = () => {
  let host = window.location.hostname; // Obtiene la IP o dominio donde se ejecuta el frontend

  // Si está en localhost, usa la IP local del backend
  if (host === "localhost") {
    return "http://localhost:8080/cm-app/clientes";
  }

  // Si el frontend está en otro equipo o en Docker, usa la misma IP del frontend
  return `http://${host}:8080/cm-app/clientes`;
};

const ClienteApp = () => {
  const [API_URL, setApiUrl] = useState(getBackendUrl()); // Se obtiene la IP automáticamente
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener clientes del backend
  const fetchClientes = async () => {
    try {
      console.log("Conectando a API en:", API_URL);
      const response = await axios.get(API_URL);
      const sortedClientes = response.data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setClientes(sortedClientes);
    } catch (error) {
      console.error("Error al obtener los clientes", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [API_URL]); // Ejecutar cuando API_URL cambie

  // Eliminar cliente
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchClientes();
      setToastMessage("Cliente eliminado exitosamente");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error al eliminar el cliente", error);
    }
  };

  const closeToast = () => setToastMessage(null);

  return (
    <div className="container mt-4 position-relative">
      <h1 className="text-center mb-4">MANAGE UCE</h1>

      {/* 🔹 Contenedor del botón y buscador alineados */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          Agregar Nuevo Cliente
        </button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar Cliente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de clientes con filtrado */}
      <ClienteTable
        clientes={clientes.filter((cliente) =>
          cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.cedula.includes(searchTerm) ||
          cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.celular.includes(searchTerm)
        )}
        onEdit={(cliente) => {
          setSelectedCliente(cliente);
          setShowEditModal(true);
        }}
        onDelete={(cliente) => {
          setSelectedCliente(cliente);
          setShowDeleteModal(true);
        }}
      />

      {/* Modal para agregar cliente */}
      {showAddModal && (
        <AddClienteModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            fetchClientes();
            setToastMessage("Cliente registrado exitosamente");
            setShowAddModal(false);
          }}
        />
      )}

      {/* Modal para editar cliente */}
      {showEditModal && selectedCliente && (
        <EditClienteModal
          cliente={selectedCliente}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            fetchClientes();
            setToastMessage("Cliente editado exitosamente");
            setShowEditModal(false);
          }}
        />
      )}

      {/* Modal para confirmar eliminación */}
      {showDeleteModal && selectedCliente && (
        <ConfirmDeleteModal
          cliente={selectedCliente}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete(selectedCliente.idCliente)}
        />
      )}

      {/* Toast para feedback */}
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
    </div>
  );
};

export default ClienteApp;
