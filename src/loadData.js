import { sumDoseX, replaceArea } from "./utils";
import _ from "lodash";
import Moment from 'moment';

const baseURL = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati";

const years                                 = [2020, 2021, 2022, 2023];
const sommVaxSummaryURL                     = `${baseURL}/somministrazioni-vaccini-summary-latest.json`;
const sommVaxDetailBaseURL                  = `${baseURL}/somministrazioni-vaccini-latest-`;
const vaxSummaryURL                         = `${baseURL}/vaccini-summary-latest.json`;
const vaxLocationsURL                       = `${baseURL}/punti-somministrazione-tipologia.json`;
const lastUpdateURL                         = `${baseURL}/last-update-dataset.json`;
const supplierDoses                         = `${baseURL}/consegne-vaccini-latest.json`;
const plateaURL                             = `${baseURL}/platea.json`;
const plateaDoseAddizionaleBoosterURL       = `${baseURL}/platea-dose-addizionale-booster.json`;
const plateaDoseSecondBoosterURL            = `${baseURL}/platea-second-booster.json`;
const plateaDoseThirdBoosterURL             = `${baseURL}/platea-3a-booster.json`;
const guaritiURL                            = `${baseURL}/soggetti-guariti.json`;
const coperturaURL                          = `${baseURL}/copertura-vaccinale.json`;

