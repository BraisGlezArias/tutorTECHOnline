import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import '../css/contact.css';

export function Contact() {
    return (
        <React.Fragment>
            <Header />
            <section className="pages">
                <h1>Contacto</h1>
                <h2>Para cualquier tema podéis contactar a través de Linkedin o a través de nuestro correos:</h2>
            </section>
            <div id="content">
                <ul>
                    <li id="content1">
                        <h2>Brais González Arias</h2>
                        <p>brais.gonzalez.arias@gmail.com</p>
                        <img src={require('../images/brais.jpg')} width='180' height='180' alt="Imagen Brais" />
                    </li>
                    <li id="content2">
                        <h2>Lucía Lameiro Alba</h2>
                        <p>lucialameiro@yahoo.com</p>
                        <img src={require('../images/lucia.jpg')} width='180' height='180' alt="Imagen Lucía" />
                    </li>
                    <li id="content3">
                        <h2>Enrique Quereda Rodríguez</h2>
                        <p>queredaenrique@gmail.com</p>
                        <img src={require('../images/enrique.jpg')} width='180' height='180' alt="Imagen Enrique" />
                    </li>
                </ul>
                <section id="images-link">
                    <img src={require('../images/linkedin.jpg')} width='420' height='140' alt="Imagen Linkedin" />
                </section>
            </div>
            <Footer />
        </React.Fragment >
    );
}