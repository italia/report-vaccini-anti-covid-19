import React from "react";
import "../App.css";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";

export const FooterBar = () => {
  return (
    <>
      <div className="footer-wrapper p-4 clearfix">
        <footer className="footer_container container" id="footer">
          <div className="row title_row">
          <div className="col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pt-2 pb-2">
            <a href="http://www.governo.it" className="text-decoration-none" target="_blank" rel="noreferrer">
              <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
            </a>
            <p className="pt-sm-0">Presidenza del Consiglio dei Ministri</p>
          </div>
          <div className="col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pt-2 pb-2">
            <a href="http://www.governo.it/it/dipartimenti/commissario-straordinario-lemergenza-covid-19/15974" className="text-decoration-none" target="_blank" rel="noreferrer">
              <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
            </a>
            <p className="pt-sm-0">Commissario Straordinario Covid-19</p>
          </div>
          <div className="col-md-4 d-flex justify-content-md-center justify-content-sm-start logo-section pt-2 pb-2">
            <a href="http://www.salute.gov.it/portale/home.html" className="text-decoration-none" target="_blank" rel="noreferrer">
              <img src="logo.svg" height="4px" alt="Logo" className="logo pl-5 pr-2" />
            </a>
            <p className="pt-sm-0">Ministero della Salute</p>
          </div>
          </div>
        </footer>
      </div>
    </>
  );
};