const elaborate = (data) => {
    /* creazioni delle costanti relative alle sorgenti dei file */
    const dataSommVaxSummary                = data?.dataSommVaxSummary?.data;
    const dataSommVaxDetail                 = data?.dataSommVaxDetail?.data;
    const dataVaxSummary                    = data?.dataVaxSummary?.data;
    const dataCopertura                     = data?.dataCopertura?.data;
    const dataPlatea                        = data?.dataPlatea?.data;
    const dataGuariti                       = data?.dataGuariti?.data;
    const dataSupplierDoses                 = data?.dataSupplierDoses?.data;
    const dataVaxLocations                  = data?.dataVaxLocations?.data;
    const dataPlateaDoseAddizionaleBooster  = data?.dataPlateaDoseAddizionaleBooster?.data;
    const dataPlateaSecondBooster           = data?.dataPlateaSecondBooster?.data;
    const dataPlateaThirdBooster            = data?.dataPlateaThirdBooster?.data;

    /* array statico contenente le fasce d'età relative agli over 60 */
    const fasciaOver60 = ['60-69', '70-79', '80+'];

    /* array statico contenente tutte le fasce d'età */
    const fasciaEta = ['0-4 ', '05-11', '12-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'];

    /********************************************************************************
     * ----------------------- DATA AGGIORNAMENTO REPORT ----------------------------
     *******************************************************************************/

    const timestamp = data.dataLastUpdate.ultimo_aggiornamento;


    /********************************************************************************
     * ------------------------- TOTALE SOMMINISTRAZIONI ----------------------------
     *******************************************************************************/

    const tot = dataSommVaxSummary?.filter((d) => d.area !== "ITA").reduce(sumDoseX("totale"), 0);   

    /********************************************************************************
     * --------------------------- BOX DI RIEPILOGO DATI ----------------------------
     *******************************************************************************/

    /* creazione totalDoses, oggetto contenente la somma delle principali statistiche presenti in Databox.jsx */
    let totalDoses = {
        /* Copertura vaccinale covid-19 over 60 */
        somministrazioni_over60:        _.sum(dataCopertura?.map((e) => fasciaOver60.includes(e?.fascia_anagrafica) ? e?.vaccinati : 0)), // totale somministrazioni
        guarigioni_over60:              _.sum(dataCopertura?.map((e) => fasciaOver60.includes(e?.fascia_anagrafica) ? e?.guariti : 0)), // totale guarigioni
        /* Ciclo Vaccinale Primario */
        prima_dose:                     _.sum(dataSommVaxDetail?.map((e) => (e?.eta === '05-11' || e?.eta === '00-04') ? 0 : e?.d1)), // somma delle prime dosi esclusa la fascia anagrafica 05-11
        pregressa_infezione:            _.sum(dataSommVaxDetail?.map((e) => (e?.eta === '05-11' || e?.eta === '00-04') ? 0 : e?.dpi)), // somma delle pregresse infezioni esclusa la fascia anagrafica 05-11
        seconda_dose:                   _.sum(dataSommVaxDetail?.map((e) => (e?.eta === '05-11' || e?.eta === '00-04') ? 0 : e?.d2)), // somma delle seconde dosi esclusa la fascia anagrafica 05-11
        prima_dose_janssen:             _.sum(dataSommVaxDetail?.filter((e) => e.forn === "Janssen" && e?.eta !== '05-11' && e?.eta !== '00-04').map((e) => e?.d1)), // somma delle somministrazioni a dose unica escluse le fasce anagrafiche 00-04 05-11
        /* Somministrazione platea 00-04 anni */
        prima_dose_infant:              _.sum(dataSommVaxDetail?.map((e) => e?.eta === '00-04' ? e?.d1 : 0)), // somma delle prime dosi per fascia anagrafica 00-04
        seconda_dose_infant:            _.sum(dataSommVaxDetail?.map((e) => e?.eta === '00-04' ? e?.d2 : 0)), // somma delle seconde dosi per fascia anagrafica 00-04
        pregressa_infezione_infant:     _.sum(dataSommVaxDetail?.map((e) => e?.eta === '00-04' ? e?.dpi : 0)), // somma delle pregresse infezioni per la fascia anagrafica 00-04
        prima_dose_janssen_infant:      _.sum(dataSommVaxDetail?.filter((e) => e.forn === "Janssen" && e?.eta === '00-04').map((e) => e?.d1)), // somma delle somministrazioni a dose unica per la fascia anagrafica 00-04
        /* Somministrazione platea 5-11 anni */
        prima_dose_baby:                _.sum(dataSommVaxDetail?.map((e) => e?.eta === '05-11' ? e?.d1 : 0)), // somma delle prime dosi per fascia anagrafica 05-11
        seconda_dose_baby:              _.sum(dataSommVaxDetail?.map((e) => e?.eta === '05-11' ? e?.d2 : 0)), // somma delle seconde dosi per fascia anagrafica 05-11
        pregressa_infezione_baby:       _.sum(dataSommVaxDetail?.map((e) => e?.eta === '05-11' ? e?.dpi : 0)), // somma delle pregresse infezioni per la fascia anagrafica 05-11
        prima_dose_janssen_baby:        _.sum(dataSommVaxDetail?.filter((e) => e.forn === "Janssen" && e?.eta === '05-11').map((e) => e?.d1)), // somma delle somministrazioni a dose unica per la fascia anagrafica 05-11
        /* Dose Addizionale/Booster */
        dose_addizionale_booster:       _.sum(dataSommVaxDetail?.map((e) => (e?.eta === '05-11' || e?.eta === '00-04') ? 0 : e?.db1)), // somma delle prime dosi booster per la fascia over 12
        /* Seconda dose booster */
        dose_second_booster:            _.sum(dataSommVaxDetail?.map((e) => (e?.eta === '05-11' || e?.eta === '00-04') ? 0 : e?.db2)), // somma delle seconde dosi booster per la fascia over 12
        /* Terza dose booster */
        dose_third_booster:             _.sum(dataSommVaxDetail?.map((e) => (e?.eta === '05-11' || e?.eta === '00-04') ? 0 : e?.db3)), // somma delle terze dosi booster per la fascia over 12
        /* Dose Addizionale/Booster 05-15 */
        dose_addizionale_booster_baby:  _.sum(dataSommVaxDetail?.map((e) => e?.eta === '05-11' ? e?.db1 : 0)), // somma delle prime dosi booster per la fascia 5-11
    };

    /* calcolo delle platee */
    let totalPlatea                             = _.sum(dataPlatea?.map((e) => (e?.eta !== '05-11' && e?.eta !== '00-04') ? e?.totale_popolazione : 0)); // totale platea della popolazione over 12
    let totalPlateaBaby                         = _.sum(dataPlatea?.map((e) => (e?.eta === '05-11') ? e?.totale_popolazione : 0)); // totale platea della popolazione 05-11
    let totalPlateaInfant                       = _.sum(dataPlatea?.map((e) => (e?.eta === '00-04') ? e?.totale_popolazione : 0)); // totale platea della popolazione 00-04
    let totalPlateaOver60                       = _.sum(dataPlatea?.map((e) => fasciaOver60.includes(e?.eta) ? e?.totale_popolazione : 0)); // platea della popolazione over 60
    let totalPlateaDoseAddizionaleBooster       = _.sum(dataPlateaDoseAddizionaleBooster?.map((e) => (e?.categoria_prevalente !== '05-11' && e?.categoria_prevalente !== '00-04') ? e?.totale_popolazione : 0)); // totale platea dose booster
    let totalPlateaDoseAddizionaleBoosterBaby   = _.sum(dataPlateaDoseAddizionaleBooster?.map((e) => e?.categoria_prevalente === '05-11' ? e?.totale_popolazione : 0)); // totale platea dose booster
    let totalPlateaDoseSecondBooster            = _.sum(dataPlateaSecondBooster?.map((e) => e?.totale_popolazione)); // totale platea seconda dose booster
    let totalPlateaDoseThirdBooster             = _.sum(dataPlateaThirdBooster?.map((e) => e?.totale_popolazione)); // totale platea terza dose booster

    /* calcolo dei guariti usato nei box iniziali di riepilogo e in Platea Guariti. Si tratta esclusivamente dei guariti per età superiore a 11 anni */
    let totalGuaritiNotBaby                 = _.sum(dataGuariti?.map((e) => (e?.eta !== '05-11' && e?.eta !== '00-04') ? e?.guariti_senza_somm : 0)); // totale dei guariti della popolazione over 12
    let totalGuaritiDoppiaNotBaby           = _.sum(dataGuariti?.map((e) => (e?.eta !== '05-11' && e?.eta !== '00-04') ? e?.guariti_post_somm : 0)); // totale dei guariti dopo che hanno completato il ciclo vaccinale primario della popolazione over 12
    let totalGuaritiBoosterNotBaby          = _.sum(dataGuariti?.map((e) => (e?.eta !== '05-11' && e?.eta !== '00-04') ? e?.guariti_post_1booster : 0)); // totale dei guariti dopo che hanno eseguito la dose booster della popolazione over 12
    let totalGuaritiSecondBoosterNotBaby    = _.sum(dataGuariti?.map((e) => (e?.eta !== '05-11' && e?.eta !== '00-04') ? e?.guariti_post_2booster : 0)); // totale dei guariti dopo che hanno eseguito la seconda dose booster della popolazione over 12
    
    /* calcolo dei guariti senza somministrazioni della fascia 05-11 previsto nel box Somministrazione platea 5-11 anni */
    let totalGuaritiBaby                    = _.sum(dataGuariti?.map((e) => e?.eta === '05-11' ? e?.guariti_senza_somm : 0)); // guariti senza somministrazioni per la fascia 05-11
    let totalGuaritiDoppiaBaby              = _.sum(dataGuariti?.map((e) => e?.eta === '05-11' ? e?.guariti_post_somm : 0)); // totale dei guariti dopo che hanno completato il ciclo vaccinale primario della popolazione 05-11

    /* calcolo dei guariti senza somministrazioni della fascia 00-04 previsto nel box Somministrazione platea 0-04 anni */
    let totalGuaritiInfant                  = _.sum(dataGuariti?.map((e) => (e?.eta === '00-04') ? e?.guariti_senza_somm : 0)); // guariti senza somministrazioni per la fascia 00-04

    let databoxContent = { // insieme di dati da passare al container
        totalGuaritiNotBaby,
        totalGuaritiDoppiaNotBaby,
        totalGuaritiBoosterNotBaby,
        totalGuaritiSecondBoosterNotBaby,
        totalPlateaDoseAddizionaleBoosterBaby,
        totalGuaritiDoppiaBaby,
        totalGuaritiBaby,
        totalGuaritiInfant,
        totalPlatea,
        totalPlateaBaby,
        totalPlateaInfant,
        totalPlateaDoseAddizionaleBooster,
        totalPlateaDoseSecondBooster,
        totalPlateaDoseThirdBooster,
        totalPlateaOver60,
    }

     /********************************************************************************
     * ----------------------- COPERTURA VACCINALE OVER 60 ---------------------------
     * Istogramma + Mappa Italia
     * Possibilità di click sulla regione (Mappa) o sulla fascia anagrafica (Istogramma)
     *******************************************************************************/
    let keyValueOver60 = { // oggetto contenente le label delle serie (la legenda)
        "guariti"           : "Guarigioni 120 gg",
        "somministrazioni"  : "Somministrazioni 120 gg",
        "totale"            : "Totale fascia"
    }
    let keysOver60      = Object.keys(keyValueOver60); // array delle chiavi della serie
    let over60          = Object.values(keyValueOver60); // array del nome delle serie (legenda)
    let over60Color     = ["#090d4d", "#244bb3", "#b6d5f4" ]; // colori associati alle serie


    // array con i valori da visualizzare nell'istogramma senza filtri.
    let over60Data = _(dataCopertura).filter(e => fasciaOver60.includes(e.fascia_anagrafica)).groupBy("fascia_anagrafica").map((items, rowAge) => { // raggruppo i valori in base alla fascia anagrafica
        let keyAge = rowAge === '80+' ? 'Fascia over 80' : 'Fascia ' + rowAge; // keyAge è la fascia anagrafica, nel caso di 80+ non deve apparire 80+ ma over 80

        let entryTmp = {
            'guariti'           : _.sum(items.map(e => e.guariti)), // sommo i guariti per la fascia anagrafica corrente
            'somministrazioni'  : _.sum(items.map(e => e.vaccinati)), // sommo le somministrazioni per la fascia anagrafica corrente
            'totale'            : _.sum(dataPlatea.filter(e => e.eta === rowAge).map(e => e.totale_popolazione)) // totale platea per la fascia anagrafica
        }

        // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente
        return {
            'label'             : keyAge,
            'guariti'           : entryTmp['guariti'],
            'somministrazioni'  : entryTmp['somministrazioni'] > entryTmp['guariti'] ? entryTmp['somministrazioni'] - entryTmp['guariti'] : 0,
            'totale'            : entryTmp['totale'] > entryTmp['somministrazioni'] ? entryTmp['totale'] - entryTmp['somministrazioni'] : 0,
        };
    }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista dei guariti secondo la fascia anagrafica;

    // array con i valori da visualizzare nella mappa (regione, totale percentuale) con e senza filtri
    const over60MapData  = _(dataCopertura?.map(replaceArea)).filter(e => fasciaOver60.includes(e.fascia_anagrafica)).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        let entry = {
            code        : code, // codice regione
            area        : _.head(items)?.area, // nome esteso regione
            totale      : _.sum(items.map(e => e.guariti + e.vaccinati))
        }

        let popolazione = _.sum(dataPlatea.filter(e => e.area === code && fasciaOver60.includes(e.eta)).map(e => e.totale_popolazione)) // totale platea per la fascia anagrafica over 60 nella regione corrente
        entry['totale'] = entry['totale'] / popolazione * 100; // calcolo la percentuale del totale sulla platea

        for (let rowAge of fasciaEta.filter(e => fasciaOver60.includes(e))) { // per tutte le fasce d'età over 60
            let keyAge = rowAge === '80+' ? 'fascia_over_80' : 'fascia_' + rowAge;
            entry[keyAge] = _.sum(items.filter(e => rowAge === e.fascia_anagrafica).map(e => e.guariti + e.vaccinati)); // sommo i guariti e i vaccinati della fascia anagrafica corrente in quella determinata regione
            let popolazioneFascia = _.sum(dataPlatea.filter(e => e.area === code && e.eta === rowAge).map(e => e.totale_popolazione)); // calcolo la platea della fascia anagrafica corrente in quella determinata regione
            entry[keyAge] = entry[keyAge] / popolazioneFascia * 100; // calcolo la percentuale
        }
        
        return entry;
    }).value();

    // array con i valori da visualizzare nell'istogramma con il filtro regione attivo
    const over60RegionData  = {};
    _(dataCopertura?.map(replaceArea)).filter(e => fasciaOver60.includes(e.fascia_anagrafica)).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        over60RegionData[code] = _(items?.map(replaceArea)).groupBy("fascia_anagrafica").map((subItems, rowAge) => { // raggruppo i valori in base all'età
            let keyAge = rowAge === '80+' ? 'Fascia over 80' : 'Fascia ' + rowAge; // keyAge è la fascia anagrafica, nel caso di 80+ non deve apparire 80+ ma over 80

            let entryTmp = {
                'guariti'           : _.sum(subItems.map(e => e.guariti)), // sommo i guariti
                'somministrazioni'  : _.sum(subItems.map(e => e.vaccinati)), // sommo le somministrazioni
                'totale'            : _.sum(dataPlatea.filter(e => e.eta === rowAge && e.area === code).map(e => e.totale_popolazione)) // totale platea per la fascia anagrafica corrente e la regione corrente
            }

            // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente
            return {
                'label'             : keyAge,
                'guariti'           : entryTmp['guariti'],
                'somministrazioni'  : entryTmp['somministrazioni'] > entryTmp['guariti'] ? entryTmp['somministrazioni'] - entryTmp['guariti'] : 0,
                'totale'            : entryTmp['totale'] > entryTmp['somministrazioni'] ? entryTmp['totale'] - entryTmp['somministrazioni'] : 0
            };
        }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista secondo la fascia anagrafica;
        return items;
    }).value();

    let over60Content = { // insieme di dati da passare al container
        over60,
        keyValueOver60,
        keysOver60,
        over60Color,
        over60Data,
        over60RegionData,
        over60MapData,
    }

    /********************************************************************************
     * ---------- DISTRIBUZIONE SOMMINISTRAZIONI RISPETTO ALLE CONSEGNE -------------
     * Tabella + Mappa Italia
     * Possibilità di click sulla regione (Mappa)
     *******************************************************************************/

    const deliverySummary       = dataVaxSummary?.map(replaceArea);
    const deliveredByArea       = _.groupBy(deliverySummary, "code");
    /* Array di oggetti JSON aventi code, area, dosi_consegnate, dosi_somministrate e percentuale_somministrazione */
    const totalDeliverySummary  = _(dataSommVaxDetail?.map(replaceArea)).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        const details = _.head(deliveredByArea[code]);
        return {
            code                            : code, // codice regione
            area                            : _.head(items)?.area, // nome esteso regione
            dosi_consegnate                 : details.dosi_consegnate || 0, // dosi consegnate
            dosi_somministrate              : details.dosi_somministrate || 0, // dosi somministrate
            percentuale_somministrazione    : details.percentuale_somministrazione || 0, // percentuale somministrazioni rispetto alle consegnate
        };
    }).value();

    /********************************************************************************
     * --------------------------- GRAFICO PLATEA GUARITI ---------------------------
     * Istogramma a pile + Mappa Italia
     * Possibilità di click sulla regione (Mappa) o sulla fascia anagrafica (Istogramma)
     *******************************************************************************/ 

    /* totale di tutti i guariti, usato nel box del totale nella sezione Platea Guariti */
    let totalGuaritiHealedSection           = _.sum(dataGuariti?.map((e) => e?.guariti_senza_somm + e?.guariti_post_somm + e?.guariti_post_1booster + e?.guariti_post_2booster));

    let keyValueHealed  = { // oggetto contenente le label delle serie (la legenda)
        "senza"     : "Guariti senza somministrazione da al massimo 6 mesi",
        "post"      : "Guariti post 2ª dose/unica dose da al massimo 4 mesi",
        "booster"   : "Guariti post 1ª dose booster da al massimo 6 mesi",
        "2booster"  : "Guariti post 2ª dose booster da al massimo 6 mesi"
    }
    let keysHealed      = Object.keys(keyValueHealed); // array delle chiavi della serie
    let healed          = Object.values(keyValueHealed); // array del nome delle serie (legenda)
    let healedColor     = ["#b6d5f4", "#0a5dbb", "#244bb3", "#090d4d" ]; // colori associati alle serie

    // array con i valori da visualizzare nell'istogramma senza filtri.
    let healedData = _(dataGuariti).groupBy("eta").map((items, rowAge) => { // raggruppo i valori in base alla fascia anagrafica
        let keyAge = 'Fascia ' + rowAge; // keyAge è la fascia anagrafica, nel caso di 80+ non deve apparire 80+ ma over 80, nel caso 00-04 0-4
        if (rowAge === '80+') {
            keyAge = 'Fascia over 80';
        }
        if (rowAge === '00-04') {
            keyAge = 'Fascia 0-4';
        }
         
        let entryTmp = {
            'senza'         : _.sum(items.map(e => e.guariti_senza_somm)), // sommo i guariti senza somministrazioni per la fascia anagrafica corrente
            'post'          : _.sum(items.map(e => e.guariti_post_somm)), // sommo i guariti dopo aver completato il ciclo vaccinale per la fascia anagrafica corrent
            'booster'       : _.sum(items.map(e => e.guariti_post_1booster)), // sommo i guariti dopo la prima dose booster per la fascia anagrafica corrent
            '2booster'      : _.sum(items.map(e => e.guariti_post_2booster)) // sommo i guariti dopo la seconda dose booster per la fascia anagrafica corrente
        }

        // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente
        return {
            'label'         : keyAge,
            'senza'         : entryTmp['senza'],
            'post'          : entryTmp['post'] > entryTmp['senza'] ? entryTmp['post'] - entryTmp['senza'] : 0,
            'booster'       : entryTmp['booster'] > entryTmp['post'] ? entryTmp['booster'] - entryTmp['post'] : 0,
            '2booster'      : entryTmp['2booster'] > entryTmp['booster'] ? entryTmp['2booster'] - entryTmp['booster'] : 0,
            'Totale'        : entryTmp['senza'] + entryTmp['post'] + entryTmp['booster'] + entryTmp['2booster'] // somma di tutti i guariti
        };
    }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista dei guariti secondo la fascia anagrafica;

    // array con i valori da visualizzare nella mappa (regione, totole guariti e totale guariti per fascia anagrafica) con e senza filtri
    const healedMapData  = _(dataGuariti?.map(replaceArea)).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        let entry = {
            code        : code, // codice regione
            area        : _.head(items)?.area, // nome esteso regione
            guariti     : _.sum(items.map(e => e.guariti_senza_somm + e.guariti_post_somm + e.guariti_post_1booster + e.guariti_post_2booster)) // sommo tutti i guariti della regione
        }

        for (let rowAge of fasciaEta) { // per tutte le fasce d'età over 60
            let keyAge      = rowAge === '80+' ? 'fascia_over_80' : 'fascia_' + rowAge;
            entry[keyAge]   = _.sum(items.filter(e => rowAge === e.eta).map(e => e.guariti_senza_somm + e.guariti_post_somm + e.guariti_post_1booster + e.guariti_post_2booster)); // sommo i guariti di ogni fascia anagrafica in quella determinata regione
        }
        
        return entry;
    }).value();

    // array con i valori da visualizzare nell'istogramma con il filtro regione attivo
    const healedRegionData  = {};
    _(dataGuariti?.map(replaceArea)).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        healedRegionData[code] = _(items?.map(replaceArea)).groupBy("eta").map((subItems, rowAge) => { // raggruppo i valori in base all'età
            let keyAge = 'Fascia ' + rowAge; // keyAge è la fascia anagrafica, nel caso di 80+ non deve apparire 80+ ma over 80, nel caso 00-04 0-4
            if (rowAge === '80+') {
                keyAge = 'Fascia over 80';
            }
            if (rowAge === '00-04') {
                keyAge = 'Fascia 0-4';
            }

            let entryTmp = {
                'senza'         : _.sum(subItems.map(e => e.guariti_senza_somm)), // sommo i guariti senza somministrazioni per la fascia anagrafica corrente
                'post'          : _.sum(subItems.map(e => e.guariti_post_somm)), // sommo i guariti dopo aver completato il ciclo vaccinale per la fascia anagrafica corrent
                'booster'       : _.sum(subItems.map(e => e.guariti_post_1booster)), // sommo i guariti dopo la prima dose booster per la fascia anagrafica corrent
                '2booster'      : _.sum(subItems.map(e => e.guariti_post_2booster)) // sommo i guariti dopo la seconda dose booster per la fascia anagrafica corrente
            }

            // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente
            return {
                'label'         : keyAge,
                'senza'         : entryTmp['senza'],
                'post'          : entryTmp['post'] > entryTmp['senza'] ? entryTmp['post'] - entryTmp['senza'] : 0,
                'booster'       : entryTmp['booster'] > entryTmp['post'] ? entryTmp['booster'] - entryTmp['post'] : 0,
                '2booster'      : entryTmp['2booster'] > entryTmp['booster'] ? entryTmp['2booster'] - entryTmp['booster'] : 0,
                'Totale'        : entryTmp['senza'] + entryTmp['post'] + entryTmp['booster'] + entryTmp['2booster'] // somma di tutti i guariti
            };
        }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista dei guariti secondo la fascia anagrafica;
        return items;
    }).value();

    let healedContent = { // insieme di dati da passare al container
        totalGuaritiHealedSection,
        healed,
        keyValueHealed,
        keysHealed,
        healedColor,
        healedData,
        healedRegionData,
        healedMapData
    }


    /********************************************************************************
     * ----------- GRAFICO ANDAMENTO SETTIMANALE DELLE SOMMINISTRAZIONI -------------
     * Istogramma a pile
     *******************************************************************************/ 

    let spectrum = ["#0f69c9", "#4d99eb", "#77b2f2", "#b5d4f5", "#d1e0f0", "#edf2f7", "#ffffff"]; // sono presenti più colori del necessario per gestire eventuali nuovi fornitori
    let suppliersColor = {}; // colori associati alle serie
    let suppliers = []; // lista dinamica dei fornitori di vaccini

    for (let row of data.dataSommVaxDetail.data) { // aggiungo i fornitori evitando duplicazioni
        if (!suppliers.includes(row.forn)) {
            suppliers.push(row.forn);
        }
    }

    // sposto Pfizer Pediatrico in ultima posizione, rimuovendono dalla lista ed inserendolo in coda
    var indexOfPediatrico = suppliers.indexOf('Pfizer Pediatrico');
    if (indexOfPediatrico !== -1) {
        suppliers.splice(indexOfPediatrico, 1);
        suppliers.push('Pfizer Pediatrico');
    }

    // assegno i colori ai fornitori
    for (let rowFornitore of suppliers) {
        if ((Object.keys(suppliersColor).length - 1) < spectrum.length) {
            suppliersColor[rowFornitore] = spectrum[Object.keys(suppliersColor).length];
        }
        else {
            suppliersColor[rowFornitore] = "#ffffff";
        }
    }

    // calcolo le diverse settimane partire dal 21/12/2020
    let weeksMappingOptimation = {};
    var index = 0; // indice della settimana a partire dal 21/12/2020

    let suppliersWeek = [];
    var date = new Date('2020-12-21'); // data di partenza delle somministrazioni che cambierò ad ogni iterazione
    do {
        let entry = {
            label: Moment(date).format('DD/MM'), // giorno e mese del lunedi della settimana
            from: Moment(date).format('YYYY-MM-DD'), // data di inizio settimana
            labelfrom: Moment(date).format('DD/MM'), // etichetta inizio settimana
            to: Moment(new Date(date.getTime() + 6 * 86400000)).format('YYYY-MM-DD'), // data fine settimana
            labelto: Moment(new Date(date.getTime() + 6 * 86400000)).format('DD/MM'), // etichetta fine settimana
            total: 0 // somministrazioni nella settimana
        };

        for (let supplier of suppliers) {
            entry[supplier] = 0; // somministrazioni del fornitore nella settimana inizializzato a zero
        }

        // definisco ogni giorno in quale settimana si trova
        weeksMappingOptimation[Moment(date).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 1 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 2 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 3 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 4 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 5 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 6 * 86400000)).format('YYYY-MM-DD')] = index;
        index++;

        suppliersWeek.push(entry);

        date = new Date(date.getTime() + 7 * 86400000); // aggiungo 7 gorni
    } while(date <= new Date());

    // aggiorno i totali per ogni fornitore e per l'intera settimana
    for (let row of data.dataSommVaxDetail.data) { // per ogni valore presente nel JSON
        let index = weeksMappingOptimation[Moment(new Date(row.data)).format('YYYY-MM-DD')]; // ottengo l'indice di quale settimana fa parte il giorno corrente
        let week = suppliersWeek[index];

        // Totale Somministrazioni Settimanale ottenuto sommando le somministrazioni di maschi e femmine
        week.total += (row.f + row.m );

        // Totale Somministrazioni Settimanale per fornitore sommando le somministrazioni di maschi e femmine
        week[row.forn] += (row.f + row.m );
    }

    let weekContent = { // insieme di dati da passare al container
        suppliersColor,
        suppliers,
        suppliersWeek
    }

    /********************************************************************************
     * --------------- SOMMINISTRAZIONI PER FASCIA D'ETA' - DOSE --------------------
     * Istogramma + Mappa Italia
     * Possibilità di click sulla regione (Mappa) o sulla fascia anagrafica (Istogramma)
     *******************************************************************************/
    let keyValueDoses = { // oggetto contenente le label delle serie (la legenda)
        "third_booster": "3ª dose Booster ",
        "second_booster": "2ª dose Booster ",
        "addizionale": "1ª dose Booster",
        "seconda": "2ª dose/unica dose",
        "prima": "1ª dose",
        "totale": "Totale fascia"
    }
    let keysDosesAges      = Object.keys(keyValueDoses); // array delle chiavi della serie
    let dosesAges          = Object.values(keyValueDoses); // array del nome delle serie (legenda)
    let dosesAgesColor     = ["#090d4d", "#0b34a3", "#244bb3", "#0a5dbb", "#3073cf", "#548bd6", "#b6d5f4"]; // colori associati alle serie


    // array con i valori da visualizzare nell'istogramma senza filtri.
    let dosesAgesData = _(dataSommVaxDetail).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
            if (e.eta === '90+' || e.eta === '80-89') {
                e.eta = '80+';
            }
            return e;
        }).groupBy("eta").map((items, rowAge) => { // raggruppo i valori in base alla fascia anagrafica

        let keyAge = 'Fascia ' + rowAge; // keyAge è la fascia anagrafica, nel caso di 80+ non deve apparire 80+ ma over 80, nel caso 00-04 0-4
        if (rowAge === '80+') {
            keyAge = 'Fascia over 80';
        }
        if (rowAge === '00-04') {
            keyAge = 'Fascia 0-4';
        }

        let entryTmp = {
            'prima'                 : _.sum(items.filter(e => e.forn !== 'Janssen').map(e => e.d1)), // sommo tutte le prime dosi per vaccini diversi da Janssen
            'seconda'               : _.sum(items.filter(e => e.forn !== 'Janssen').map(e => e.d2)) + _.sum(items.filter(e => e.forn === 'Janssen').map(e => e.d1)) + _.sum(items.map(e => e.dpi)), // sommo le prime dosi Janssen, le seconde dosi non Janssen e le pregresse infezioni
            'addizionale'           : _.sum(items.map(e => e.db1)), // sommo le dosi addizionali
            'second_booster'        : _.sum(items.map(e => e.db2)), // sommo le seconde dosi booster
            'third_booster'         : _.sum(items.map(e => e.db3)), // sommo le terze dosi booster,
            'Totale platea'         : _.sum(dataPlatea.filter(e => e.eta === rowAge).map(e => e.totale_popolazione)) // totale platea per la fascia anagrafica corrente
        }

        // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente
        return {
            'label'                 : keyAge,
            'third_booster'         : entryTmp['third_booster'],
            'second_booster'        : entryTmp['second_booster'] > entryTmp['third_booster'] ? entryTmp['second_booster'] - entryTmp['third_booster'] : 0,
            'addizionale'           : entryTmp['addizionale'] > entryTmp['second_booster'] ? entryTmp['addizionale'] - entryTmp['second_booster'] : 0,
            'seconda'               : entryTmp['seconda'] > entryTmp['addizionale'] ? entryTmp['seconda'] - entryTmp['addizionale'] : 0,
            'prima'                 : entryTmp['prima'] > entryTmp['seconda'] ? entryTmp['prima'] - entryTmp['seconda'] : 0,
            'totale'                : entryTmp['Totale platea'] > entryTmp['prima'] ? entryTmp['Totale platea'] - entryTmp['prima'] : 0,
            'Totale platea'         : entryTmp['Totale platea'],
        };
    }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista dei guariti secondo la fascia anagrafica;


    // array con i valori da visualizzare nella mappa (regione, totale percentuale) con e senza filtri
    const secondDosesMapData  = _(dataSommVaxDetail?.map(replaceArea)).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
            if (e.eta === '90+' || e.eta === '80-89') {
                e.eta = '80+';
            }
            return e;
        }).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        let entry = {
            code                : code, // codice regione
            area                : _.head(items)?.area, // nome esteso regione
            somministrazioni    : _.sum(items.filter(e => e.forn !== 'Janssen').map(e => e.d2)) + _.sum(items.filter(e => e.forn === 'Janssen').map(e => e.d1)) + _.sum(items.map(e => e.dpi)) // sommo solo chi ha completato il ciclo vaccinale
        }

        let popolazione = _.sum(dataPlatea.filter(e => e.area === code).map(e => e.totale_popolazione)) // totale platea nella regione corrente        
        entry['somministrazioni'] = entry['somministrazioni'] / popolazione * 100; // calcolo la percentuale del totale sulla platea

        for (let rowAge of fasciaEta) { // per tutte le fasce d'età
            let keyAge = rowAge === '80+' ? 'fascia_over_80' : 'fascia_' + rowAge;
            entry[keyAge]   = _.sum(items.filter(e => rowAge === e.eta && e.forn !== 'Janssen').map(e => e.d2)) + _.sum(items.filter(e => rowAge === e.eta && e.forn === 'Janssen').map(e => e.d1)) + _.sum(items.filter(e => rowAge === e.eta).map(e => e.dpi)); // sommo chi ha completato il ciclo vaccinale di quella fascia anagrafica
            let popolazioneFascia = _.sum(dataPlatea.filter(e => e.area === code && e.eta === rowAge).map(e => e.totale_popolazione)); // calcolo la platea della fascia anagrafica corrente in quella determinata regione
            entry[keyAge] = entry[keyAge] / popolazioneFascia * 100; // calcolo la percentuale
        }
        
        return entry;
    }).value();

    // array con i valori da visualizzare nell'istogramma con il filtro regione attivo
    const dosesAgesRegionData  = {};
    _(dataSommVaxDetail?.map(replaceArea)).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
        if (e.eta === '90+' || e.eta === '80-89') {
            e.eta = '80+';
        }
        return e;
    }).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        dosesAgesRegionData[code] = _(items?.map(replaceArea)).groupBy("eta").map((subItems, rowAge) => { // raggruppo i valori in base all'età
            let keyAge = 'Fascia ' + rowAge; // keyAge è la fascia anagrafica, nel caso di 80+ non deve apparire 80+ ma over 80, nel caso 00-04 0-4
            if (rowAge === '80+') {
                keyAge = 'Fascia over 80';
            }
            if (rowAge === '00-04') {
                keyAge = 'Fascia 0-4';
            }
            
            let entryTmp = {
                'prima'                 : _.sum(subItems.filter(e => e.forn !== 'Janssen').map(e => e.d1)), // sommo tutte le prime dosi per vaccini diversi da Janssen
                'seconda'               : _.sum(subItems.filter(e => e.forn !== 'Janssen').map(e => e.d2)) + _.sum(subItems.filter(e => e.forn === 'Janssen' && e.area === code).map(e => e.d1)) + _.sum(subItems.filter(e => e.area === code).map(e => e.dpi)), // sommo le prime dosi Janssen, le seconde dosi non Janssen e le pregresse infezioni
                'addizionale'           : _.sum(subItems.map(e => e.db1)), // sommo le dosi addizionali
                'second_booster'        : _.sum(subItems.map(e => e.db2)), // sommo le seconde dosi booster
                'third_booster'         : _.sum(subItems.map(e => e.db3)), // sommo le terze dosi booster,
                'Totale platea'         : _.sum(dataPlatea.filter(e => e.eta === rowAge && e.area === code).map(e => e.totale_popolazione)) // totale platea per la fascia anagrafica corrente
            }

            // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente
            return {
                'label'                 : keyAge,
                'third_booster'         : entryTmp['third_booster'],
                'second_booster'        : entryTmp['second_booster'] > entryTmp['third_booster'] ? entryTmp['second_booster'] - entryTmp['third_booster'] : 0,
                'addizionale'           : entryTmp['addizionale'] > entryTmp['second_booster'] ? entryTmp['addizionale'] - entryTmp['second_booster'] : 0,
                'seconda'               : entryTmp['seconda'] > entryTmp['addizionale'] ? entryTmp['seconda'] - entryTmp['addizionale'] : 0,
                'prima'                 : entryTmp['prima'] > entryTmp['seconda'] ? entryTmp['prima'] - entryTmp['seconda'] : 0,
                'totale'                : entryTmp['Totale platea'] > entryTmp['prima'] ? entryTmp['Totale platea'] - entryTmp['prima'] : 0,
                'Totale platea'         : entryTmp['Totale platea'],
            };
        }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista secondo la fascia anagrafica;
        return items;
    }).value();

    let agedosesContent = { // insieme di dati da passare al container
        keyValueDoses,
        keysDosesAges,
        dosesAges,
        dosesAgesColor,
        dosesAgesData,
        dosesAgesRegionData,
        secondDosesMapData  
    }

    /********************************************************************************
     * ------------------- DISTRIBUZIONE VACCINI PER FORNITORE ----------------------
     * Istogramma
     * Possibilità di click sulle barre
     *******************************************************************************/ 

    let totalSuplier        = _.sum(dataSupplierDoses.map((e) => e?.numero_dosi)); // calcolo numero totale di vaccini distribuiti
    const groups            = _.groupBy(dataSupplierDoses, "forn"); // raggruppo la distribuzione dei vaccini per fornitore
    let allDosesSupplier    = Object.keys(groups).map((k) => { // per ogni fornitore raggruppato effettuo la somma dei vaccini distribuiti
        let groupByKey      = groups[k].map((group) => group.numero_dosi);
        let sumTotalDoses   = _.sum(groupByKey);
        return { totale: sumTotalDoses, fornitore: k, allDoses: groups[k] };
    }).sort((a, b) => a.totale < b.totale ? 1 : -1); // ordino la lista dei fornitori secondo le quantità fornite in ordine decrescente

    /********************************************************************************
     * ---------- PRINCIPALI PUNTI DI SOMMINISTRAZIONE PER REGIONE ------------------
     * Tabella + Mappa Italia
     * Possibilità di click sulla tabella
     *******************************************************************************/ 

    const locations         = dataVaxLocations?.map(replaceArea); // dati per la tabella .map(replaceArea) sostituisce la sigla della regione con il nome completo
    // array con i valori da visualizzare nella mappa
    const locationsByRegion = _(dataVaxLocations?.map(replaceArea)).groupBy("area").map((items, area) => { // raggruppo i valori in base alla regione
        return { area: area, locations: items.length }; // locations è il numero di punti di somministrazione per quella regione (numero che appare al click sulla regione)
    }).value();

    /********************************************************************************
     * ------------------------------ FINE CALCOLI ----------------------------------
     * Restituzione dei dati da rendere disponibili all'esterno
     *******************************************************************************/

    const aggr = {
        timestamp,
        tot,
        databoxContent,
        over60Content,
        healedContent,
        weekContent,
        agedosesContent,
        deliverySummary,
        locations,
        locationsByRegion,
        totalDeliverySummary,
        totalDoses,
        allDosesSupplier,
        totalSuplier,  
    };
    return aggr;
};


