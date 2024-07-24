"use client"
import React from 'react';
import '../styles/styles.css'; 

import Header from '../components/HeaderComponent';
import AllDataPage from '../components/DonneComponent'; 

function Page() {
    return (
        <div>
            <Header />
            <div className="container">
                <AllDataPage />
            </div>
        </div>
    );
}

export default Page;
