import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { getSimulaciones, dataSimulaciones } from "../api/simulacionService";

const CompararSimulacionesModal = ({ show, handleClose, onComparar }) => {
  const [simulaciones, setSimulaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({ s1: "", s2: "" });

  useEffect(() => {
    if (show) {
      setLoading(true);
      getSimulaciones()
        .then(res => setSimulaciones(res))
        .catch(err => console.error("Error al obtener simulaciones:", err))
        .finally(() => setLoading(false));
    }
  }, [show]);

  const handleCompararClick = async () => {
    const { s1, s2 } = selected;

    if (!s1 || !s2) {
      alert("Debes seleccionar dos simulaciones para comparar.");
      return;
    }

    if (s1 === s2) {
      alert("Selecciona dos simulaciones distintas.");
      return;
    }

    setLoading(true);
    try {

      const result = await dataSimulaciones(Number(s1), Number(s2));


      const sim1Meta = simulaciones.find((s) => s.id === Number(s1));
      const sim2Meta = simulaciones.find((s) => s.id === Number(s2));

      const simConNombre = [
        { ...result[0], nombre: sim1Meta?.nombre || "Simulación 1" },
        { ...result[1], nombre: sim2Meta?.nombre || "Simulación 2" },
      ];


      onComparar(simConNombre);

      handleClose();
    } catch (err) {
      console.error("Error al obtener los datos de simulaciones:", err);
      alert("Ocurrió un error al obtener los datos de simulaciones. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Comparar Simulaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner animation="border" className="mb-3" />}

        {!loading && (
          <>
            {/* Simulación 1 */}
            <Form.Group>
              <Form.Label>Simulación 1</Form.Label>
              <Form.Control
                as="select"
                value={selected.s1}
                onChange={(e) =>
                  setSelected((prev) => ({ ...prev, s1: e.target.value }))
                }
              >
                <option value="">-- Selecciona --</option>
                {simulaciones.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Simulación 2 */}
            <Form.Group className="mt-3">
              <Form.Label>Simulación 2</Form.Label>
              <Form.Control
                as="select"
                value={selected.s2}
                onChange={(e) =>
                  setSelected((prev) => ({ ...prev, s2: e.target.value }))
                }
              >
                <option value="">-- Selecciona --</option>
                {simulaciones.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleCompararClick} disabled={loading}>
          {loading ? "Cargando..." : "Comparar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompararSimulacionesModal;
