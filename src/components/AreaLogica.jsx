import React, { useState } from "react";
import { Card, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import SvgComponent from "./SvgComponent";
import GanttChart from "./GanttChart";

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


  const marcarCriticos = (nodes, path) => {
    const criticalEdgeSet = new Set(path.map((e) => `edge-${e}`));
    return nodes.map((n) => ({
      ...n,
      critical: path.some((p) => p.includes(`${n.id}`)), 
      edgesCritical: criticalEdgeSet, 
    }));
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {/* Botones para cambiar vista */}
      <ButtonGroup className="mb-3">
        <Button
          variant={vista === "PERT" ? "primary" : "outline-primary"}
          onClick={() => setVista("PERT")}
        >
          PERT
        </Button>
        <Button
          variant={vista === "GANTT" ? "primary" : "outline-primary"}
          onClick={() => setVista("GANTT")}
        >
          Gantt
        </Button>
      </ButtonGroup>

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
                      nodesData: marcarCriticos(sim.nodesA, sim.pathA),
                      pathData: sim.pathA,
                      tiemposPert: sim.tiemposPert_A,
                    }}
                  />

                  {/* PATH B */}
                  <h5 className="text-center mt-4">Path B</h5>
                  <SvgComponent
                    simData={{
                      nodesData: marcarCriticos(sim.nodesB, sim.pathB),
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
            <Col key={idx} md={12}>
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

                  <GanttChart simData={sim} path="A" keyPrefix={`sim${idx}-A-`} />
                  <GanttChart simData={sim} path="B" keyPrefix={`sim${idx}-B-`} />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AreaLogica;
