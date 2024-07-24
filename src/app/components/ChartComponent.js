import React, { useState, useEffect, useRef } from 'react';
import { Chart, BarController, BarElement } from 'chart.js/auto';

const GraphComponent = () => {
    const [data, setData] = useState([]);
    const [electricityData, setElectricityData] = useState([]);
    const [gasData, setGasData] = useState([]);
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const chartRef3 = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/dataenergie');
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const electricity = data.filter(item => item.energie === 'Électricité');
            setElectricityData(electricity);

            const gas = data.filter(item => item.energie === 'Gaz');
            setGasData(gas);
        }
    }, [data]);

    useEffect(() => {
        if (electricityData.length > 0) {
            const departments = {};
            electricityData.forEach(item => {
                departments[item.departement] = (departments[item.departement] || 0) + 1;
            });

            const sortedDepartments = Object.keys(departments).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
            const labels1 = sortedDepartments;
            const values1 = sortedDepartments.map(dep => departments[dep]);

            const ctx1 = chartRef1.current;
            if (ctx1) {
                if (ctx1.chart) {
                    ctx1.chart.destroy();
                }
                ctx1.chart = new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: labels1,
                        datasets: [{
                            label: 'Nombre d\'entreprises fournissant de l\'électricité par département',
                            data: values1,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }
    }, [electricityData]);

    useEffect(() => {
        if (gasData.length > 0) {
            const departments = {};
            gasData.forEach(item => {
                departments[item.departement] = (departments[item.departement] || 0) + 1;
            });

            const sortedDepartments = Object.keys(departments).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
            const labels2 = sortedDepartments;
            const values2 = sortedDepartments.map(dep => departments[dep]);

            const ctx2 = chartRef2.current;
            if (ctx2) {
                if (ctx2.chart) {
                    ctx2.chart.destroy();
                }
                ctx2.chart = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: labels2,
                        datasets: [{
                            label: 'Nombre d\'entreprises fournissant du gaz par département',
                            data: values2,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }
    }, [gasData]);

    useEffect(() => {
        if (data.length > 0) {
            const energyTypes = ['Électricité', 'Gaz']; 
            const energyColors = ['red', 'blue']; 

            const energyCounts = {};
            data.forEach(item => {
                if (!energyCounts[item.departement]) {
                    energyCounts[item.departement] = {};
                }
                energyCounts[item.departement][item.energie] = (energyCounts[item.departement][item.energie] || 0) + 1;
            });

            const sortedDepartments = Object.keys(energyCounts).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
            const labels = sortedDepartments;
            const datasets = energyTypes.map((energy, index) => ({
                label: energy,
                data: sortedDepartments.map(department => energyCounts[department][energy] || 0),
                backgroundColor: energyColors[index]
            }));

            const ctx3 = chartRef3.current;
            if (ctx3) {
                if (ctx3.chart) {
                    ctx3.chart.destroy();
                }
                ctx3.chart = new Chart(ctx3, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        scales: {
                            x: {
                                stacked: true
                            },
                            y: {
                                stacked: true
                            }
                        }
                    }
                });
            }
        }
    }, [data]);

    return (
        <div className="chartContainer">
                        <div className="textegraph">Graphique 1 - Électricité par département </div>

            <div className="chart1">
                <canvas ref={chartRef1}></canvas>
               
            </div>
            <div className="textegraph">Graphique 2 - Gaz par département</div>

            <div className="chart1">
                <canvas ref={chartRef2}></canvas>
                
            </div>
            <div className="textegraph">Graphique 3 - Électricité et Gaz par département</div>

            <div className="chart1">

                <canvas ref={chartRef3}></canvas>
            </div>

        </div>
    );
};

export default GraphComponent
