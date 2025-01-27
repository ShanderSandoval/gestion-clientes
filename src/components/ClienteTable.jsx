import React, { useState } from "react";

const ClienteTable = ({ clientes, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const clientesPerPage = 10;

  // Paginación
  const indexOfLastCliente = currentPage * clientesPerPage;
  const indexOfFirstCliente = indexOfLastCliente - clientesPerPage;
  const currentClientes = clientes.slice(indexOfFirstCliente, indexOfLastCliente);
  const totalPages = Math.ceil(clientes.length / clientesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <table className="table table-bordered text-center" style={{ tableLayout: "fixed", width: "100%" }}>
        <thead className="table-dark">
          <tr>
            <th style={{ width: "10%" }}>ID</th>
            <th style={{ width: "25%" }}>Nombre</th>
            <th style={{ width: "25%" }}>Cédula</th>
            <th style={{ width: "25%" }}>Dirección</th>
            <th style={{ width: "15%" }}>Celular</th>
            <th style={{ width: "20%" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentClientes.map((cliente) => (
            <tr key={cliente.idCliente}>
              <td>{cliente.idCliente}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.cedula}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.celular}</td>
              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => onEdit(cliente)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(cliente)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
              Anterior
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default ClienteTable;
