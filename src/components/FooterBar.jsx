import React from "react";

export const FooterBar = () => {
    return (
        <>
            {/* <Footer small={false} theme="" type="slim">

            </Footer> */}
            <div className="row">
                <div className="col-12 text-center pt-5 pb-3">I dati visualizzati sono disponibili all'indirizzo{" "}
                    <a href="https://github.com/italia/covid19-opendata-vaccini" alt="Repository Dati Covid Governo Italiano">https://github.com/italia/covid19-opendata-vaccini</a>
                </div>
            </div>
            <div className="row m-0 p-2 bg-footer">
                <div className="col-12 col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pt-2 pb-2">
                    <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
                    <p className="pt-2">
                        <a href="http://www.governo.it" aria-label="Presidenza del Consiglio dei Ministri" className="text-decoration-none" rel="noreferrer" alt="Presidenza del Consiglio dei Ministri">
                            Presidenza del Consiglio dei Ministri
                        </a>
                    </p>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pr-sm-0 pt-2 pb-2">
                    <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
                    <p className="pt-2">
                        <a className="text-decoration-none" href="https://www.governo.it/it/dipartimenti/commissario-straordinario-lemergenza-covid-19/cscovid19-commissario/14419" aria-label ="Commissario Straordinario Covid-19" rel="noreferrer" alt="Commissario Straordinario Covid-19">
                            Commissario Straordinario Covid-19
                        </a>
                    </p>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pt-2 pb-2 pr-sm-3">
                    <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
                    <p className="pt-2">
                        <a href="http://www.salute.gov.it/portale/home.html" className="text-decoration-none" aria-label="Ministero della Salute" rel="noreferrer" alt="Ministero della Salute">
                            Ministero della Salute
                        </a>
                    </p>
                </div>
            </div>
    </>
    );
};
