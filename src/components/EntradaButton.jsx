import React from "react";
import { Button } from "react-bootstrap";

const EntradaButton = () => {
    return (
        <Button
            variant="light"
            style={{
                borderRadius: "20px",
                border: "1px solid black",
                padding: "0.5rem 1rem",
            }}
        >
            Datos de Entrada
        </Button>
    );
};

export default EntradaButton;