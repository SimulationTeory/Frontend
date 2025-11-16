import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Simulador from "./components/Simulador";
import GanttChart from "./components/GanttChart";

function App() {
  return (
    <div style={{ width: "100vw", height: "150vh"}}>
      <Simulador/>
       <h1>Diagrama de Gantt - Proyecto de Ventas</h1>
      <GanttChart />
      
    </div>
  );
}

export default App;
