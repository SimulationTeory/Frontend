import React, { useEffect, useRef, useState } from 'react';

const GanttChart = () => {
  const chartRef = useRef(null);
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tus actividades estáticas
  const actividadesFijas = [
    { id: "0-20", nombre: "Organizar oficina de ventas" },
    { id: "20-40", nombre: "Contratar viajantes" },
    { id: "20-50", nombre: "Seleccionar agencia de publicidad" },
    { id: "0-10", nombre: "Diseño de envase del producto" },
    { id: "0-30", nombre: "Solicitar stocks al fabricante" },
    { id: "20-60", nombre: "Seleccionar distribuidores" },
    { id: "40-60", nombre: "Instruir a los viajantes" },
    { id: "50-70", nombre: "Planificar campaña publicidad" },
    { id: "10-30", nombre: "Instalar dispositivos de envase" },
    { id: "60-80", nombre: "Vender a los distribuidores" },
    { id: "70-90", nombre: "Dirigir campaña de publicidad" },
    { id: "30-80", nombre: "Envasar stocks iniciales" },
    { id: "80-90", nombre: "Expedir stocks a distribuidores" }
  ];

  // Obtener datos del backend
  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Conectando con el backend...');
        
        const payload = {
          nodes: actividadesFijas.map(act => act.id),
          tiempo_op: [2, 3, 2, 4, 3, 2, 5, 4, 3, 4, 3, 4, 2],  // Optimista
          tiempo_es: [3, 4, 3, 5, 4, 3, 6, 5, 4, 5, 4, 5, 3],  // Probable
          tiempo_pe: [4, 5, 4, 6, 5, 4, 7, 6, 5, 6, 5, 6, 4]   // Pesimista
        };

        const response = await fetch('http://localhost:8000/api/simulacion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        console.log('Respuesta del servidor:', response.status);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos reales recibidos:', data);
        setSimulationData(data);
        
      } catch (error) {
        console.error('Error conectando al backend:', error);
        setError(`Error de conexión: ${error.message}`);
        
        // Datos de ejemplo como fallback
        setSimulationData({
          actividades: actividadesFijas.map((act, index) => ({
            id: act.id,
            nombre: act.nombre,
            tiempo_temprano: index * 5,
            tiempo_tardio: (index * 5) + 8,
            holgura: [0, 2, 1, 0, 3, 1, 0, 2, 1, 0, 2, 1, 0][index],
            tiempo_pert: [5, 4, 3, 6, 4, 5, 4, 5, 3, 4, 5, 4, 3][index],
            ruta_critica: [true, false, false, true, false, false, true, false, false, true, false, false, true][index]
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSimulationData();
  }, []);

  // Transformar datos al formato Gantt
  const transformDataToGantt = (data) => {
    if (!data || !data.actividades) return [];

    return data.actividades.map(actividad => {
      const fechaBase = new Date(2024, 0, 1); // Fecha base fija
      
      const startDate = new Date(fechaBase);
      startDate.setDate(fechaBase.getDate() + (actividad.tiempo_temprano || 0));
      
      const endDate = new Date(fechaBase);
      endDate.setDate(fechaBase.getDate() + (actividad.tiempo_temprano || 0) + (actividad.tiempo_pert || 1));

      const resource = actividad.ruta_critica ? 'critica' : 'normal';
      
      return [
        actividad.id,
        actividad.nombre,
        resource,
        startDate,
        endDate,
        null,
        0,
        null
      ];
    });
  };

  // Cargar y dibujar el gráfico
  useEffect(() => {
    if (loading || !simulationData) return;

    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        drawChart();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.type = 'text/javascript';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['gantt'] });
        window.google.charts.setOnLoadCallback(drawChart);
      };
      document.head.appendChild(script);
    };

    const drawChart = () => {
      if (!window.google || !chartRef.current) return;

      const data = new window.google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      const ganttData = transformDataToGantt(simulationData);
      
      if (ganttData.length > 0) {
        data.addRows(ganttData);
      }

      const options = {
        height: 600,
        gantt: {
          trackHeight: 25,
          palette: [
            {
              "color": "#dc3912",
              "dark": "#dc3912", 
              "light": "#fad1c9"
            },
            {
              "color": "#3366cc",
              "dark": "#3366cc",
              "light": "#d1e0f7"
            }
          ]
        }
      };

      const chart = new window.google.visualization.Gantt(chartRef.current);
      chart.draw(data, options);
    };

    loadGoogleCharts();
  }, [loading, simulationData]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div>Conectando con el servidor...</div>
        <small>Calculando ruta crítica...</small>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div style={{ 
          color: '#856404', 
          backgroundColor: '#fff3cd', 
          padding: '12px', 
          marginBottom: '15px',
          border: '1px solid #ffeaa7',
          borderRadius: '4px'
        }}>
          ⚠️ {error} - Mostrando datos de ejemplo
        </div>
      )}
      
      {!error && (
        <div style={{ 
          color: '#155724', 
          backgroundColor: '#d4edda', 
          padding: '12px', 
          marginBottom: '15px',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          ✅ Conectado al backend - Mostrando datos reales
        </div>
      )}
      
      {/* Leyenda */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '20px', height: '10px', backgroundColor: '#dc3912' }}></div>
          <span>Ruta Crítica</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '20px', height: '10px', backgroundColor: '#3366cc' }}></div>
          <span>Actividad Normal</span>
        </div>
      </div>

      {/* Gráfico Gantt */}
      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          minHeight: '600px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default GanttChart;