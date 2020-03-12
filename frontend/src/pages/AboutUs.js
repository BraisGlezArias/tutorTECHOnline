import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import '../css/about.css';

export function AboutUs() {
    return (
        <React.Fragment>
            <main id="about">
                <Header />
                <section id="tittle">
                    <h1>Sobre Nosotros</h1>
                </section>
                <section id="body">
                    <p>Creadores juniors de todo el desarrollo web de TutorTechOnline.</p>
                    <p>Hemos desarrollado conjuntamente la creación y contenido de la web, tanto el Backend como el Frontend para el disfrute de nuestros usuarios.</p>
                    <p>Gracias y en gran parte a todo el equipo de HackaBoss por hacerlo posible.</p>
                </section>
                <div id="images">
                    <img src={require('../images/brais.jpg')} width='180' height='180' alt="Imagen Brais" />
                    <img src={require('../images/enrique.jpg')} width='180' height='180' alt="Imagen Enrique" />
                    <img src={require('../images/lucia.jpg')} width='180' height='180' alt="Imagen Lucía" />
                </div>
                <section id="end">
                    <img src={require('../images/hackabos.png')} width='200' height='80' alt="Imagen HackaBos" />
                </section>
                <Footer />
            </main>
        </React.Fragment>
    );
}