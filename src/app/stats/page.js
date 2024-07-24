"use client"
import React from 'react';
import Header from '../components/HeaderComponent';
import ChartComponent from '../components/ChartComponent';
import '../styles/styles.css'; 

const Page = () => {
    return (
        <div>
            <Header />
            <ChartComponent />
            <div className="containerDiv">
                <div className="div">
                    {/* Ajoutez d'autres composants ou du contenu ici si nécessaire */}
                </div>
            </div>
            <div className="containerMap">
                {/* Ajoutez d'autres composants ou du contenu ici si nécessaire */}
            </div>
        </div>
    );
};

export default Page;
