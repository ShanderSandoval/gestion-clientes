import React, { useEffect, useState } from "react";

const Toast = ({ message, onClose }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFade(true); // Activa el efecto de desvanecimiento
    }, 1500); // Inicia el desvanecimiento después de 1.5 segundos

    const closeTimer = setTimeout(() => {
      onClose(); // Cierra automáticamente el Toast después de 2 segundos
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    }; // Limpia los temporizadores si el Toast se desmonta
  }, [onClose]);

  return (
    <div
      className={`toast show position-fixed bottom-0 end-0 m-3 bg-success text-white ${fade ? "opacity-0" : ""}`}
      style={{ zIndex: 1050, transition: "opacity 0.5s ease" }} // Añade transición de opacidad
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
};

export default Toast;