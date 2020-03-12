import React from 'react';

import '../css/footer.css'

export function Footer() {

    return (
        <React.Fragment>
            <footer className="footer">
                <div className="footer-site">
                    <a href='/'>
                        TutorTechOnline 2020
                    </a>
                </div>
                <div className="footer-item">
                    <a href="/AboutUs">
                        Sobre Nosotros
                    </a>
                    <a href="/Contact">
                        Contacto
                    </a>
                </div>
            </footer>
        </React.Fragment >
    );
}
