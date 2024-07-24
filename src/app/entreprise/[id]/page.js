"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from '../../components/HeaderComponent';
import MapIdComponent from '../../components/MapComponentId'; 

function Id() {
    const { id } = useParams();
    const [companyData, setCompanyData] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://127.0.0.1:8000/api/dataenergie/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur de l\'API');
                    }
                    return response.json();
                })
                .then(data => {
                    setCompanyData(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [id]);

    if (!companyData) {
        return <p>Chargement en cours...</p>;
    }

    return (
        <div>
            <Header />
            <div>
                
            </div>
            <MapIdComponent id={id} />
        </div>
    );
}

export default Id;
