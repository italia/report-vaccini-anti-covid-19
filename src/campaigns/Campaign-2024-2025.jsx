import { baseURL, loadData } from "../loadData";
import { useEffect, useState } from 'react';
import { AgeDoses } from "../containers/agedoses";
import {CampaignContext} from './CampaignContext';
import { Total } from "../components/Total";

const context = {
    total:{
        title: 'Dati storici vaccinazione anti Covid-19 fino al 21/09/2025',
        subtitle: 'Dati e statistiche sulla vaccinazione anti Covid-19 a partire dal 18 Settembre 2024 al 21 Settembre 2025',
        showLastUpdate: false,
        periodTitle: 'Totale somministrazioni fino al 21/09/2025'
    },
    ageDoses:{
        title:"Somministrazioni di XBB 1.5 per fascia d'età - fino al 21/09/2025"
    }
}

export const Campaign20242025 = () => {

    const [summary, setSummary] = useState({});

    useEffect(() => {
        // campagna 2024-2025
        const campagnaUrl = `${baseURL}/somministrazioni-vaccini-latest-campagna-2024-2025.json`;
        const summaryUrl = `${baseURL}/somministrazioni-vaccini-summary-latest-campagna-2024-2025.json`;

        loadData({campagnaUrl, summaryUrl}).then((d) => {
        setSummary(d);
        });
    }, []);

    return (
        <CampaignContext.Provider value={context}>
            <Total summary={summary} />              {/* Totale Somministrazioni campagna attuale */}
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

