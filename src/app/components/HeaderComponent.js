import styles from '../styles/header.scss';

function Header() {
    return (
   
   
        <header className="header">
            <ul className="ul">
                <li className="li" id='liSpe'><img src='../logo.png' alt="" width="120px" /></li>
                <li className="li"><b>ÉlectricitéEnFrance</b>.fr</li>
                <li className="li"></li>
                <li className="li"></li>
                <li className="li"></li>
                <li className="li"></li>
                <li className="li"></li>
            </ul>
            <div className='containerDiv'>
                <div className='div'>
                    <li className="li"><a href='http://localhost:3000'>Utilisation</a></li>
                    <li className="li"><a href='http://localhost:3000/donne'>Données Brut</a></li>

                    <li className="li"><a href='http://localhost:3000/stats'>Statistiques sur les données</a></li>
                    <li className="li"><a href='http://localhost:3000/avis'>Avis et Notes</a></li>

                    <li className="li"><a href='http://localhost:3000/contact'>Nous contacter a</a></li>
                </div>
            </div>
        </header>
    )
}

export default Header;