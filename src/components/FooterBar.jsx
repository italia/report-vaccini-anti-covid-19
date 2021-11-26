import React from "react";
import "../App.css";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";

export const FooterBar = () => {
    return (
        <>
            {/* <Footer small={false} theme="" type="slim">

            </Footer> */}
            <div className="row m-0 p-2" style={{ backgroundColor: '#17324d' }}>
                <div className="col-12 col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pt-2 pb-2">
                    <a href="http://www.governo.it" className="text-decoration-none" target="_blank" rel="noreferrer">
                        <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
                    </a>
                    <p className="pt-sm-0">
                        <a href="http://www.governo.it" target="_blank" className="text-decoration-none" rel="noreferrer">
                            Presidenza del Consiglio dei Ministri
                        </a>
                    </p>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pr-sm-0 pt-2 pb-2">
                    <a className="text-decoration-none" href="http://www.governo.it/it/dipartimenti/commissario-straordinario-lemergenza-covid-19/15974" target="_blank" rel="noreferrer">
                        <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
                    </a>
                    <p className="pt-sm-0">
                        <a className="text-decoration-none" href="http://www.governo.it/it/dipartimenti/commissario-straordinario-lemergenza-covid-19/15974" target="_blank" rel="noreferrer">
                            Commissario Straordinario Covid-19
                        </a>
                    </p>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pt-2 pb-2 pr-sm-3">
                    <a href=" http://www.salute.gov.it/portale/home.html" target="_blank" rel="noreferrer">
                        <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
                    </a>
                    <p className="pt-sm-0">
                        <a href="http://www.salute.gov.it/portale/home.html" className="text-decoration-none" target="_blank" rel="noreferrer">
                            Ministero della Salute
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};
