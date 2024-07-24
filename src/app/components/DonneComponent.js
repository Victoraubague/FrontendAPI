import { useEffect, useState } from "react";
import Link from 'next/link'; 
import '../styles/styles.css'; 

function AllDataPage() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [maxPages, setMaxPages] = useState(1);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        try {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const response = await fetch('http://127.0.0.1:8000/api/dataenergie');
            if (!response.ok) {
                throw new Error('Erreur de l\'API');
            }
            const jsonData = await response.json();
            const slicedData = jsonData.slice(startIndex, endIndex);
            setData(slicedData);
            setMaxPages(Math.ceil(jsonData.length / itemsPerPage));
        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
        }
    };

    const nextPage = () => {
        if (currentPage < maxPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (data.length === 0 && currentPage <= maxPages) {
        return <p className="text-center mt-4">Chargement en cours...</p>;
    } else if (data.length === 0 && currentPage > maxPages) {
        return <p className="text-center mt-4">Plus de données à afficher</p>;
    }

    return (
        <div className="container mx-auto px-4 bg-red-500">
                                         <div class="titrecentre">Toute les entreprise !</div>

            <div className="grid-container">
              
                {data.map((item, index) => (
                    <div key={index} className={`grid-item ${index % 3 === 0 ? 'grid-item-wide' : ''}`}>
                        <p className="text-gray-700">Nom: {item.code}</p>
                        <p className="text-gray-700">Adresse: {item.adresse}</p>
                        <Link href={`/entreprise/${item.id}`} className="text-blue-500">
                            Voir plus d'informations sur cette entreprise
                        </Link>
                    </div>
                ))}
            </div>
            <div class="bouton">
            <div className="flex justify-between mt-4">
                <button onClick={prevPage} disabled={currentPage === 1} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50">Page précédente</button>
                <button onClick={nextPage} disabled={currentPage === maxPages} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50">Page suivante</button>
            </div>
            </div>
        </div>
    );
}

export default AllDataPage;
