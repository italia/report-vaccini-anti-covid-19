import React from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "../App.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";

export const HeaderBar = () => {
  return (
    <>
      {/* <Header small={false} theme="" type="slim">

      </Header> */}
    <div className="row m-0 bg-tertiary" >
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
                <a className="text-decoration-none" href="https://www.governo.it/it/dipartimenti/commissario-straordinario-lemergenza-covid-19/cscovid19-commissario/14419" aria-label ="Commissario Straordinario Covid-19" rel="noreferrer" alt="Commissario Straordinario Covid">
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
        {/** TITLE + LOGO*/}
        <div className="col-12 d-flex flex-column justify-content-center mainBanner">
          <div className="d-flex justify-content-center">
            <img src="Coccarda.svg" alt="Logo" height="150px" className="main-logo" />
            <h1 className="large-title pl-2 pt-4 d-lg-none d-md-none d-xs-block">Report Vaccini Anti COVID-19</h1> {/* Title Desktop*/}
            <h1 className="large-title pl-2 pt-5 d-none d-md-block">Report Vaccini Anti COVID-19</h1>  {/* Title Desktop*/}
          </div>
        </div>
      </div>
    </>
  );
};
