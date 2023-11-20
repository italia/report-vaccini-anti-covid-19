import { useState, useEffect } from 'react';
import { HeaderBar } from "./components/HeaderBar";
import { FooterBar } from "./components/FooterBar";
import { TotalHistory } from "./components/TotalHistory";
import { Total } from "./components/Total";
import { loadData } from "./loadData";
import { AgeDoses } from "./containers/agedoses";
import { AgeDosesHistory } from "./containers/agedosesHistory";
import { Weeks } from "./containers/weeks";
import { Databox } from "./containers/databox";
import { hideLoader } from "./utils";
import "./App.css";
import "./fontawesome/brands.css";
import "./fontawesome/fontawesome.css";
import "./fontawesome/solid.css";

function App() {
    const [summary, setSummary] = useState({});

    useEffect(() => {
        loadData().then((d) => {
        hideLoader();
        setSummary(d);
        });
    }, []);

    return (
        <div>
            <HeaderBar />
            <div className="container">
                <Total summary={{ ...summary }} />              {/* Totale Somministrazioni campagna attuale */}
                <Weeks data={summary} />                        {/* Grafico Andamento Settimanale delle Somministrazioni */}
                <AgeDoses data={summary} />                     {/* Grafico Somministrazioni per fascia d'età dati storici */}
                <div className="row mt-5 mb-5">
                    <div className="flag-green col-md-4 col-3"></div>
                    <div className="col-md-4 col-6">
                        <img className="col-md-12" src="ministero.png" alt="logo-ministero" />
                    </div>
                    <div className="flag-red col-md-4 col-3"></div>
                </div>
                <TotalHistory summary={{ ...summary }} />       {/* Totale Somministrazioni storiche */}
                <AgeDosesHistory data={summary} />              {/* Grafico Somministrazioni per fascia d'età dati storici */}
                <Databox data={summary} />                      {/* Box riepilogo dati storici */}
            </div>
            <FooterBar />
        </div>
    );
}

export default App;
