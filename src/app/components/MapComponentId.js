import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css'; 

const MapComponentId = ({ id }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [nom, setNom] = useState('');
    const [notes, setNotes] = useState('');
    const [commentaires, setCommentaires] = useState('');
    const [dataenergieId, setDataenergieId] = useState('');

    const mapRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/dataenergie/${id}`);
                const data = await response.json();
                setSelectedItem(data);
                setDataenergieId(data.id);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (mapRef.current && selectedItem) {
            const L = require('leaflet');
            const { geo, energie } = selectedItem;
            const [latitude, longitude] = geo.split(',').map(coord => parseFloat(coord.trim()));
    
            if (!isNaN(latitude) && !isNaN(longitude)) {
                let map = mapRef.current.map;
    
                if (!map) {
                    map = L.map(mapRef.current).setView([latitude, longitude], 12); 
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);
                    mapRef.current.map = map;
                } else {
                    map.flyTo([latitude, longitude], 12); 
                    map.eachLayer(layer => {
                        if (layer instanceof L.Marker) {
                            map.removeLayer(layer);
                        }
                    });
                }
    
                const iconUrl = energie === 'Électricité' ? 'https://accidentprediction.fr/resources/red.png' : 'https://cdn2.iconfinder.com/data/icons/user-interface-icons-bundle-2/32/150-512.png';
                const customIcon = L.icon({
                    iconUrl: iconUrl,
                    iconSize: [40, 40],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41]
                });
                const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
                marker.bindPopup(`${selectedItem.grd} - ${selectedItem.adresse}, ${selectedItem.commune},${selectedItem.departement},${selectedItem.telephone},${selectedItem.contact},${selectedItem.eic},${selectedItem.siteweb},${selectedItem.codepostal},${selectedItem.codecommune},${selectedItem.depnom},${selectedItem.regnom},${selectedItem.energie},${selectedItem.pdl},${selectedItem.sdes}`);
            }
        }
    }, [selectedItem]);
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/avis/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nom,
                    notes,
                    commentaires,
                    dataenergie_id: dataenergieId,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de l\'avis');
            }

            console.log('Avis créé');
            setNom('');
            setNotes('');
            setCommentaires('');
            setDataenergieId('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="containerMap flex">
            <div className="infoContainer departmentInfoId">
                <h2>Informations sur l'entreprise</h2>
                <ul>
                    <li><strong>Nom:</strong> {selectedItem?.code}</li>
                    <li><strong>GRD:</strong> {selectedItem?.grd}</li>
                    <li><strong>Adresse:</strong> {selectedItem?.adresse}</li>
                    <li><strong>Département:</strong> {selectedItem?.departement}</li>
                    <li><strong>Téléphone:</strong> {selectedItem?.telephone}</li>
                    <li><strong>Contact:</strong> {selectedItem?.contact}</li>
                    <li><strong>EIC:</strong> {selectedItem?.eic}</li>
                    <li><strong>Site Web:</strong> {selectedItem?.siteweb}</li>
                    <li><strong>Code Postal:</strong> {selectedItem?.codepostal}</li>
                    <li><strong>Code Commune:</strong> {selectedItem?.codecommune}</li>
                    <li><strong>Commune:</strong> {selectedItem?.commune}</li>
                    <li><strong>Département Nom:</strong> {selectedItem?.depnom}</li>
                    <li><strong>Région Nom:</strong> {selectedItem?.regnom}</li>
                    <li><strong>Énergie:</strong> {selectedItem?.energie}</li>
                    <li><strong>PDL:</strong> {selectedItem?.pdl}</li>
                    <li><strong>SDES:</strong> {selectedItem?.sdes}</li>
                    <li><strong>Géo:</strong> {selectedItem?.geo}</li>
                </ul>
                <div className="avisFormContainer">
                <h2>Ajouter un avis</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Pseudo :
                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Notes:
                            <input
    type="number"
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    max="20"
    required
/>

                        </label>
                    </div>
                    <div>
                        <label>
                            Commentaires:
                            <textarea
                                value={commentaires}
                                onChange={(e) => setCommentaires(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <input
                            type="hidden"
                            value={dataenergieId}
                        />
                    </div> 
                 <div className='soumettre'>   <button type="submit">Soumettre</button> </div>
                </form>
            </div>
            </div>
            <div className="mapContainer mapContainerId">
                <div style={{ width: '100%', height: '90vh' }} ref={mapRef}></div>
            </div>
            
        </div>
    );
};

export default MapComponentId;
