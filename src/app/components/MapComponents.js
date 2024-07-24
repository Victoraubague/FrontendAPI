import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css'; 

const MapComponent = () => {
    const [data, setData] = useState([]);
    const [sortBy, setSortBy] = useState('departement');
    const [departements, setDepartements] = useState([]);
    const [selectedEnergy, setSelectedEnergy] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('01');
    const [selectedItem, setSelectedItem] = useState(null);
    const [departmentData, setDepartmentData] = useState([]);
    const mapRef = useRef(null);
    const departmentRef = useRef(null);

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
            const uniqueDepartements = [...new Set(data.map(item => item.departement))];
            const sortedDepartements = uniqueDepartements.sort();
            setDepartements(sortedDepartements);
        }
    }, [data]);

    useEffect(() => {
        if (!data.length) return;
        const defaultDepartmentExists = data.some(item => item.departement === '02');
        if (!defaultDepartmentExists) return;
        setSelectedDepartment('');
    }, [data]);

    useEffect(() => {
        if (!data.length || selectedItem) return;
        const randomIndex = Math.floor(Math.random() * data.length);
        setSelectedItem(data[randomIndex]);
    }, [data, selectedItem]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window !== null && mapRef.current && data.length > 0) {
            const L = require('leaflet');

            if (!mapRef.current.map) {
                const map = L.map(mapRef.current).setView([46.5, 2.3522], 5);
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: '© Mapbox',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11', 
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoidmlhdWJhZ3VlIiwiYSI6ImNsdTBibWJ1eTA3bG8ycnQ0NGRzMDVzZ2sifQ.iJktfguHubUZehGWFEBrJg' 
                }).addTo(map);
                mapRef.current.map = map;
            }

            const map = mapRef.current.map;
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            const markerIcons = {
                'Électricité': 'https://accidentprediction.fr/resources/red.png',
                'Gaz': 'https://cdn2.iconfinder.com/data/icons/user-interface-icons-bundle-2/32/150-512.png'
            };

            const filteredData = sortBy === 'departement' ? data : data.filter(item => item.departement === sortBy);
            filteredData.forEach(item => {
                if (selectedEnergy === 'all' || item.energie === selectedEnergy) {
                    const { geo, energie } = item;
                    if (geo) { // Check if 'geo' is not null or undefined
                        const [latitude, longitude] = geo.split(',').map(coord => parseFloat(coord.trim()));
                        if (!isNaN(latitude) && !isNaN(longitude)) {
                            const iconUrl = markerIcons[energie];
                            if (iconUrl) { // Vérifiez si une URL d'icône est définie pour ce type d'énergie
                                const customIcon = L.icon({
                                    iconUrl: iconUrl,
                                    iconSize: [40, 41],
                                    iconAnchor: [12, 41],
                                    popupAnchor: [1, -34],
                                    tooltipAnchor: [16, -28],
                                    shadowSize: [41, 41]
                                });
                                const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
                                marker.bindPopup(`${item.grd} - ${item.adresse}, ${item.commune},${item.codecommune},${item.depnom},${item.regnom}`);
                                marker.on('click', () => {
                                    setSelectedItem(item);
                                    setSelectedDepartment(null);
                                    departmentRef.current.scrollTop = 0;
                                });
                            } else {
                                console.error(`No icon URL defined for energy type: ${energie}`);
                            }
                        }
                    }
                }
            });
        }
    }, [data, sortBy, selectedEnergy]);

    useEffect(() => {
        if (selectedDepartment && data.length > 0) {
            const filteredData = data.filter(item => item.departement === selectedDepartment);
            setDepartmentData(filteredData);
            setSelectedItem(null);
            mapRef.current.map.closePopup();
        }
    }, [selectedDepartment]);

    const handleSortChange = (event) => {
        const selectedDep = event.target.value;
        setSortBy(selectedDep);
        setSelectedDepartment(selectedDep);
    };

    const handleEnergyChange = (energy) => {
        setSelectedEnergy(energy);
        setSelectedDepartment(null);
    };

    return (
        <>
            <div className="menuContainer">
                <div className="p-4">
                    <h2 className="menuTitle">Choisi ton departement !</h2>
                    <select className="menuSelect mb-4" value={sortBy} onChange={handleSortChange}>
                        <option value="departement">Choisi le département</option>
                        {departements.map((dep, index) => (
                            <option key={index} value={dep}>{dep}</option>
                        ))}
                    </select>
                    <h2 className="menuTitle">Choisi ton Energie</h2>

                    <button className="menuButton mr-2" onClick={() => handleEnergyChange('all')}>Tout</button>
                    <button className="menuButton mr-2" onClick={() => handleEnergyChange('Électricité')}>Électricité</button>
                    <button className="menuButton" onClick={() => handleEnergyChange('Gaz')}>Gaz</button>
                </div>
            </div>

            <div className="flex">
                <div className="departmentInfo">
                    <div className="flex-1 p-4" ref={departmentRef}>
                        <div className="selectedItem mb-4">
                            {selectedItem && (
                                <div>
                                    <h2>Informations sur l'élément sélectionné</h2>
                                    <ul>
                                        <li>Nom: {selectedItem.grd}</li>
                                        <li>Commune: {selectedItem.commune}</li>
                                        <li>Téléphone: {selectedItem.telephone}</li>
                                        <li>Code postal: {selectedItem.codepostal}</li>
                                    </ul>
                                    <Link href={`/entreprise/${selectedItem.id}`} className="text-blue-500">
                                        Voir plus d'informations sur cette entreprise
                                    </Link>
                                </div>
                            )}
                        </div>

                        {departmentData.length > 0 && (
                            <div className="departmentData">
                                <h2>Informations sur les éléments du département sélectionné</h2>
                                <ul>
                                    {departmentData.map((item, index) => (
                                        <li key={index}>
                                            <strong>{item.grd}:</strong> {item.telephone} ; {item.contact} ; {item.codepostal}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mapContainer">
                    <div style={{ width: '100%', height: '100%' }} ref={mapRef}></div>
                </div>
            </div>
        </>
    );
};


export default MapComponent;
