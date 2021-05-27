import { useState, useEffect } from 'react';
import { HeaderBar } from "./components/HeaderBar";
import { FooterBar } from "./components/FooterBar";

import { Total } from "./components/Total";
import { loadData } from "./loadData";
import { Deliveries } from "./containers/deliveries";

import { AgeDoses } from "./containers/agedoses";
import { Weeks } from "./containers/weeks";
import { Supplier } from './components/Supplier';
import { hideLoader } from "./utils";
import "./App.css";
import { Locations } from "./containers/locations";


function App() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    loadData().then((d) => {
      hideLoader();
      setSummary(d);
    });
  }, []);

  const tot = (summary?.totalDoses?.seconda_dose + summary?.totalDoses?.prima_dose_janssen)
  const totalePersoneVaccinate = isNaN(tot) ? '' : tot?.toLocaleString('it')
  const totalePersoneVaccinatePopolazione = isNaN(tot) ? '' : (tot / 59257566 * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

  return (
    <div>

    <HeaderBar />

        <div className="container">
            <div className="row">
                <div className="col-12 d-flex justify-content-center">

                    <Total className="mb-3" summary={{ ...summary }} /> {/* Totale Somministrazioni */}

                </div>
            </div>
            <div style={{ padding: 20 }}></div>
            <div className="row position-powerbi" style={{ backgroundColor: '#17324D' }} >
                <div className="col-12">
                    <div className="p-4 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 240 }}>
                        <div className="d-none  d-lg-block" style={{ height: 100, position: 'absolute', left: '20px', top: '20px' }}>
                            <img src="group_person.svg" alt="Logo" className="img-fluid" />
                        </div>
                        <div className="  d-none  d-lg-block position-absolute center-logo">
                            <img src="logo.png" width="80" height="80" alt="Logo" />
                        </div>
                        <div className="text-white w-100" style={{ padding: 20 }}>
                            <div className="w-100  h-100 align-items-center d-flex justify-content-center text-right">
                                <h4 style={{ marginRight: 10 }}>Totale<br></br> persone vaccinate</h4>
                                <div className="d-flexx justify-content-center text-center align-items-center border-pink">
                                    <span>{totalePersoneVaccinate}</span>
                                    <p style={{fontSize: 16}}>{totalePersoneVaccinatePopolazione} % della popolazione</p>
                                </div>
                            </div>
                            <div className="text-center position-relative" style={{ top: -10 }}>(persone che hanno completato il ciclo vaccinale)</div>
                        </div>
                    </div>
                </div>
            </div>

            <Deliveries data={summary} /> {/* Tabella Distribuzione Dosi */}

            <AgeDoses data={summary} /> {/* Grafico Somministrazioni per fascia d'età */}

            <Weeks data={summary} /> {/* Grafico Andamento Settimanale delle Somministrazioni */}

            <Supplier data={summary}></Supplier> {/* Grafico Distribuzione Vaccini per Fornitore */}

            <Locations data={summary} /> {/* Tabella Principali Punti di Somministrazione */}

            <div className="row">
                <div className="col-12 text-center pt-5 pb-3">I dati visualizzati sono disponibili all'indirizzo{" "}
                    <a href="https://github.com/italia/covid19-opendata-vaccini">https://github.com/italia/covid19-opendata-vaccini</a>
                </div>
            </div>
        </div>

        <FooterBar />

    </div>
  );
}

export default App;
