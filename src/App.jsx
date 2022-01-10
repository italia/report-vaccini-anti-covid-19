import { useState, useEffect } from 'react';
import { HeaderBar } from "./components/HeaderBar";
import { FooterBar } from "./components/FooterBar";
import { Total } from "./components/Total";
import { loadData } from "./loadData";
import { Deliveries } from "./containers/deliveries";
import { AgeDoses } from "./containers/agedoses";
import { Healed } from "./containers/healed";
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

    // Completamento ciclo vaccinale
    const tot = (summary?.totalDoses?.seconda_dose + summary?.totalDoses?.prima_dose_janssen + summary?.totalDoses?.pregressa_infezione)
    const totalePersoneVaccinate = isNaN(tot) ? '' : tot?.toLocaleString('it')
    const totalePersoneVaccinatePopolazione = isNaN(tot) ? '' : (tot / summary?.totalPlatea * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

    // Dose aggiuntiva/booster
    const totaleDoseAddizionaleBooster = (summary?.totalDoses?.dose_addizionale_booster)
    const plateaDoseAddizionaleBooster = (summary?.totalPlateaDoseAddizionaleBooster)
    const percentualeDoseAddizionaleBooster = (totaleDoseAddizionaleBooster / plateaDoseAddizionaleBooster * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // Prima Dose
    const prima = (summary?.totalDoses?.prima_dose + summary?.totalDoses?.pregressa_infezione)
    const totalePrimaDose = isNaN(prima) ? '' : prima?.toLocaleString('it')
    const percentualePrimaDosePopolazione = isNaN(prima) ? '' : (prima / summary?.totalPlatea * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

    // Guariti
    const totalePersoneGuarite = summary?.totalGuariti?.toLocaleString('it')
    const totalePersoneGuaritePopolazione = isNaN(summary?.totalGuariti) ? '' : (summary?.totalGuariti / summary?.totalPlatea * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

    //Prima Dose + Guariti
    const totaleAlmenoUnaGuariti = isNaN(prima) ? '' : (prima + summary?.totalGuariti).toLocaleString('it');
    const percentualeAlmenoUnaGuariti = isNaN(prima) ? '' : ((prima + summary?.totalGuariti) / summary?.totalPlatea * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2});


    // Prima Dose Baby
    const primaBaby = (summary?.totalDoses?.prima_dose_baby + summary?.totalDoses?.pregressa_infezione_baby)
    const totalePrimaDoseBaby = isNaN(primaBaby) ? '' : primaBaby?.toLocaleString('it')
    const percentualePrimaDosePopolazioneBaby = isNaN(primaBaby) ? '' : (primaBaby / summary?.totalPlateaBaby * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

    // Completamento ciclo vaccinale Baby
    const totBaby = (summary?.totalDoses?.seconda_dose_baby + summary?.totalDoses?.prima_dose_janssen_baby + summary?.totalDoses?.pregressa_infezione_baby)
    const totalePersoneVaccinateBaby = isNaN(totBaby) ? '' : totBaby?.toLocaleString('it')
    const totalePersoneVaccinatePopolazioneBaby = isNaN(totBaby) ? '' : (totBaby / summary?.totalPlateaBaby * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})

    // Guariti Baby
    const totalePersoneGuariteBaby = summary?.totalGuaritiBaby?.toLocaleString('it')
    const totalePersoneGuaritePopolazioneBaby = isNaN(summary?.totalGuaritiBaby) ? '' : (summary?.totalGuaritiBaby / summary?.totalPlateaBaby * 100).toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2})


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
                <div className="row position-powerbi" style={{ backgroundColor: '#17324D', marginBottom:20 }} >
                    <div className="col-md-4 col-sm-12 mb-4">
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
                                    <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale guariti</h5>
                                    <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totalePersoneGuarite}</div>
                                    <div style={{fontSize: 16}}>{totalePersoneGuaritePopolazione} % della popolazione over 12</div>
                                    <div style={{fontSize: 13, top: -10 }}>guarita da al massimo 6 mesi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row position-powerbi mt-4 mb-5" style={{ backgroundColor: '#17324D' }} >
                    <div className="col-md-12 col-sm-12 mb-5">
                        <div className="p-2 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 140 }}>
                            <div className="text-white w-100" style={{ padding: 10 }}>
                                <div className="w-100  h-100 align-items-center justify-content-center text-center">
                                    <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale con almeno una dose + guariti da al massimo 6 mesi</h5>
                                    <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totaleAlmenoUnaGuariti}</div>
                                    <div style={{fontSize: 16}}>{percentualeAlmenoUnaGuariti} % della popolazione over 12</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row position-powerbi mt-4 mb-5" style={{ backgroundColor: '#17324D', top: 30 }} >
                    <div className="col-md-12 col-sm-12 mb-5">
                        <div className="p-2 pt-4 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 240 }}>
                            <div className="position-absolute center-logo">
                                <img src="Coccarda.svg" width="150" height="130" alt="Logo" />
                            </div>
                            <div className="text-white w-100" style={{ padding: 10, marginTop: 15 }}>
                                <div className="w-100  h-100 align-items-center justify-content-center text-center">
                                    <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale dose addizionale/richiamo (booster)</h5>
                                    <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totaleDoseAddizionaleBooster?.toLocaleString('it')}</div>
                                    <div style={{fontSize: 16}}>{percentualeDoseAddizionaleBooster} % della popolazione potenzialmente oggetto di<br />dose addizionale o booster che hanno ultimato il ciclo vaccinale da<br />almeno quattro mesi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 mb-5" style={{ bottom: 30 }} >
                    <div style={{ marginTop: 40 }} className="col-12 d-flex justify-content-center align-items-center p-5 bg-title-plot">
                        <div style={{textAlign: 'center', marginBottom: 50}}>
                            <h3 className="text-center">Somministrazione platea 5-11 anni</h3>
                        </div>
                    </div>
                    <div className="row ml-4 mr-4 position-powerbi" style={{ backgroundColor: '#17324D', marginBottom:20, top:-50 }} >
                        <div className="col-md-4 col-sm-12 mb-4">
                            <div className="p-2 pt-4 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 240 }}>
                                <div className="position-absolute center-logo">
                                    <img src="Coccarda.svg" width="150" height="130" alt="Logo" />
                                </div>
                                <div className="text-white w-100" style={{ padding: 10, marginTop: 15 }}>
                                    <div className="w-100  h-100 align-items-center justify-content-center text-center">
                                        <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale con almeno una dose</h5>
                                        <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totalePrimaDoseBaby}</div>
                                        <div style={{fontSize: 16}}>{percentualePrimaDosePopolazioneBaby} % della popolazione 5-11</div>
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
                                        <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totalePersoneVaccinateBaby}</div>
                                        <div style={{fontSize: 16}}>{totalePersoneVaccinatePopolazioneBaby} % della popolazione 5-11</div>
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
                                        <h5 style={{ marginRight: 0, marginTop: 25, fontWeight: 600 }}>Totale guariti</h5>
                                        <div style={{fontSize: 36, fontWeight: 500, lineHeight: 1, marginBottom:5}}>{totalePersoneGuariteBaby}</div>
                                        <div style={{fontSize: 16}}>{totalePersoneGuaritePopolazioneBaby} % della popolazione 5-11</div>
                                        <div style={{fontSize: 13, top: -10 }}>guarita da al massimo 6 mesi</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <Deliveries data={summary} /> {/* Tabella Distribuzione Dosi */}
                <Healed data={summary} /> {/* Grafico guariti */}
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
