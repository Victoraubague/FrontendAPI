import React, { useState, useEffect } from 'react';

const AvisComponent = () => {
    const [avis, setAvis] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const avisResponse = await fetch('http://localhost:8000/api/avis/');
                const avisData = await avisResponse.json();

                const avisWithEnterprise = await Promise.all(
                    avisData.map(async (avisItem) => {
                        if (avisItem.dataenergie_id !== null) {
                            const dataenergieResponse = await fetch(`http://localhost:8000/api/dataenergie/${avisItem.dataenergie_id}`);
                            const dataenergieData = await dataenergieResponse.json();
                            const grd = dataenergieData.grd;

                            return {
                                ...avisItem,
                                grd: grd,
                            };
                        } else {
                            return avisItem;
                        }
                    })
                );

                setAvis(avisWithEnterprise);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const calculerMoyenneNotes = (grd) => {
        const avisEntreprise = avis.filter((avisItem) => avisItem.grd === grd);
        if (avisEntreprise.length === 0) return 0; // Retourne 0 s'il n'y a pas d'avis pour cette entreprise
        const totalNotes = avisEntreprise.reduce((acc, cur) => acc + cur.notes, 0);
        return totalNotes / avisEntreprise.length;
    };

    const entreprisesTrie = [...new Set(avis.map((avisItem) => avisItem.grd))].sort((a, b) => {
        return calculerMoyenneNotes(b) - calculerMoyenneNotes(a);
    });

    const troisPremieresEntreprises = entreprisesTrie.slice(0, 3);

    return (
        <div className="container">
            <h2 className="titrecentre">Classement des entreprises</h2>
            <ul className="grid-container">
                {troisPremieresEntreprises.map((grd) => (
                    <li key={grd} className="grid-item">
                        <h3>Entreprise: {grd}</h3>
                        <p>Moyenne des notes: {calculerMoyenneNotes(grd)}</p>
                    </li>
                ))}
            </ul>
            <h2 className="titrecentre">Liste des avis</h2>
            <ul className="grid-container">
                {avis.map((avisItem) => (
                    <li key={avisItem.id} className="grid-item">
                        <h3>Pseudo : {avisItem.nom}</h3>
                        <p>Notes: {avisItem.notes}/20</p>
                        <p>Commentaires: {avisItem.commentaires}</p>
                        {avisItem.grd && (
                            <p>
                                Entreprise: {avisItem.grd} 
                                <p> Moyenne des notes: {calculerMoyenneNotes(avisItem.grd)} </p>
                            </p>

                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvisComponent;
