import { replaceArea, sumDoseX } from "./utils";

import Moment from 'moment';
import _ from "lodash";

export const baseURL = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati";

const years                                 = [2020, 2021, 2022, 2023];
const sommVaxSummaryURL                     = `${baseURL}/somministrazioni-vaccini-summary-latest.json`;
const sommVaxDetailBaseURL                  = `${baseURL}/somministrazioni-vaccini-latest-`;
const vaxSummaryURL                         = `${baseURL}/vaccini-summary-latest.json`;
const lastUpdateURL                         = `${baseURL}/last-update-dataset.json`;
const plateaURL                             = `${baseURL}/platea.json`;
const plateaDoseAddizionaleBoosterURL       = `${baseURL}/platea-dose-addizionale-booster.json`;
const plateaDoseSecondBoosterURL            = `${baseURL}/platea-second-booster.json`;
const plateaDoseThirdBoosterURL             = `${baseURL}/platea-3a-booster.json`;


const elaborate = (data) => {
    /* creazioni delle costanti relative alle sorgenti dei file */
    const dataSommVaxSummary                = data?.dataSommVaxSummary?.data;
    const dataSommVaxDetail                 = data?.dataSommVaxDetail?.data;
    const dataVaxSummary                    = data?.dataVaxSummary?.data;
    const dataPlatea                        = data?.dataPlatea?.data;
    const dataPlateaDoseAddizionaleBooster  = data?.dataPlateaDoseAddizionaleBooster?.data;
    const dataPlateaSecondBooster           = data?.dataPlateaSecondBooster?.data;
    const dataPlateaThirdBooster            = data?.dataPlateaThirdBooster?.data;
    // campagna 2023-2024
    const dataSommVaxSummaryCampagna    = data?.dataSommVaxSummaryCampagna?.data;
    const dataSommVaxDetailCampagna     = data?.dataSommVaxDetailCampagna?.data;

    /* array statico contenente tutte le fasce d'età */
    const fasciaEta = ['0-4', '05-11', '12-59', '60-69', '70-79', '80+'];
    const fasciaEtaHistory = ['0-4', '05-11', '12-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'];
    
    /********************************************************************************
     * ----------------------- DATA AGGIORNAMENTO REPORT ----------------------------
     *******************************************************************************/

    //const timestamp = data.dataLastUpdate.data[0].ultimo_aggiornamento;
    const timestamp = data?.dataLastUpdate.data[0].ultimo_aggiornamento;

    /********************************************************************************
     * ------------------------- TOTALE SOMMINISTRAZIONI ----------------------------
     *******************************************************************************/
    const tot = dataSommVaxSummary?.filter((d) => d.area !== "ITA").reduce(sumDoseX("totale"), 0);   
    const totCampagna = dataSommVaxSummaryCampagna?.filter((d) => d.area !== "ITA").reduce(sumDoseX("d"), 0);   

    /********************************************************************************
     * --------------------------- BOX DI RIEPILOGO DATI ----------------------------
     *******************************************************************************/

    /* creazione totalDoses, oggetto contenente la somma delle principali statistiche presenti in Databox.jsx */
    let totalDoses = {
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
    let totalPlateaDoseAddizionaleBooster       = _.sum(dataPlateaDoseAddizionaleBooster?.map((e) => (e?.categoria_prevalente !== '05-11' && e?.categoria_prevalente !== '00-04') ? e?.totale_popolazione : 0)); // totale platea dose booster
    let totalPlateaDoseAddizionaleBoosterBaby   = _.sum(dataPlateaDoseAddizionaleBooster?.map((e) => e?.categoria_prevalente === '05-11' ? e?.totale_popolazione : 0)); // totale platea dose booster
    let totalPlateaDoseSecondBooster            = _.sum(dataPlateaSecondBooster?.map((e) => e?.totale_popolazione)); // totale platea seconda dose booster
    let totalPlateaDoseThirdBooster             = _.sum(dataPlateaThirdBooster?.map((e) => e?.totale_popolazione)); // totale platea terza dose booster

    let databoxContent = { // insieme di dati da passare al container
        totalPlateaDoseAddizionaleBoosterBaby,
        totalPlatea,
        totalPlateaBaby,
        totalPlateaInfant,
        totalPlateaDoseAddizionaleBooster,
        totalPlateaDoseSecondBooster,
        totalPlateaDoseThirdBooster
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
     * ----------- GRAFICO ANDAMENTO SETTIMANALE DELLE SOMMINISTRAZIONI -------------
     * Istogramma a pile
     *******************************************************************************/ 

    let spectrum = ["#0f69c9", "#4d99eb", "#77b2f2", "#b5d4f5", "#d1e0f0", "#edf2f7", "#ffffff"]; // sono presenti più colori del necessario per gestire eventuali nuovi fornitori
    let suppliersColor = {}; // colori associati alle serie
    let suppliers = []; // lista dinamica dei fornitori di vaccini

    for (let row of data.dataSommVaxDetailCampagna.data) { // aggiungo i fornitori evitando duplicazioni
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

    // calcolo le diverse settimane partire dal 13/09/2024 (primo venerdi)
    let weeksMappingOptimation = {};
    var index = 0; // indice della settimana a partire dal 13/09/2024 (primo venerdi)

    let suppliersWeek = [];
    var date = new Date('2024-09-13'); // data di partenza delle somministrazioni che cambierò ad ogni iterazione
    do {
        let entry = {
            label: Moment(new Date(date.getTime() + 6 * 86400000)).format('DD/MM'), // giorno e mese del giovedi della settimana
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
    for (let row of data.dataSommVaxDetailCampagna.data.filter((d) => d.data >= "2024-09-17T00:00:00.000Z")) { // per ogni valore presente nel JSON dal 17/09/2024
        let index = weeksMappingOptimation[Moment(new Date(row.data)).format('YYYY-MM-DD')]; // ottengo l'indice di quale settimana fa parte il giorno corrente
        let week = suppliersWeek[index];

        // Totale Somministrazioni Settimanale ottenuto sommando le somministrazioni di maschi e femmine
        try{
            week.total += (row.f + row.m);
        } catch(e){

        }

        // Totale Somministrazioni Settimanale per fornitore sommando le somministrazioni di maschi e femmine
        week[row.forn] += (row.f + row.m);
    }

    suppliersWeek.pop();

    let weekContent = { // insieme di dati da passare al container
        suppliersColor,
        suppliers,
        suppliersWeek
    }

    /********************************************************************************
     * --------------- SOMMINISTRAZIONI PER FASCIA D'ETA' - DOSE XBB 1.5  --------------------
     * Istogramma + Mappa Italia
     * Possibilità di click sulla regione (Mappa) o sulla fascia anagrafica (Istogramma)
     *******************************************************************************/
    // dataSommVaxDetailCampagna contiene i dati della campagna
    let keyValueDoses = { // oggetto contenente le label delle serie (la legenda)
        "totale": "Totale fascia"
    }
    let keysDosesAges      = Object.keys(keyValueDoses); // array delle chiavi della serie
    let dosesAges          = Object.values(keyValueDoses); // array del nome delle serie (legenda)
    let dosesAgesColor     = ["#0a5dbb"]; // colori associati alle serie

    // array con i valori da visualizzare nell'istogramma senza filtri.
    let dosesAgesData = _(dataSommVaxDetailCampagna).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+, e tutta la fascia 12-59
            if (e.eta === '90+' || e.eta === '80-89') {
                e.eta = '80+';
            }
            if (e.eta === '50-59' || e.eta === '40-49' || e.eta === '30-39' || e.eta === '20-29' || e.eta === '12-19') {
                e.eta = '12-59';
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
            'totale'                 : _.sum(items.map(e => e.d)), // sommo tutte le somministrazioni
        }

        // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente (per ora ha una sola serie di conseguenza non devo calcolare scostamenti)
        return {
            'label'                 : keyAge,
            'totale'                : entryTmp['totale']
        };
    }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista secondo la fascia anagrafica;
    
    // array con i valori da visualizzare nella mappa (regione, totale percentuale) con e senza filtri
    const secondDosesMapData  = _(dataSommVaxDetailCampagna?.map(replaceArea)).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
            if (e.eta === '90+' || e.eta === '80-89') {
                e.eta = '80+';
            }
            if (e.eta === '50-59' || e.eta === '40-49' || e.eta === '30-39' || e.eta === '20-29' || e.eta === '12-19') {
                e.eta = '12-59';
            }
            return e;
        }).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        let entry = {
            code                : code, // codice regione
            area                : _.head(items)?.area, // nome esteso regione
            totale              : _.sum(items.map(e => e.d)) // sommo solo chi ha completato il ciclo vaccinale (coincide con le somministrazioni)
        }

        for (let rowAge of fasciaEta) { // per tutte le fasce d'età
            let keyAge = rowAge === '80+' ? 'fascia_over_80' : 'fascia_' + rowAge;
            let rowAgeCorrect = rowAge === '0-4' ? '00-04' : rowAge;
            entry[keyAge]   = _.sum(items.filter(e => rowAgeCorrect === e.eta).map(e => e.d)); // sommo chi ha completato il ciclo vaccinale di quella fascia anagrafica (che coincide con le somministrazioni)
        }
        return entry;
    }).value();

    // array con i valori da visualizzare nell'istogramma con il filtro regione attivo
    const dosesAgesRegionData  = {};
    _(dataSommVaxDetailCampagna?.map(replaceArea)).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
        if (e.eta === '90+' || e.eta === '80-89') {
            e.eta = '80+';
        }
        if (e.eta === '50-59' || e.eta === '40-49' || e.eta === '30-39' || e.eta === '20-29' || e.eta === '12-19') {
            e.eta = '12-59';
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
                'totale'                 : _.sum(subItems.map(e => e.d)), // sommo tutte le vaccinazioni
            }

            // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente (in questo caso non sono presenti altre serie)
            return {
                'label'                 : keyAge,
                'totale'                : entryTmp['totale']
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
     * --------------- SOMMINISTRAZIONI PER FASCIA D'ETA' - DOSE STORICA --------------------
     * Istogramma + Mappa Italia
     * Possibilità di click sulla regione (Mappa) o sulla fascia anagrafica (Istogramma)
     *******************************************************************************/
    // dataSommVaxDetail contiene i dati storici

    let keyValueDosesHistory = { // oggetto contenente le label delle serie (la legenda)
        "third_booster": "3ª dose Booster ",
        "second_booster": "2ª dose Booster ",
        "addizionale": "1ª dose Booster",
        "seconda": "2ª dose/unica dose",
        "prima": "1ª dose",
        "totale": "Totale fascia"
    }
    let keysDosesAgesHistory      = Object.keys(keyValueDosesHistory); // array delle chiavi della serie
    let dosesAgesHistory          = Object.values(keyValueDosesHistory); // array del nome delle serie (legenda)
    let dosesAgesColorHistory     = ["#090d4d", "#0b34a3", "#244bb3", "#0a5dbb", "#3073cf", "#548bd6", "#b6d5f4"]; // colori associati alle serie

    // array con i valori da visualizzare nell'istogramma senza filtri.
    let dosesAgesDataHistory = _(dataSommVaxDetail).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
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

        let totaleSom = _.sum(items.map(e => e.m + e.f));

        // siccome si tratta di un grafico a pile, devo calcolare lo scostamento con la serie precedente
        return {
            'label'                 : keyAge,
            'third_booster'         : entryTmp['third_booster'],
            'second_booster'        : entryTmp['second_booster'] > entryTmp['third_booster'] ? entryTmp['second_booster'] - entryTmp['third_booster'] : 0,
            'addizionale'           : entryTmp['addizionale'] > entryTmp['second_booster'] ? entryTmp['addizionale'] - entryTmp['second_booster'] : 0,
            'seconda'               : entryTmp['seconda'] > entryTmp['addizionale'] ? entryTmp['seconda'] - entryTmp['addizionale'] : 0,
            'prima'                 : entryTmp['prima'] > entryTmp['seconda'] ? entryTmp['prima'] - entryTmp['seconda'] : 0,
            'totale'                : entryTmp['Totale platea'] > entryTmp['prima'] ? entryTmp['Totale platea'] - entryTmp['prima'] : 0,
            'totale_somministrazioni': totaleSom,
            'Totale platea'         : entryTmp['Totale platea'],
        };
    }).value().sort((a, b) => a.label < b.label ? 1 : -1); // ordino la lista secondo la fascia anagrafica;

    // array con i valori da visualizzare nella mappa (regione, totale percentuale) con e senza filtri
    const secondDosesMapDataHistory  = _(dataSommVaxDetail?.map(replaceArea)).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
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
        entry['vaccinati'] = entry['somministrazioni']; // chi ha completato il ciclo vaccinale primario      
        entry['somministrazioni'] = entry['somministrazioni'] / popolazione * 100; // calcolo la percentuale del totale sulla platea
        
        for (let rowAge of fasciaEtaHistory) { // per tutte le fasce d'età storiche
            let keyAge = rowAge === '80+' ? 'fascia_over_80' : 'fascia_' + rowAge;
            let rowAgeCorrect = rowAge === '0-4' ? '00-04' : rowAge;
            entry[keyAge]   = _.sum(items.filter(e => rowAgeCorrect === e.eta && e.forn !== 'Janssen').map(e => e.d2)) + _.sum(items.filter(e => rowAgeCorrect === e.eta && e.forn === 'Janssen').map(e => e.d1)) + _.sum(items.filter(e => rowAgeCorrect === e.eta).map(e => e.dpi)); // sommo chi ha completato il ciclo vaccinale di quella fascia anagrafica
            let popolazioneFascia = _.sum(dataPlatea.filter(e => e.area === code && e.eta === rowAgeCorrect).map(e => e.totale_popolazione)); // calcolo la platea della fascia anagrafica corrente in quella determinata regione
            entry['vaccinati_' + keyAge] = entry[keyAge]; // valore inserito per visualizzare il totale nel pupup sulla mappa
            entry[keyAge] = entry[keyAge] / popolazioneFascia * 100; // calcolo la percentuale
        }
        
        return entry;
    }).value();

    // array con i valori da visualizzare nell'istogramma con il filtro regione attivo
    const dosesAgesRegionDataHistory  = {};
    _(dataSommVaxDetail?.map(replaceArea)).map(e => { // poichè solo in questo file è prevista la fascia 90+ e 80-89, sostituisco 90+ e 80-89 con 80+
        if (e.eta === '90+' || e.eta === '80-89') {
            e.eta = '80+';
        }
        return e;
    }).groupBy("code").map((items, code) => { // raggruppo i valori in base alla regione
        dosesAgesRegionDataHistory[code] = _(items?.map(replaceArea)).groupBy("eta").map((subItems, rowAge) => { // raggruppo i valori in base all'età
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

    let agedosesContentHistory = { // insieme di dati da passare al container
        keyValueDosesHistory,
        keysDosesAgesHistory,
        dosesAgesHistory,
        dosesAgesColorHistory,
        dosesAgesDataHistory,
        dosesAgesRegionDataHistory,
        secondDosesMapDataHistory  
    }


    /********************************************************************************
     * ------------------------------ FINE CALCOLI ----------------------------------
     * Restituzione dei dati da rendere disponibili all'esterno
     *******************************************************************************/

    const aggr = {
        timestamp,
        tot,
        totCampagna,
        databoxContent,
        weekContent,
        agedosesContent,
        agedosesContentHistory,
        deliverySummary,
        totalDeliverySummary,
        totalDoses
    };
    return aggr;
};


/********************************************************************************
 * ---------------------- LETTURA DATI DA SORGENTI JSON -------------------------
 * Istogramma
 * Possibilità di click sulle barre
 *******************************************************************************/ 

export const loadData = async ({campagnaUrl, summaryUrl}) => {
    const [
        resSommVaxSummary,
        resVaxSummary,
        resLastUpdate,
        resPlatea,
        resPlateaDoseAddizionaleBooster,
        resPlateaDoseSecondBooster,
        resPlateaDoseThirdBooster,
        //campagna 2023-2024
        resSommVaxSummaryCampagna,
        resSommVaxDetailCampagna
    ] = await Promise.all([
        fetch(sommVaxSummaryURL),
        fetch(vaxSummaryURL),
        fetch(lastUpdateURL),
        fetch(plateaURL),
        fetch(plateaDoseAddizionaleBoosterURL),
        fetch(plateaDoseSecondBoosterURL),
        fetch(plateaDoseThirdBoosterURL),
        //campagna 2023-2024
        fetch(summaryUrl), // sommVaxSummaryCampagnaURL),
        fetch(campagnaUrl) //sommVaxDetailCampagnaURL),
    ]);

    const arrayLatestURL = [];
    for(var i = 0; i < years.length; i++) {
        arrayLatestURL.push(fetch(sommVaxDetailBaseURL + years[i] + '.json'));
    }

    const arrayLatestRes = await Promise.all(arrayLatestURL);

    const [
        dataSommVaxSummary,
        dataVaxSummary,
        dataLastUpdate,
        dataPlatea,
        dataPlateaDoseAddizionaleBooster,
        dataPlateaSecondBooster,
        dataPlateaThirdBooster,
        //campagna 2023-2024
        dataSommVaxSummaryCampagna,
        dataSommVaxDetailCampagna
    ] = await Promise.all([
        resSommVaxSummary.json(),
        resVaxSummary.json(),
        resLastUpdate.json(),
        resPlatea.json(),
        resPlateaDoseAddizionaleBooster.json(),
        resPlateaDoseSecondBooster.json(),
        resPlateaDoseThirdBooster.json(),
        //campagna 2023-2024
        resSommVaxSummaryCampagna.json(),
        resSommVaxDetailCampagna.json()
    ]);

    const arrayLatestJson = [];
    for(i = 0; i < arrayLatestRes.length; i++) {
        arrayLatestJson.push(arrayLatestRes[i].json());
    }
    const arrayLatestData = await Promise.all(arrayLatestJson);

    const dataSommVaxDetail = arrayLatestData[0];
    for(i = 1; i < arrayLatestData.length; i++) {
        dataSommVaxDetail.data = [...dataSommVaxDetail.data, ...arrayLatestData[i].data];
    }

    return {
        ...elaborate({
            dataSommVaxSummary,
            dataSommVaxDetail,
            dataVaxSummary,
            dataLastUpdate,
            dataPlatea,
            dataPlateaDoseAddizionaleBooster,
            dataPlateaSecondBooster,
            dataPlateaThirdBooster,
            //campagna 2023-2024
            dataSommVaxSummaryCampagna,
            dataSommVaxDetailCampagna
        })
    };
};
