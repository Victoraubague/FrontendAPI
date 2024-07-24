"use client"
import React from 'react';
import Header from '../app/components/HeaderComponent';
import MapComponent from '../app/components/MapComponents';
import ChartComponent from '../app/components/ChartComponent';

const Page = () => {
    return (
        <div>
            
            <Header />
            <div className="containerDiv">
                <div className="div">
                    <div className="textLeft">Les différents fournisseurs d'Électricité en France selon son département.</div>
                </div>
            </div>
            <div className="containerMap">

            <MapComponent />
            </div>
        </div>
    );
};

export default Page;
