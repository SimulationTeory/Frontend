import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import EntradaButton from "./EntradaButton";
import AreaLogica from "./AreaLogica";
import BotonesInferiores from "./BotonesInferiores";

const Simulador = () => {
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
            <Row className="flex-grow-1 w-100 justify-content-center align-items-center">
                <Col xs={10} md={9} lg={8}>
                    <AreaLogica />
                </Col>
            </Row>

            {/* Botones inferiores */}
            <Row className="mb-4 w-100 justify-content-center">
                <BotonesInferiores />
            </Row>
        </Container>
    );
};

export default Simulador;