/********************************************************************************
 * ---------------------- LETTURA DATI DA SORGENTI JSON -------------------------
 * Istogramma
 * Possibilità di click sulle barre
 *******************************************************************************/ 

export const loadData = async () => {
    const [
        resSommVaxSummary,
        resVaxSummary,
        resVaxLocations,
        resLastUpdate,
        resSupplierDoses,
        resPlatea,
        resPlateaDoseAddizionaleBooster,
        resPlateaDoseSecondBooster,
        resPlateaDoseThirdBooster,
        resGuariti,
        resCopertura
    ] = await Promise.all([
        fetch(sommVaxSummaryURL),
        fetch(vaxSummaryURL),
        fetch(vaxLocationsURL),
        fetch(lastUpdateURL),
        fetch(supplierDoses),
        fetch(plateaURL),
        fetch(plateaDoseAddizionaleBoosterURL),
        fetch(plateaDoseSecondBoosterURL),
        fetch(plateaDoseThirdBoosterURL),
        fetch(guaritiURL),
        fetch(coperturaURL)
    ]);

    const arrayLatestURL = [];
    for(var i = 0; i < years.length; i++) {
        arrayLatestURL.push(fetch(sommVaxDetailBaseURL + years[i] + '.json'));
    }
    const arrayLatestRes = await Promise.all(arrayLatestURL);

    const [
        dataSommVaxSummary,
        dataVaxSummary,
        dataVaxLocations,
        dataLastUpdate,
        dataSupplierDoses,
        dataPlatea,
        dataPlateaDoseAddizionaleBooster,
        dataPlateaSecondBooster,
        dataPlateaThirdBooster,
        dataGuariti,
        dataCopertura
    ] = await Promise.all([
        resSommVaxSummary.json(),
        resVaxSummary.json(),
        resVaxLocations.json(),
        resLastUpdate.json(),
        resSupplierDoses.json(),
        resPlatea.json(),
        resPlateaDoseAddizionaleBooster.json(),
        resPlateaDoseSecondBooster.json(),
        resPlateaDoseThirdBooster.json(),
        resGuariti.json(),
        resCopertura.json()
    ]);

    const arrayLatestJson = [];
    for(i = 0; i < arrayLatestRes.length; i++) {
        arrayLatestJson.push(arrayLatestRes[i].json());
    }
    const arrayLatestData = await Promise.all(arrayLatestJson);

    const dataSommVaxDetail = arrayLatestData[0];
    for(i = 0; i < arrayLatestData.length; i++) {
        dataSommVaxDetail.data = [...dataSommVaxDetail.data, ...arrayLatestData[i].data];
    }

    return {
        ...elaborate({
            dataSommVaxSummary,
            dataSommVaxDetail,
            dataVaxSummary,
            dataLastUpdate,
            dataVaxLocations,
            dataSupplierDoses,
            dataPlatea,
            dataPlateaDoseAddizionaleBooster,
            dataPlateaSecondBooster,
            dataPlateaThirdBooster,
            dataGuariti,
            dataCopertura
        })
    };
};
