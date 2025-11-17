import React, { useEffect, useRef, useState } from "react";

const actividadesPERT = [
  { edge: "0-20", desc: "Organizar oficina de ventas" },
  { edge: "20-40", desc: "Contratar viajantes" },
  { edge: "40-60", desc: "Instruir a los viajantes" },
  { edge: "20-50", desc: "Seleccionar agencia de publicidad" },
  { edge: "50-70", desc: "Planificar campaña publicidad" },
  { edge: "70-90", desc: "Dirigir campaña de publicidad" },
  { edge: "0-10", desc: "Diseño de envase del producto" },
  { edge: "10-30", desc: "Instalar dispositivos de envase" },
  { edge: "30-80", desc: "Envasar stocks iniciales" },
  { edge: "0-30", desc: "Solicitar stocks al fabricante" },
  { edge: "20-60", desc: "Seleccionar distribuidores" },
  { edge: "60-80", desc: "Vender a los distribuidores" },
  { edge: "80-90", desc: "Expedir stocks a distribuidores" }
];

const GanttChart = ({ simData, path = "A", keyPrefix = "" }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const transformData = () => {
    if (!simData) return [];

    const nodos = path === "A" ? simData.nodesA : simData.nodesB;
    const tiempos = path === "A" ? simData.tiemposPert_A : simData.tiemposPert_B;
    const pathReal = path === "A" ? simData.pathA : simData.pathB;

    const fechaBase = new Date(2025, 0, 1);

    return actividadesPERT.map((act, index) => {
      const [ini] = act.edge.split("-").map(Number);
      const nodoInicio = nodos.find(n => n.id === ini);
      const early = nodoInicio?.early ?? 0;

      let durSemanas = Number(tiempos[act.edge] ?? 1);
      if (durSemanas <= 0) durSemanas = 1;

      const inicioFecha = new Date(fechaBase);
      inicioFecha.setDate(inicioFecha.getDate() + early * 7);

      const finFecha = new Date(inicioFecha);
      finFecha.setDate(inicioFecha.getDate() + durSemanas * 7);

      const esCritica = pathReal.includes(act.edge);

      return [
        `${keyPrefix}A${index}`,
        act.desc,
        esCritica ? "critic" : "normal",
        inicioFecha,
        finFecha,
        durSemanas,
        0,
        null
      ];
    });
  };

  const totalSemanas = () => {
    if (!simData) return 0;
    const nodos = path === "A" ? simData.nodesA : simData.nodesB;
    if (!nodos.length) return 0;
    return Math.max(...nodos.map(n => n.early));
  };

  useEffect(() => {
    if (!simData) return;

    const load = () => {
      if (window.google && window.google.charts) {
        draw();
        return;
      }

      const s = document.createElement("script");
      s.src = "https://www.gstatic.com/charts/loader.js";
      s.onload = () => {
        window.google.charts.load("current", { packages: ["gantt"] });
        window.google.charts.setOnLoadCallback(draw);
      };
      document.head.appendChild(s);
    };

    const draw = () => {
      if (!window.google || !chartRef.current) return;

      const dt = new google.visualization.DataTable();
      dt.addColumn("string", "Task ID");
      dt.addColumn("string", "Task Name");
      dt.addColumn("string", "Resource");
      dt.addColumn("date", "Start Date");
      dt.addColumn("date", "End Date");
      dt.addColumn("number", "Duration");
      dt.addColumn("number", "Percent Complete");
      dt.addColumn("string", "Dependencies");

      const rows = transformData();
      dt.addRows(rows);

      const options = {
        height: 100 + rows.length * 35,
        width: "100%",
        gantt: {
          trackHeight: 28,
          barCornerRadius: 4,
          palette: [
            { color: "#dc3912", dark: "#b3240f", light: "#f4b4a8" },
            { color: "#3366cc", dark: "#254b99", light: "#c8daf7" }
          ]
        }
      };

      const chart = new google.visualization.Gantt(chartRef.current);
      chart.draw(dt, options);
      setLoaded(true);
    };

    load();

    
    const handleResize = () => {
      draw();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [simData, path]);

  const semanasTotales = totalSemanas();

  return (
    <div id="exportar-simulacion" ref={containerRef}>
      {!loaded && <div>Cargando gráfico Gantt...</div>}
      <h5 style={{ textAlign: "center" }}>Path {path}</h5>

      <div
        style={{
          overflowX: "auto",
          width: "100%",
          marginTop: "5px",
          paddingBottom: "10px"
        }}
      >
        {/* Escala de semanas */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginLeft: "20px",
            fontSize: "13px",
            marginBottom: "5px"
          }}
        >
          {Array.from({ length: semanasTotales + 1 }).map((_, i) => (
            <div key={i}>{i}</div>
          ))}
        </div>

        <div
          ref={chartRef}
          style={{
            width: "100%", 
            minWidth: "600px"
          }}
        />
      </div>
    </div>
  );
};

export default GanttChart;
