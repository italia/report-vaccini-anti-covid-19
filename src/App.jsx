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

    const tot = (summary?.totalDoses?.seconda_dose + summary?.totalDoses?.prima_dose_janssen + summary?.totalDoses?.pregressa_infezione)
    const totalePersoneVaccinate = isNaN(tot) ? '' : tot?.toLocaleString('it')
    const totalePersoneVaccinatePopolazione = isNaN(tot) ? '' : (tot / summary?.totalPlatea * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

    const totaleDoseAggiuntiva = isNaN(summary?.totalDoses?.dose_aggiuntiva) ? '' : summary?.totalDoses?.dose_aggiuntiva?.toLocaleString('it')
    const percentualeDoseAggiuntivaPopolazione = isNaN(summary?.totalDoses?.dose_aggiuntiva) ? '' : (summary?.totalDoses?.dose_aggiuntiva / summary?.totalPlateaDoseAgg * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

    const prima = (summary?.totalDoses?.prima_dose + summary?.totalDoses?.pregressa_infezione)

    const totalePrimaDose = isNaN(prima) ? '' : prima?.toLocaleString('it')
    const percentualePrimaDosePopolazione = isNaN(prima) ? '' : (prima / summary?.totalPlatea * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    console.log('Platea Dose Aggiuntiva ---> ' + summary?.totalPlateaDoseAgg)
    console.log('Dosi Aggiuntive Somministrate ---> ' + summary?.totalDoses?.dose_aggiuntiva)
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
                    <div className="col-md-4 col-sm-12">
                        <div className="p-2 pt-4 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 240 }}>
                            <div className="position-absolute center-logo">
                                <img src="Coccarda.svg" width="150" height="130" alt="Logo" />
                            </div>
                            <div className="text-white w-100" style={{ padding: 10, marginTop: 15 }}>
                                <div className="w-100  h-100 align-items-center justify-content-center text-center">
                                    <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale con almeno una dose</h5>
                                    <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totalePrimaDose}</div>
                                    <div style={{fontSize: 16}}>{percentualePrimaDosePopolazione} % della popolazione over 12</div>
                                    <div style={{fontSize: 13, top: -10 }}>(persone con almeno una somministrazione)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className="p-2 pt-4 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 240 }}>
                            <div className="position-absolute center-logo">
                                <img src="Coccarda.svg" width="150" height="130" alt="Logo" />
                            </div>
                            <div className="text-white w-100" style={{ padding: 10, marginTop: 15 }}>
                                <div className="w-100  h-100 align-items-center justify-content-center text-center">
                                    <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale ciclo vaccinale</h5>
                                    <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totalePersoneVaccinate}</div>
                                    <div style={{fontSize: 16}}>{totalePersoneVaccinatePopolazione} % della popolazione over 12</div>
                                    <div style={{fontSize: 13, top: -10 }}>(persone che hanno completato il ciclo vaccinale)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className="p-2 pt-4 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 240 }}>
                            <div className="position-absolute center-logo">
                                <img src="Coccarda.svg" width="150" height="130" alt="Logo" />
                            </div>
                            <div className="text-white w-100" style={{ padding: 10, marginTop: 15 }}>
                                <div className="w-100  h-100 align-items-center justify-content-center text-center">
                                    <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale dose aggiuntiva/richiamo</h5>
                                    <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totaleDoseAggiuntiva}</div>
                                    <div style={{fontSize: 16}}>{percentualeDoseAggiuntivaPopolazione} % della popolazione oggetto di dose aggiuntiva/richiamo</div>
                                    <div style={{fontSize: 13, top: -10 }}>(persone che hanno completato la dose aggiuntiva/richiamo)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Deliveries data={summary} /> {/* Tabella Distribuzione Dosi */}
                <Weeks data={summary} /> {/* Grafico Andamento Settimanale delle Somministrazioni */}
                <AgeDoses data={summary} /> {/* Grafico Somministrazioni per fascia d'età */}
                <Supplier data={summary} /> {/* Grafico Distribuzione Vaccini per Fornitore */}
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
