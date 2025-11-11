import React, { useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import SvgComponent from "./SvgComponent";

const AreaLogica = ({ data }) => {

  useEffect(() => {
    if (!data || !data.nodes) return;

    const updateNodes = () => {
      data.nodes.forEach((node) => {
        const g = document.getElementById(`Nodo${node.id}`);
        if (!g) return;

        ["early", "latest", "slack"].forEach((type) => {
          const textEl = g.querySelector(`#${type}_${node.id} text`);
          if (textEl) {
            if (type === "early") textEl.textContent = node.early;
            if (type === "latest") textEl.textContent = node.latest;
            if (type === "slack") textEl.textContent = node.holgura;
          }
        });

        const paths = g.querySelectorAll("path");
        paths.forEach((path) => {
          path.setAttribute("stroke", node.critical ? "red" : "black");
          path.setAttribute("stroke-width", node.critical ? 2 : 1);
        });
      });
    };

    const updateEdges = () => {
      if (!data.pathA) return;
      data.pathA.forEach((edge) => {
        const el = document.getElementById(`edge-${edge}`);
        if (el) {
          el.setAttribute("stroke", "red");
          el.setAttribute("stroke-width", 2);
        }
      });
    };

    updateNodes();
    updateEdges();
  }, [data]);

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
        <SvgComponent />
        {!data ? (
          <>
            <Spinner animation="border" role="status" size="sm" />
            <p style={{ marginTop: "1rem" }}>Presiona "Correr Simulación" para actualizar los nodos.</p>
          </>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default AreaLogica;
