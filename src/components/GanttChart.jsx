import React, { useEffect, useRef, useState } from 'react';

const nodosFijos = [
    "Organizar oficina de ventas",
    "Contratar viajantes",
    "Instruir a los viajantes",
    "Seleccionar agencia de publicidad",
    "Planificar campaña publicidad",
    "Dirigir campaña de publicidad",
    "Diseño de envase del producto",
    "Instalar dispositivos de envase",
    "Envasar stocks iniciales",
    "Solicitar stocks al fabricante",
    "Seleccionar distribuidores",
    "Vender a los distribuidores",
    "Expedir stocks a distribuidores"
];

const GanttChart = ({ simData, path = 'A', keyPrefix = '' }) => {
    const chartRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    const transformDataToGantt = () => {
        if (!simData) return [];

        const nodes = path === 'A' ? simData.nodesA : simData.nodesB;
        const tiemposPert = path === 'A' ? simData.tiemposPert_A : simData.tiemposPert_B;

        const fechaBase = new Date(2025, 0, 1);

        return nodosFijos.map((descripcion, idx) => {
            const nodeData = nodes[idx] || { early: 0, critical: false, id: idx };


            const actividadId = Object.keys(tiemposPert).find(key =>
                key === `${nodeData.id}-${nodeData.id + 10}` || key.startsWith(`${nodeData.id}-`) || key.endsWith(`-${nodeData.id}`)
            );

            let duracionSemanas = tiemposPert[actividadId] ?? 1;
            if (duracionSemanas <= 0) duracionSemanas = 1;

            const startDate = new Date(fechaBase);

            startDate.setDate(startDate.getDate() + (nodeData.early ?? 0) * 7);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + duracionSemanas * 7);

            const resource = nodeData.critical ? 'critica' : 'normal';

            return [
                `${keyPrefix}activity-${idx}`,
                descripcion,
                resource,
                startDate,
                endDate,
                null,
                0,
                null
            ];
        });
    };

    useEffect(() => {
        if (!simData) return;

        const loadGoogleCharts = () => {
            if (window.google && window.google.charts) {
                drawChart();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/charts/loader.js';
            script.onload = () => {
                window.google.charts.load('current', { packages: ['gantt'] });
                window.google.charts.setOnLoadCallback(drawChart);
            };
            document.head.appendChild(script);
        };

        const drawChart = () => {
            if (!window.google || !chartRef.current) return;

            const dataTable = new window.google.visualization.DataTable();
            dataTable.addColumn('string', 'Task ID');
            dataTable.addColumn('string', 'Task Name');
            dataTable.addColumn('string', 'Resource');
            dataTable.addColumn('date', 'Start Date');
            dataTable.addColumn('date', 'End Date');
            dataTable.addColumn('number', 'Duration');
            dataTable.addColumn('number', 'Percent Complete');
            dataTable.addColumn('string', 'Dependencies');

            const ganttData = transformDataToGantt();
            if (ganttData.length > 0) dataTable.addRows(ganttData);

            const options = {
                height: 50 + ganttData.length * 40,
                gantt: {
                    trackHeight: 30,
                    palette: [
                        { color: '#dc3912', dark: '#dc3912', light: '#fad1c9' },
                        { color: '#3366cc', dark: '#3366cc', light: '#d1e0f7' }
                    ]
                }
            };

            const chart = new window.google.visualization.Gantt(chartRef.current);
            chart.draw(dataTable, options);
            setLoaded(true);
        };

        loadGoogleCharts();
    }, [simData, path, keyPrefix]);

    if (!simData) return <div>Cargando datos...</div>;

    return (
        <div>
            {!loaded && <div>Cargando gráfico Gantt...</div>}

            <h5 style={{ textAlign: 'center', marginTop: '10px' }}>Path {path}</h5>
            <div
                ref={chartRef}
                style={{ width: '100%', minHeight: '400px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
        </div>
    );
};

export default GanttChart;
