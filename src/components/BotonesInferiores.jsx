import React, { useState } from "react";
import { Col, Button, Spinner } from "react-bootstrap";

const BotonesInferiores = ({ onCorrerSimulacion }) => {
    const [loading, setLoading] = useState(false);

    const handleCorrer = async () => {
        setLoading(true);
        try {
            await onCorrerSimulacion();
        } finally {
            setLoading(false);
        }
    };

    const botones = [
        { texto: "Correr Simulación", action: handleCorrer },
        { texto: "Guardar Simulación", action: () => alert("Función guardar pendiente") },
        { texto: "Comparar Simulaciones", action: () => alert("Función comparar pendiente") },
        { texto: "Exportar a PDF", action: () => alert("Función exportar pendiente") },
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
