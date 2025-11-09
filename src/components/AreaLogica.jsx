import React from "react";
import { Card } from "react-bootstrap";
import SvgComponent from "./SvgComponent";

const AreaLogica = () => {
    return (
        <Card
            style={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "10px",
                minHeight: "400px",
                textAlign: "center",
                padding: "2rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <SvgComponent></SvgComponent>
                <p>    
                    Aquí ocurrirá toda la lógica, agregar pantallas de carga (spinners)
                </p>
                <p style={{ fontSize: "0.9rem", marginTop: "8rem" }}>
                    El botón de guardar simulación, aparte de guardarla, también limpiará
                    la pantalla
                </p>
            </Card.Body>
        </Card>
    );
};

export default AreaLogica;
