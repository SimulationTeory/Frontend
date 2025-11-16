import React, { useState } from "react";
import { Col, Button, Spinner } from "react-bootstrap";
import { saveSimulacion } from "../api/simulacionService";

const BotonesInferiores = ({
  onCorrerSimulacion,
  simulacionData,
  onCompararSimulaciones
}) => {
  const [loading, setLoading] = useState(false);

  const handleCorrer = async () => {
    setLoading(true);
    try {
      await onCorrerSimulacion();
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarSimulacion = async () => {
    if (!simulacionData) {
      alert("Primero debes correr la simulación.");
      return;
    }

    const nombre = prompt("Ingrese el nombre de la simulación:");
    if (!nombre) {
      alert("Debes ingresar un nombre.");
      return;
    }

    const limpiarNodos = (nodes) =>
      (nodes || []).map((n, idx) => ({
        nodo: n.nodo ?? idx * 10,
        early: n.early ?? 0,
        late: n.late ?? n.early ?? 0,
        holgura: n.holgura ?? 0,
        critical: Boolean(n.critical),
      }));

    const generarActividades = (tiemposPert, nodes) => {
      if (Array.isArray(tiemposPert) && tiemposPert.length > 0) {
        return tiemposPert.map((te, idx) => ({
          id_detalle: idx + 1,
          te: te ?? 0,
        }));
      }
      return (nodes || []).map((n, idx) => ({
        id_detalle: idx + 1,
        te: n.early ?? 0,
      }));
    };

    const payload = {
      id_tiempos: simulacionData.id_tiempos,
      nombre,
      SemanasC1: simulacionData.SemanasC1 ?? 0,
      SemanasC2: simulacionData.SemanasC2 ?? 0,
      rutaCriticaA: simulacionData.rutaCriticaA || [],
      rutaCriticaB: simulacionData.rutaCriticaB || [],
      varianza_total: simulacionData.varianza_total ?? 0,
      probabilidad: simulacionData.probabilidad ?? 0,
      actividadesA: generarActividades(simulacionData.tiemposPert_A, simulacionData.nodesA),
      actividadesB: generarActividades(simulacionData.tiemposPert_B, simulacionData.nodesB),
      nodesA: limpiarNodos(simulacionData.nodesA),
      nodesB: limpiarNodos(simulacionData.nodesB),
    };

    setLoading(true);
    try {
      const res = await saveSimulacion(payload);
      alert(`Simulación guardada con éxito. ID: ${res.id_simulacion || "desconocido"}`);
    } catch (err) {
      console.error("Error al guardar simulación:", err.response?.data || err.message);
      alert("Ocurrió un error al guardar la simulación. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = () => {
    const exportDiv = document.getElementById("exportar-simulacion");
    if (!exportDiv) {
      return alert("No hay contenido para exportar. Asegúrate de que la simulación y la tabla estén visibles.");
    }

    const ventana = window.open("", "_blank");
    ventana.document.write(`
      <html>
        <head>
          <title>Exportar Simulación</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 4px; text-align: left; }
            h4, h5, h6 { margin: 8px 0; }
          </style>
        </head>
        <body>
          ${exportDiv.outerHTML}
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  };

  const botones = [
    { texto: "Correr Simulación", action: handleCorrer },
    { texto: "Guardar Simulación", action: handleGuardarSimulacion },
    { texto: "Comparar Simulaciones", action: onCompararSimulaciones },
    { texto: "Exportar a PDF", action: handleExportar },
  ];

  return (
    <>
      {botones.map((btn, index) => (
        <Col key={index} xs="auto">
          <Button
            variant="light"
            style={{
              borderRadius: "20px",
              border: "1px solid black",
              margin: "0 10px",
              padding: "0.5rem 1.2rem",
            }}
            onClick={btn.action}
            disabled={btn.texto === "Correr Simulación" && loading}
          >
            {btn.texto === "Correr Simulación" && loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              btn.texto
            )}
          </Button>
        </Col>
      ))}
    </>
  );
};

export default BotonesInferiores;
