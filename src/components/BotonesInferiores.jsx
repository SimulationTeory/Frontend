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
      id_tiempos: simulacionData.id_tiempos ?? 0,
      nombre,
      SemanasC1: simulacionData.SemanasC1 ?? 0,
      SemanasC2: simulacionData.SemanasC2 ?? 0,


      rutaCriticaA: simulacionData.pathA || [],
      rutaCriticaB: simulacionData.pathB || [],

      varianza_total: simulacionData.varianza ?? 0,
      probabilidad: simulacionData.probabilidad ?? 0,

      actividadesA: generarActividades(
        simulacionData.tiemposPert_A,
        simulacionData.nodesA
      ),

      actividadesB: generarActividades(
        simulacionData.tiemposPert_B,
        simulacionData.nodesB
      ),

      nodesA: limpiarNodos(simulacionData.nodesA),
      nodesB: limpiarNodos(simulacionData.nodesB),
    };




    //console.log(JSON.stringify(payload, null, 4)); 


    setLoading(true);
    try {
      const res = await saveSimulacion(payload);
      console.log("Respuesta del backend:", res);
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
    return alert(
      "No hay contenido para exportar. Asegúrate de que la simulación y la tabla estén visibles."
    );
  }

  
  const clone = exportDiv.cloneNode(true);

 
  clone.style.width = "100%";
  clone.style.maxWidth = "100%";
  clone.style.overflow = "hidden";

  const ventana = window.open("", "_blank");
  ventana.document.write(`
    <html>
      <head>
        <title>Exportar Simulación</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 10px; margin: 0; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid black; padding: 4px; text-align: left; }
          h4, h5, h6 { margin: 8px 0; }

          /* Ajuste dinámico para imprimir Gantt */
          #exportar-simulacion-clone {
            width: 100% !important;
            max-width: 100%;
            overflow: hidden !important;
            transform: scale(0.95);
            transform-origin: top left;
          }

          @media print {
            body { margin: 0; padding: 0; }
            #exportar-simulacion-clone { transform: scale(0.95); }
          }
        </style>
      </head>
      <body>
        <div id="exportar-simulacion-clone">${clone.outerHTML}</div>
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
