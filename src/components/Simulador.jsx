import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import EntradaButton from "./EntradaButton";
import AreaLogica from "./AreaLogica";
import BotonesInferiores from "./BotonesInferiores";
import axios from "axios";

const Simulador = () => {
    const [simData, setSimData] = useState(null); 
    const [loading, setLoading] = useState(false); 

    const correrSimulacion = async () => {
        setLoading(true);
        try {
            const nodes = [
                "0−20", "20−40", "40−60", "20−50", "50−70", "70−90",
                "0−10", "10−30", "30−80", "0−30", "20−60", "60−80", "80−90"
            ];

            const res = await axios.post("http://localhost:8000/api/simulacion/", {
                nodes,
                tiempo_op: [4, 2, 3, 1, 1, 4, 1, 4, 4, 9, 5, 4, 3],
                tiempo_es: [5.5, 4, 6, 2, 4, 10, 2, 10.5, 6, 13, 9, 5.5, 5.5],
                tiempo_pe: [10, 6, 15, 3, 7, 16, 3, 14, 8, 17, 13, 10, 11],
            });

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
                    <EntradaButton />
                </Col>
            </Row>

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
