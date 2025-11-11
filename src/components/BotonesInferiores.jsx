import React from "react";
import { Col, Button } from "react-bootstrap";

const BotonesInferiores = () => {
    const botones = [
        "Correr Simulación",
        "Guardar Simulación",
        "Comparar Simulaciones",
        "Exportar a PDF",
    ];

    return (
        <>
            {botones.map((texto, index) => (
                <Col key={index} xs="auto">
                    <Button
                        variant="light"
                        style={{
                            borderRadius: "20px",
                            border: "1px solid black",
                            margin: "0 10px",
                            padding: "0.5rem 1.2rem",
                        }}
                    >
                        {texto}
                    </Button>
                </Col>
            ))}
        </>
    );
};

export default BotonesInferiores;