import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import EntradaButton from "./EntradaButton";
import AreaLogica from "./AreaLogica";
import BotonesInferiores from "./BotonesInferiores";
import TablaDatosEntrada from "./TablaDatosEntrada";
import CompararSimulacionesModal from "./CompararSimulacionesModal";
import { correrSimulacion } from "../api/simulacionService";

const Simulador = () => {
    const [simulacionData, setSimulacionData] = useState(null);
    const [simulacionComparar, setSimulacionComparar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [modalCompararShow, setModalCompararShow] = useState(false);
    const [entradaData, setEntradaData] = useState(null);
    const [idTiempos, setIdTiempos] = useState(null);

    const handleOpenModal = () => setModalShow(true);
    const handleCloseModal = () => setModalShow(false);
    const handleOpenComparar = () => setModalCompararShow(true);
    const handleCloseComparar = () => setModalCompararShow(false);

    const handleEnviarDatos = (payload) => {
        setEntradaData(payload);
        setIdTiempos(payload.id_tiempos);
    };

    const handleCorrerSimulacion = async () => {
        if (!entradaData) {
            alert("Primero debes seleccionar los Datos de Entrada");
            return;
        }

        setLoading(true);
        try {
            const res = await correrSimulacion(entradaData);
            setSimulacionData({
                ...res,
                id_tiempos: idTiempos,
                SemanasC1: res.SemanasC1 || 0,
                SemanasC2: res.SemanasC2 || 0,
                rutaCriticaA: res.rutaCriticaA || [],
                rutaCriticaB: res.rutaCriticaB || [],
                varianza_total: res.varianza_total || 0,
                probabilidad: res.probabilidad || 0,
                actividadesA: res.actividadesA || [],
                actividadesB: res.actividadesB || [],
                nodesA: res.nodesA || [],
                nodesB: res.nodesB || [],
                tiemposPert_A: res.tiemposPert_A || {},
                tiemposPert_B: res.tiemposPert_B || {},
            });
            setSimulacionComparar(null);
        } catch (err) {
            console.error("Error al correr la simulación:", err.response?.data || err.message);
            alert("Ocurrió un error al correr la simulación. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    const handleComparar = (data) => {
        setSimulacionComparar(data);
    };

    return (
        <Container
            fluid
            className="d-flex flex-column justify-content-between align-items-center p-4"
            style={{
                backgroundColor: "#d9d9d9",
                borderRadius: "40px",
                height: "100%",
                width: "100%",
            }}
        >
            <Row className="w-100 mt-3">
                <Col xs="auto">
                    <EntradaButton onClick={handleOpenModal} />
                </Col>
            </Row>

            <TablaDatosEntrada
                show={modalShow}
                handleClose={handleCloseModal}
                onEnviarDatos={handleEnviarDatos}
            />

            <CompararSimulacionesModal
                show={modalCompararShow}
                handleClose={handleCloseComparar}
                onComparar={handleComparar}
            />

            <div id="exportar-simulacion" className="flex-grow-1 w-100">
                <Row className="flex-grow-1 justify-content-center align-items-center w-100">
                    <Col xs={16} md={14} lg={12}>
                        <AreaLogica
                            data={simulacionData}
                            simDataComparar={simulacionComparar}
                        />
                    </Col>
                </Row>


                {entradaData && (
                    <div style={{ marginTop: "20px" }}>
                        <h5>Datos de Entrada</h5>
                        <table border="1" cellPadding="4" style={{ borderCollapse: "collapse", width: "100%" }}>
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
                                {entradaData.nodes.map((nodo, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{nodo}</td>
                                        <td>{entradaData.tiempo_op[i]}</td>
                                        <td>{entradaData.tiempo_es[i]}</td>
                                        <td>{entradaData.tiempo_pe[i]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Row className="mb-4 w-100 justify-content-center">
                <BotonesInferiores
                    onCorrerSimulacion={handleCorrerSimulacion}
                    simulacionData={simulacionData}
                    onCompararSimulaciones={handleOpenComparar}
                />
            </Row>
        </Container>

    );
};

export default Simulador;
