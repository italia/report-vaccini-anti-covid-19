import React from "react";

export const FooterBar = () => {
    return (
        <>
            <footer className="row m-0 bg-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-2 no-grid pb-2">
                            <a title="Collegamento al sito www.salute.gov.it. Apre una nuova pagina." href="https://www.salute.gov.it/">
                                <img src="logo.svg" alt="Logo" />
                            </a>
                        </div>
                        <div className="col-md-6 no-grid pb-2">
                            <p className="footer-title h3">© 2022 - Testata di proprietà del Ministero della Salute</p>
                        </div>
                        <div className="col-md-4 no-grid pb-2">
                            <div className="social-section">
                                <span id="social-footer">
                                    <a title="Collegamento alla pagina Facebook del Ministero della Salute. Apre una nuova pagina." href="https://www.facebook.com/MinisteroSalute">
                                        <span className="fab fa-facebook">
                                        </span>
                                    </a>
                                    <a title="Collegamento alla pagina Twitter del Ministero della Salute. Apre una nuova pagina." href="https://twitter.com/ministerosalute">
                                        <span className="fab fa-twitter">
                                        </span>
                                    </a>
                                    <a title="Collegamento al canale Youtube del Ministero della Salute. Apre una nuova pagina." href="https://www.youtube.com/user/MinisteroSalute">
                                        <span className="fab fa-youtube">
                                        </span>
                                    </a>
                                    <a title="Collegamento alla pagina Instagram del Ministero della Salute. Apre una nuova pagina." href="https://www.instagram.com/ministerosalute">
                                        <span className="fab fa-instagram">
                                        </span>
                                    </a>
                                    <a title="Collegamento al canale Telegram del Ministero della Salute. Apre una nuova pagina." href="https://t.me/MinisteroSalute">
                                        <span className="fab fa-telegram">
                                        </span>
                                    </a>
                                    <a title="Collegamento alla pagina Linkedin del Ministero della Salute. Apre una nuova pagina." href="https://www.linkedin.com/company/MinisteroSalute">
                                        <span className="fab fa-linkedin">
                                        </span>
                                    </a>
                                </span>
                                <a className="button-open-data" href="https://www.governo.it/it/dipartimenti/unit-il-completamento-della-campagna-vaccinale-e-ladozione-di-altre-misure-di-contrasto" aria-label="vai all'area Covid-19" rel="noreferrer" alt="vai all'area Covid-19"><b>Open Data <span className="fa-solid fa-chevron-right"></span></b></a>
                            </div>


                        </div>
                    </div>
                    <div className="row">
                        <ul className="footer-links col-12">
                            <li>
                                <a title="Mappa" href="https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5343&area=nuovoCoronavirus&menu=vuoto">Mappa</a>
                            </li>
                            <li>
                                <a title="Link" href="https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5344&area=nuovoCoronavirus&menu=vuoto">Link</a>
                            </li>
                            <li>
                                <a title="Credits" href="https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5345&area=nuovoCoronavirus&menu=vuoto">Credits</a>
                            </li>
                            <li>
                                <a title="Note legali" href="https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5185&area=nuovoCoronavirus&menu=vuoto">Note legali</a>
                            </li>
                            <li>
                                <a title="Privacy" href="https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5186&area=nuovoCoronavirus&menu=vuoto">Privacy</a>
                            </li>
                            <li>
                                <a title="Social Media Policy" href="https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5500&area=nuovoCoronavirus&menu=vuoto">Social Media Policy</a>
                            </li>
                            <li>
                                <a title="Accessibilità" href="https://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?lingua=italiano&id=5229&area=nuovoCoronavirus&menu=vuoto">Accessibilità</a>
                            </li>
                            <li>
                                <a href="https://form.agid.gov.it/view/90fa205d-e0e3-4521-8b38-ab64ec5189ae" rel="noreferrer" target="_blank">Dichiarazione di Accessibilità</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
    </>
    );
};
