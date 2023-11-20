import React from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "../App.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";

export const HeaderBar = () => {
  return (
    <div>
      <div className="row m-0 bg-tertiary justify-content-md-center">
        <div className="col-12 d-flex justify-content-md-center justify-content-sm-start logo-section pr-sm-0 pt-2 pb-2">
            <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
            <p className="h5">
                <a className="text-decoration-none" href="https://www.salute.gov.it/" aria-label ="Collegamento al sito www.salute.gov.it. Apre una nuova pagina." rel="noreferrer" alt="Collegamento al sito www.salute.gov.it. Apre una nuova pagina.">
                Ministero della Salute
                </a>
            </p>
        </div>
      </div>
      <div className="flag_container clearfix">
        <div className="green clearfix"></div>
        <div className="white clearfix"></div>
        <div className="red clearfix"></div>
      </div>
      <div>
        {/** TITLE + LOGO*/}
        <div className="col-12 d-flex flex-column justify-content-center mainBanner">
          <div className="row pt-5 row-header-div">
            <div className="col-md-9">
              <h1 className="large-title pl-2 d-lg-none d-md-none d-xs-block">Report Vaccini Anti COVID-19</h1> {/* Title Mobile*/}
              <h1 className="page-title large-title pl-2 d-none d-md-block">Report Vaccini Anti COVID-19</h1>  {/* Title Desktop*/}
            </div>
            <div className="col-md-3 vertical-align">
              <a className="button-header" href="https://www.salute.gov.it/portale/nuovocoronavirus/homeNuovoCoronavirus.jsp" aria-label="vai all'area Covid-19" rel="noreferrer" alt="vai all'area Covid-19">vai all'area <b>Covid-19 <span className="fa-solid fa-chevron-right"></span></b></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
