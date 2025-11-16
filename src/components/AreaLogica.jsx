import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import SvgComponent from "./SvgComponent";

const AreaLogica = ({ data, simDataComparar }) => {
  const [vista, setVista] = useState("PERT");


  const finalData = simDataComparar ? simDataComparar : data;


  if (!finalData) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Presiona "Correr Simulación" para ver los diagramas.
      </p>
    );
  }


  const isComparacion = Array.isArray(finalData) && finalData.length === 2;


  const simulaciones = isComparacion ? finalData : [finalData];

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {vista === "PERT" ? (
        <Row className="w-100">
          {simulaciones.map((sim, idx) => (
            <Col key={idx} md={isComparacion ? 6 : 12}>
              <Card
                style={{
                  width: "100%",
                  margin: "1rem 0",
                  borderRadius: "10px",
                  padding: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  {isComparacion && (
                    <h4 className="text-center mb-3">
                      Simulación {idx + 1}
                    </h4>
                  )}

                  {/* PATH A */}
                  <h5 className="text-center">Path A</h5>
                  <SvgComponent
                    simData={{
                      nodesData: sim.nodesA,
                      pathData: sim.pathA,
                      tiemposPert: sim.tiemposPert_A,
                    }}
                  />

                  {/* PATH B */}
                  <h5 className="text-center mt-4">Path B</h5>
                  <SvgComponent
                    simData={{
                      nodesData: sim.nodesB,
                      pathData: sim.pathB,
                      tiemposPert: sim.tiemposPert_B,
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="w-100">
          {simulaciones.map((sim, idx) => (
            <Col key={idx} md={isComparacion ? 6 : 12}>
              <SvgGantt simData={sim} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AreaLogica;
