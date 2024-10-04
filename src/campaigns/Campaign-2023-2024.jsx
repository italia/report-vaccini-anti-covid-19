import { baseURL, loadData } from "../loadData";
import { useEffect, useState } from 'react';
import { AgeDoses } from "../containers/agedoses";
import {CampaignContext} from './CampaignContext'
import { Total } from "../components/Total";
import { CampaignHistory } from "./Campaign-History";

const context = {
    total:{
        title:'Dati Campagna vaccinale anti Covid-19 2023/2024 fino al 17/09/2024',
        subtitle: 'Dati e statistiche sulla vaccinazione anti Covid-19 a partire da 24 Settembre 2023 al 17 Settembre 2024',
        showLastUpdate: false,
        periodTitle: 'Totale somministrazioni fino al 17/09/2024'
    },
    ageDoses:{
        title:"Somministrazioni di XBB 1.5 per fascia d'età - fino al 17/09/2024"
    }
}

export const Campaign20232024 = () => {

    const [summary, setSummary] = useState({});

    useEffect(() => {
        // campagna 2023-2024
        const campagnaUrl = `${baseURL}/somministrazioni-vaccini-latest-campagna-2023-2024.json`;
        const summaryUrl = `${baseURL}/somministrazioni-vaccini-summary-latest-campagna-2023-2024.json`;

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
           <CampaignHistory summary={summary}/>
        </CampaignContext.Provider>
    )
}

