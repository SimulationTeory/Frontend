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


  const sumPath = (tiemposPert = {}, path = []) => {
    if (!tiemposPert || !path) return 0;
    return path.reduce((acc, edgeKey) => {
      const v = tiemposPert[edgeKey];

      const num = typeof v === "number" ? v : (v ? parseFloat(v) : 0);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  };


  const marcarCriticos = (nodes = [], path = []) => {
    return nodes.map((n) => ({
      ...n,
      critical: !!n.critical || path.some((p) => p.includes(String(n.id))),
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
          {simulaciones.map((sim, idx) => {





            return (
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
                      <h4 className="text-center mb-3">{sim.nombre}</h4>
                    )}



                    {/* PATH A */}
                    <h5 className="text-center">Path A</h5>
                    <div><strong>Duracion Total de proyecto:</strong> {sim.SemanasC1} semanas</div>
                    <SvgComponent
                      simData={{
                        nodesData: marcarCriticos(sim.nodesA || [], sim.pathA || []),
                        pathData: sim.pathA || [],
                        tiemposPert: sim.tiemposPert_A || {},
                      }}
                    />

                    {/* PATH B */}
                    <h5 className="text-center mt-4">Path B</h5>
                    <h6>Si se contrata viajantes con experiencia pudiendo eliminar el período de instrucción, ¿se puede introducir el nuevo producto 7 semanas antes?</h6>
                    <div><strong>Duracion total de proyecto: </strong> {sim.SemanasC2} semanas</div>
                    <div><strong>Varianza:</strong> {sim.varianza}</div>
                    <div><strong>Probabilidad de que se realice en menos de 30 semanas:</strong> {(sim.probabilidad * 100)}%</div>
                    <SvgComponent
                      simData={{
                        nodesData: marcarCriticos(sim.nodesB || [], sim.pathB || []),
                        pathData: sim.pathB || [],
                        tiemposPert: sim.tiemposPert_B || {},
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
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
                    <h4 className="text-center mb-3">Simulación {idx + 1}</h4>
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
