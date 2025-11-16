import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Form, Spinner } from "react-bootstrap";

const nodosFijos = [
    { nodo: "0−20", descripcion: "Organizar oficina de ventas" },
    { nodo: "20−40", descripcion: "Contratar viajantes" },
    { nodo: "40−60", descripcion: "Instruir a los viajantes" },
    { nodo: "20−50", descripcion: "Seleccionar agencia de publicidad" },
    { nodo: "50−70", descripcion: "Planificar campaña publicidad" },
    { nodo: "70−90", descripcion: "Dirigir campaña de publicidad" },
    { nodo: "0−10", descripcion: "Diseño de envase del producto" },
    { nodo: "10−30", descripcion: "Instalar dispositivos de envase" },
    { nodo: "30−80", descripcion: "Envasar stocks iniciales" },
    { nodo: "0−30", descripcion: "Solicitar stocks al fabricante" },
    { nodo: "20−60", descripcion: "Seleccionar distribuidores" },
    { nodo: "60−80", descripcion: "Vender a los distribuidores" },
    { nodo: "80−90", descripcion: "Expedir stocks a distribuidores" }
];

const TablaDatosEntrada = ({ show, handleClose, onEnviarDatos }) => {
    const [muestras, setMuestras] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            fetch("http://localhost:8000/api/datosTabla/Tiempos", { method: "POST" })
                .then(res => res.json())
                .then(json => setMuestras(json))
                .catch(err => console.error(err));
        }
    }, [show]);

    const handleSelectId = async (id) => {
        setSelectedId(id);
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/datosTabla/dataTiempos?id=${id}`, {
                method: "POST"
            });
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnviar = () => {
        if (data && selectedId) {
            const payload = {
                id_tiempos: selectedId,  
                nodes: nodosFijos.map(n => n.nodo),
                tiempo_op: data.Tiempo_optimitsa,
                tiempo_es: data.Tiempo_probable,
                tiempo_pe: data.Tiempo_pesimista
            };
            onEnviarDatos(payload);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Seleccionar Datos de Entrada</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Selecciona una muestra</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedId}
                        onChange={(e) => handleSelectId(e.target.value)}
                    >
                        <option value="">-- Selecciona --</option>
                        {muestras.map(muestra => (
                            <option key={muestra.id} value={muestra.id}>
                                {muestra.nombre}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                {loading && <Spinner animation="border" className="mt-3" />}

                {data && (
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Actividad</th>
                                <th>Optimista</th>
                                <th>Probable</th>
                                <th>Pesimista</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodosFijos.map((nodoObj, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{nodoObj.descripcion}</td>
                                    <td>{data.Tiempo_optimitsa[i]}</td>
                                    <td>{data.Tiempo_probable[i]}</td>
                                    <td>{data.Tiempo_pesimista[i]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                <Button variant="primary" onClick={handleEnviar} disabled={!data || !selectedId}>
                    Enviar datos a simular
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TablaDatosEntrada;