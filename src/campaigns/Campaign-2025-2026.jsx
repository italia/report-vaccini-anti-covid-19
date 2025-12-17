import { baseURL, loadData } from "../loadData";
import { useEffect, useState } from 'react';
import { AgeDoses } from "../containers/agedoses";
import {CampaignContext} from './CampaignContext';
import { Total } from "../components/Total";
import { Weeks } from "../containers/weeks";
import { hideLoader } from "../utils";

const context = {
    total:{
        title: 'Campagna vaccinale Autunno-Inverno 2025/2026',
        subtitle: 'I dati sono aggiornati su base settimanale e sono disponibili in formato aperto con il dettaglio giornaliero.',
        showLastUpdate: true,
        periodTitle: 'Totale somministrazioni',
        periodSubtitle: 'Il dato può subire variazioni negative a seguito di rettifiche da parte delle regioni.'
    },
    weeks:{
        title: 'Somministrazioni su base settimanale',
        subtitle: 'con Comirnaty adattato'
    },
    ageDoses:{
        title:"Somministrazioni per fascia d'età"
    }
}

export const Campaign20252026 = () => {

    const [summary, setSummary] = useState({});

    useEffect(() => {
        // campagna 2025-2026
        const campagnaUrl = `${baseURL}/somministrazioni-vaccini-latest-campagna-2025-2026.json`;
        const summaryUrl = `${baseURL}/somministrazioni-vaccini-summary-latest-campagna-2025-2026.json`;

        loadData({campagnaUrl, summaryUrl}).then((d) => {
        setSummary(d);
        hideLoader();
        });
    }, []);

    return (
        <CampaignContext.Provider value={context}>
            <Total summary={summary} />              {/* Totale Somministrazioni campagna attuale */}
            <Weeks data={summary} />                        {/* Grafico Andamento Settimanale delle Somministrazioni */}
            <AgeDoses data={summary} />                     {/* Grafico Somministrazioni per fascia d'età dati storici */}
            <div className="row mt-5 mb-5">
                <div className="flag-green col-md-4 col-3"></div>
                <div className="col-md-4 col-6">
                    <img className="col-md-12" src="ministero.png" alt="logo-ministero" />
                </div>
                <div className="flag-red col-md-4 col-3"></div>
            </div>
        </CampaignContext.Provider>
    )
}