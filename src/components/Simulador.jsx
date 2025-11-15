import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import EntradaButton from "./EntradaButton";
import AreaLogica from "./AreaLogica";
import BotonesInferiores from "./BotonesInferiores";
import TablaDatosEntrada from "./TablaDatosEntrada";
import axios from "axios";

const Simulador = () => {
    const [simData, setSimData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [entradaData, setEntradaData] = useState(null);


    const handleOpenModal = () => setModalShow(true);
    const handleCloseModal = () => setModalShow(false);


    const handleEnviarDatos = (data) => {
        setEntradaData(data);
    };


    const correrSimulacion = async () => {
        if (!entradaData) {
            alert("Primero debes seleccionar los Datos de Entrada");
            return;
        }

        setLoading(true);
        try {

            const res = await axios.post(
                "http://localhost:8000/api/simulacion/",
                entradaData
            );

            setSimData(res.data);
        } catch (err) {
            console.error("Error al correr la simulación:", err.response?.data || err.message);
            alert("Ocurrió un error al correr la simulación. Revisa la consola.");
        } finally {
            setLoading(false);
        }
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {/* Botón superior */}
            <Row className="w-100 mt-3">
                <Col xs="auto">
                    <EntradaButton onClick={handleOpenModal} />
                </Col>
            </Row>

            {/* Modal de datos de entrada */}
            <TablaDatosEntrada
                show={modalShow}
                handleClose={handleCloseModal}
                onEnviarDatos={handleEnviarDatos}
            />

            {/* Área central */}
            <Row className="flex-grow-1 justify-content-center align-items-center">
                <Col xs={16} md={14} lg={12}>
                    <AreaLogica data={simData} />
                </Col>
            </Row>

            {/* Botones inferiores */}
            <Row className="mb-4 w-100 justify-content-center">
                <BotonesInferiores
                    onCorrerSimulacion={correrSimulacion}
                    loading={loading}
                />
            </Row>
        </Container>
    );
};

export default Simulador;
