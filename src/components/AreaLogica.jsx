import React, { useState } from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import SvgComponent from "./SvgComponent";


const AreaLogica = ({ data }) => {
  const [vista, setVista] = useState("PERT"); 

  if (!data) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Presiona "Correr Simulación" para ver los diagramas.
      </p>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Botones de pestañas */}
      

      {vista === "PERT" ? (
        <>
          {/* Diagrama Path A */}
          <Card
            style={{
              width: "90%",
              margin: "1rem 0",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Card.Body>
              <h5 className="text-center">Path A</h5>
              <SvgComponent
                simData={{
                  nodesData: data.nodesA,
                  pathData: data.pathA,
                  tiemposPert: data.tiemposPert_A 
                }}
              />
            </Card.Body>
          </Card>

          {/* Diagrama Path B */}
          <Card
            style={{
              width: "90%",
              margin: "1rem 0",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Card.Body>
              <h5 className="text-center">Path B</h5>
              <SvgComponent
                simData={{
                  nodesData: data.nodesB,
                  pathData: data.pathB,
                  tiemposPert: data.tiemposPert_B 
                }}
              />
            </Card.Body>
          </Card>
        </>
      ) : (
        <>
          {/* Diagrama Gantt */}
          <SvgGantt simData={data} />
        </>
      )}
    </div>
  );
};

export default AreaLogica;
