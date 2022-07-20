import { sumDoseX, replaceArea, areaMapping } from "./utils";
import _ from "lodash";
import Moment from 'moment';

const baseURL = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati";

const sommVaxSummaryURL                     = `${baseURL}/somministrazioni-vaccini-summary-latest.json`;
const sommVaxDetailURL                      = `${baseURL}/somministrazioni-vaccini-latest.json`;
const vaxSummaryURL                         = `${baseURL}/vaccini-summary-latest.json`;
const vaxLocationsURL                       = `${baseURL}/punti-somministrazione-tipologia.json`;
const anagraficaSummaryURL                  = `${baseURL}/anagrafica-vaccini-summary-latest.json`;
const lastUpdateURL                         = `${baseURL}/last-update-dataset.json`;
const supplierDoses                         = `${baseURL}/consegne-vaccini-latest.json`;
const plateaURL                             = `${baseURL}/platea.json`;
const plateaDoseAddizionaleBoosterURL       = `${baseURL}/platea-dose-addizionale-booster.json`;
const plateaDoseSecondBoosterURL            = `${baseURL}/platea-second-booster.json`;
const guaritiURL                            = `${baseURL}/soggetti-guariti.json`;

const elaborate = (data) => {
    const tot = data.dataSommVaxSummary.data
        .filter((d) => d.area !== "ITA")
        .reduce(sumDoseX("totale"), 0);

    // datatable and map
    const dataSupplier      = data.dataSupplierDoses.data;
    const dataSomeVaxDetail = data.dataSommVaxDetail.data.map(replaceArea);
    const deliverySummary   = data.dataVaxSummary.data.map(replaceArea);

    // categories and ages summary
    const dataVaxSomLatest  = data?.dataSommVaxDetail?.data;

    let totalDoses = {
        prima_dose:                     _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? 0 : e?.d1)),
        prima_dose_baby:                _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? e?.d1 : 0)),
        seconda_dose:                   _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? 0 : e?.d2)),
        seconda_dose_baby:              _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? e?.d2 : 0)),
        pregressa_infezione:            _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? 0 : e?.dpi)),
        pregressa_infezione_baby:       _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? e?.dpi : 0)),
        dose_addizionale_booster:       _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? 0 : e?.db1)),
        dose_addizionale_booster_baby:  _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? e?.db1 : 0)),
        dose_immunocompromessi_fragili: _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? 0 : e?.dbi)),
        dose_second_booster:            _.sum(dataVaxSomLatest?.map((e) => e?.eta === '05-11' ? 0 : e?.db2)),
        prima_dose_janssen:         _.sum(
                                        dataVaxSomLatest
                                        ?.filter((e) => e.forn === "Janssen" && e?.eta !== '05-11')
                                        .map((e) => e?.d1)
                                    ),
        prima_dose_janssen_baby:         _.sum(
                                        dataVaxSomLatest
                                        ?.filter((e) => e.forn === "Janssen" && e?.eta === '05-11')
                                        .map((e) => e?.d1)
                                    ),
        vax_somministrati:          _.sum(
                                        dataSupplier
                                        ?.filter((e) => e?.data_consegna?.substr(0, 10) !== "2020-12-27")
                                        ?.map((_e) => _e?.numero_dosi)
                                        )?.toLocaleString("it"),
    };

    if (!totalDoses.pregressa_infezione) {
        totalDoses.pregressa_infezione = 0;
    }

    if (!totalDoses.dose_addizionale_booster) {
        totalDoses.dose_addizionale_booster = 0;
    }

    if (!totalDoses.pregressa_infezione_baby) {
        totalDoses.pregressa_infezione_baby = 0;
    }

    if (!totalDoses.dose_addizionale_booster_baby) {
        totalDoses.dose_addizionale_booster_baby = 0;
    }

    const groups = _.groupBy(dataSupplier, "forn");
    let allDosesSupplier = Object.keys(groups).map((k) => {
        let groupByKey = groups[k].map((group) => group.numero_dosi);
        let sumTotalDoses = _.sum(groupByKey);
        return { totale: sumTotalDoses, fornitore: k, allDoses: groups[k] };
    }).sort((a, b) => a.totale < b.totale ? 1 : -1);

    let totalSuplier = _.sum(allDosesSupplier.map((e) => e?.totale));

    let allDosesMapByArea = _.groupBy(dataSupplier, "area");
    let doesesByArea = Object.keys(allDosesMapByArea).map((area) => {
        let groupByArea = allDosesMapByArea[area].map((dose) => dose.numero_dosi);
        let totalDosesByArea = _.sum(groupByArea);
        return { area: areaMapping[area], dosi_somministrate: totalDosesByArea };
    });

    const deliveredByArea = _.groupBy(deliverySummary, "code");

    const locations = data.dataVaxLocations.data.map(replaceArea);

    let maxNumberOfLocations = 0;

    const locationsByRegion = _(data.dataVaxLocations.data.map(replaceArea))
        .groupBy("area")
        .map((items, area) => {
            maxNumberOfLocations =
                maxNumberOfLocations > items.length
                    ? maxNumberOfLocations
                    : items.length;
            return { area: area, locations: items.length };
        })
        .value();

    const totalDeliverySummary = _(data.dataSommVaxDetail.data.map(replaceArea))
        .groupBy("code")
        .map((items, code) => {
            const details = _.head(deliveredByArea[code]);
            return {
                code: code,
                area: _.head(items)?.area,
                byAge: _(items)
                    .groupBy("eta")
                    .map((rows, age) => {
                        const dosi_somministrate = _.sumBy(
                            rows,
                            (r) => r.m + r.f
                        );
                        const percentage = dosi_somministrate / (details.dosi_consegnate || 1);
                        return {
                            age: age,
                            fascia_anagrafica: age,
                            dosi_somministrate,
                            dosi_consegnate: details.dosi_consegnate || 0,
                            percentuale_somministrazione: +(percentage * 100).toFixed(1),
                            area: _.head(items)?.area,
                            totale: dosi_somministrate,
                        };
                    })
                    .value(),
                sesso_femminile: _.sumBy(items, "f"),
                sesso_maschile: _.sumBy(items, "m"),
                dosi_consegnate: details.dosi_consegnate || 0,
                dosi_somministrate: details.dosi_somministrate || 0,
                percentuale_somministrazione: details.percentuale_somministrazione || 0,
            };
        })
        .value();

    const totalDeliverySummaryByAge = _(data.dataSommVaxDetail.data.map(replaceArea))
        .groupBy((i) => i["eta"].toString().trim())
        .map((rows, age) => {
            const details = _(rows)
            .groupBy("code")
            .map((rowsData, code) => {
                const dosi_somministrate = _.sumBy(
                    rowsData,
                    (r) => r.m + r.f
                );
                const percentage =
                    dosi_somministrate /
                    (_.head(deliveredByArea[code]).dosi_consegnate || 1);
                return {
                    age: age,
                    dosi_somministrate,
                    sesso_maschile: _.sumBy(rowsData, "m"),
                    sesso_femminile: _.sumBy(rowsData, "f"),
                    code: code,
                    dosi_consegnate: _.head(deliveredByArea[code]).dosi_consegnate || 0,
                    percentuale_somministrazione: +(percentage * 100).toFixed(1),
                    area: _.head(rowsData).area,
                    //details: rows
                };
            })
            .value();

            return {
                age: age,
                details: details,
            };
        })
        .groupBy("age")
        .value();

    /* ages stack bar chart */
    let keyValueDoses = {
        "second_booster": "2ª dose Booster",
        "immunocompromessi": "Booster Fragili/Immunocompromessi",
        "addizionale": "Dose addizionale/booster",
        "seconda": "2ª dose/unica dose",
        "prima": "1ª dose",
        "totale": "Totale fascia"
    }
    let keysDosesAges = Object.keys(keyValueDoses);

    let dosesAges = []; //legend
    for(let keyOfKeyValues of Object.keys(keyValueDoses)) {
        dosesAges.push(keyValueDoses[keyOfKeyValues]);
    }
    let dosesAgesColor = ["#061b56", "#0d2d85", "#0a5dbb", "#3073cf", "#548bd6", "#b6d5f4"]; // color

    let regionsDoses = {};
    let dosesAgesData = [];
    let dosesAgesRegionData = {};

    let agesTmp = {};
    for (let row of data.dataSommVaxDetail.data) {
        var key = row.eta;

        if (key === '80-89' || key === '90+') {
            key = 'over 80'
        }
        if (key === '5-11') {
            key = '05-11'
        }

        if (!agesTmp.hasOwnProperty(key)) {
            agesTmp[key] = {};
            for(let doseKey of Object.keys(keyValueDoses)) {
                agesTmp[key][doseKey] = 0;
            }
        }

        if (row.forn === 'Janssen') {
            agesTmp[key]['seconda'] += row.d1;
        }
        else {
            agesTmp[key]['prima'] += row.d1;
            agesTmp[key]['seconda'] += row.d2;
        }
        agesTmp[key]['seconda'] += row.dpi;

        agesTmp[key]['addizionale'] += row.db1;
        if (row.hasOwnProperty('dbi')) {
            agesTmp[key]['immunocompromessi'] += row.dbi;
        }
        if (row.hasOwnProperty('db2')) {
            agesTmp[key]['second_booster'] += row.db2;
        }

        /* regions data */
        if (!regionsDoses.hasOwnProperty(row.area)) {
            regionsDoses[row.area] = {};
            regionsDoses[row.area][key] = {}

            for(let doseKey of Object.keys(keyValueDoses)) {
                regionsDoses[row.area][key][doseKey] = 0;
            }
        }
        else {
            if (!regionsDoses[row.area].hasOwnProperty(key)) {
                regionsDoses[row.area][key] = {}

                for(let doseKey of Object.keys(keyValueDoses)) {
                    regionsDoses[row.area][key][doseKey] = 0;
                }
            }
        }
        if (row.forn === 'Janssen') {
            regionsDoses[row.area][key]['seconda'] += row.d1;
        }
        else {
            regionsDoses[row.area][key]['prima'] += row.d1;
            regionsDoses[row.area][key]['seconda'] += row.d2;
        }
        regionsDoses[row.area][key]['seconda'] += row.dpi;
        regionsDoses[row.area][key]['addizionale'] += row.db1;

        if (row.hasOwnProperty('dbi')) {
            regionsDoses[row.area][key]['immunocompromessi'] += row.dbi;
        }
        if (row.hasOwnProperty('db2')) {
            regionsDoses[row.area][key]['second_booster'] += row.db2;
        }
    }

    let ageDosesTotal = {};

    for (let row of Object.keys(agesTmp).sort().reverse()) {
        var entry = {
            label: "Fascia " + row
        };

        entry['second_booster'] = agesTmp[row]['second_booster'];
        entry['immunocompromessi'] = agesTmp[row]['immunocompromessi']  - agesTmp[row]['second_booster'];
        entry['addizionale'] = agesTmp[row]['addizionale'] - agesTmp[row]['immunocompromessi'];
        entry['seconda'] = agesTmp[row]['seconda'] - agesTmp[row]['addizionale'];
        entry['prima'] = agesTmp[row]['prima'] - agesTmp[row]['seconda'];

        entry["Totale platea"] = 0;
        for (let platea of data.dataPlatea.data) {
            if (platea.eta === row || (row === 'over 80' && platea.eta === '80+')) {
                entry["Totale platea"] += parseInt(platea.totale_popolazione);
            }
        }

        entry['totale'] = entry["Totale platea"] - agesTmp[row]['prima'];

        ageDosesTotal[entry['label']] = agesTmp[row]['prima'] + agesTmp[row]['seconda'] + agesTmp[row]['addizionale'] + agesTmp[row]['immunocompromessi'] + agesTmp[row]['second_booster'];

        dosesAgesData.push(entry);
    }

    let totalGuariti = 0;
    let totalGuaritiDoppia = 0;
    let totalGuaritiBooster = 0;
    let totalGuaritiBoosterNotBaby = 0;
    let totalGuaritiBaby = 0;
    for (let row of data.dataGuariti.data) {
        if (row.eta === '05-11') {
            totalGuaritiBaby += parseInt(row.guariti_senza_somm);
        }
        else {
            totalGuaritiBoosterNotBaby += parseInt(row.guariti_post_1booster);
        }
        totalGuariti += parseInt(row.guariti_senza_somm);
        totalGuaritiDoppia += parseInt(row.guariti_post_somm);
        totalGuaritiBooster += parseInt(row.guariti_post_1booster);
    }

    let totalPlatea = 0;
    let totalPlateaBaby = 0;
    for (let platea of data.dataPlatea.data) {
        if (platea.eta === '05-11') {
            totalPlateaBaby += parseInt(platea.totale_popolazione);
        }
        else {
            totalPlatea += parseInt(platea.totale_popolazione);
        }
    }

    let secondDoses = {}
    for (let row of data.dataSommVaxDetail.data) {
        entry = {};
        if (secondDoses.hasOwnProperty(row.area)) {
            entry = secondDoses[row.area];
        }

        var secondDoseTmp = row.d2;
        if (row.forn === 'Janssen') {
            secondDoseTmp = row.d1;
        }
        if (row.hasOwnProperty('dpi')) {
            secondDoseTmp += row.dpi;
        }

        if (!secondDoses.hasOwnProperty(row.area)) {
            entry = {
                'code': row.area,
                'area': areaMapping[row.area],
                'somministrazioni': secondDoseTmp
            };
        }
        else {
            entry['somministrazioni'] += secondDoseTmp;
        }

        for (let rowAge of Object.keys(agesTmp)) {
            let keyAge = rowAge === 'over 80' ? 'fascia_over_80' : 'fascia_' + rowAge;
            if (entry.hasOwnProperty(keyAge)) {
                entry[keyAge] += (rowAge === row.eta || (rowAge === 'over 80' && (row.eta === '90+' || row.eta === '80-89'))) ? secondDoseTmp : 0;
            }
            else {
                entry[keyAge] = (rowAge === row.eta || (rowAge === 'over 80' && (row.eta === '90+' || row.eta === '80-89'))) ? secondDoseTmp : 0;
            }
        }
        secondDoses[row.area] = entry;
    }

    // Array delle regioni avente numero somministrazioni seconde dosi globale e per fasce d'età
    let secondDosesData = [];
    for (let region of Object.keys(secondDoses)) {
        secondDosesData.push(secondDoses[region]);
    }

    // Oggetto che contiene i dati della Platea aggregati
    let plateaRegionAges = {};
    for (let platea of data.dataPlatea.data) {
        if (!plateaRegionAges.hasOwnProperty(platea.area)) {
            plateaRegionAges[platea.area] = {
                'popolazione': 0
            };
        }

        let keyAge = platea.eta === '80+' ? 'fascia_over_80' : (platea.eta === '05-11' ? 'fascia_05-11' : 'fascia_' + platea.eta);
        let popolazione = parseInt(platea.totale_popolazione);

        plateaRegionAges[platea.area][keyAge] = {
            'popolazione': 0
        };

        plateaRegionAges[platea.area][keyAge]['popolazione'] = popolazione; // per singola fascia
        plateaRegionAges[platea.area]['popolazione'] += popolazione; // totale per regione
    }

    let secondDosesPlateaData = [];
    for (let region of Object.keys(secondDoses)) {
        let tmpElem = secondDoses[region];

        let entry = {};
        for (let subItem of Object.keys(tmpElem)) {
            if (subItem.includes("fascia")) {
                entry[subItem] = tmpElem[subItem] / plateaRegionAges[region][subItem]['popolazione'] * 100;
            }
            else {
                entry[subItem] = tmpElem[subItem];
            }
        }
        entry['somministrazioni'] = entry['somministrazioni'] / plateaRegionAges[region]['popolazione'] * 100;

        secondDosesPlateaData.push(entry);
    }

    for (let region of Object.keys(regionsDoses)) {
        let arrayTmp = [];

        for (let row of Object.keys(regionsDoses[region]).sort().reverse()) {
            entry = {
                label: "Fascia " + row
            };

            entry['second_booster'] = regionsDoses[region][row]['second_booster'];
            entry['immunocompromessi'] = regionsDoses[region][row]['immunocompromessi'] - regionsDoses[region][row]['second_booster'];
            entry['addizionale'] = regionsDoses[region][row]['addizionale'] - regionsDoses[region][row]['immunocompromessi'];
            entry['seconda'] = regionsDoses[region][row]['seconda'] - regionsDoses[region][row]['addizionale'];
            entry['prima'] = regionsDoses[region][row]['prima'] - regionsDoses[region][row]['seconda'];

            entry["Totale platea"] = 0;
            for (let platea of data.dataPlatea.data) {
                if (platea.area === region && (platea.eta === row || (row === 'over 80' && platea.eta === '80+'))) {
                    entry["Totale platea"] += parseInt(platea.totale_popolazione);
                }
            }

            entry['totale'] = entry["Totale platea"] - entry['prima'] - entry['seconda'] - entry['addizionale'] - entry['immunocompromessi'] - entry['second_booster'];

            arrayTmp.push(entry);
        }

        dosesAgesRegionData[region] = arrayTmp;
    }

    /* healed stack bar chart */
    let keyValueHealed = {
        "senza": "Guariti senza somministrazione da al massimo 6 mesi",
        "post": "Guariti post 2ª dose/unica dose da al massimo 4 mesi",
        "booster": "Guariti post 1ª dose booster da al massimo 6 mesi"
    }
    let keysHealed = Object.keys(keyValueHealed);

    let healedColor = ["#b6d5f4", "#0a5dbb", "#012675" ];

    let regionsHealed = {};
    let healed = [];
    for(let keyOfKeyValues of Object.keys(keyValueHealed)) {
        healed.push(keyValueHealed[keyOfKeyValues]);
    }

    let healedData = [];
    let healedRegionData = {};

    let healedTmp = {};
    for (let row of data.dataGuariti.data) {
        key = row.eta;

        if (key === '80+') {
            key = 'over 80'
        }

        if (!healedTmp.hasOwnProperty(key)) {
            healedTmp[key] = {}
            for(let healedKey of Object.keys(keyValueHealed)) {
                healedTmp[key][healedKey] = 0;
            }
        }

        healedTmp[key]["senza"] += row.guariti_senza_somm;
        healedTmp[key]["post"] += row.guariti_post_somm;
        healedTmp[key]["booster"] += row.guariti_post_1booster;


        /* regions data */
        if (!regionsHealed.hasOwnProperty(row.area)) {
            regionsHealed[row.area] = {};
            regionsHealed[row.area][key] = {}
            for(let healedKey of Object.keys(keyValueHealed)) {
                regionsHealed[row.area][key][healedKey] = 0;
            }
        }
        else {
            if (!regionsHealed[row.area].hasOwnProperty(key)) {
                regionsHealed[row.area][key] = {}
                for(let healedKey of Object.keys(keyValueHealed)) {
                    regionsHealed[row.area][key][healedKey] = 0;
                }
            }
        }

        regionsHealed[row.area][key]["senza"] += row.guariti_senza_somm;
        regionsHealed[row.area][key]["post"] += row.guariti_post_somm;
        regionsHealed[row.area][key]["booster"] += row.guariti_post_1booster;
    }

    let healedTotal = {};

    for (let row of Object.keys(healedTmp).sort().reverse()) {
        entry = {
            label: "Fascia " + row
        };
        entry["senza"] = healedTmp[row]["senza"];                           // 318K boo
        entry["post"] = healedTmp[row]["post"] - healedTmp[row]["senza"];   // 40K  senza
        entry["booster"] = healedTmp[row]["booster"] - healedTmp[row]["post"];       // 100K post

        healedTotal[entry['label']] = healedTmp[row]["booster"] + healedTmp[row]["post"] + healedTmp[row]["senza"];

        healedData.push(entry);
    }

    for (let region of Object.keys(regionsHealed)) {
        let arrayTmp = [];

        for (let row of Object.keys(regionsHealed[region]).sort().reverse()) {
            entry = {
                label: "Fascia " + row
            };
            entry["senza"] = regionsHealed[region][row]["senza"];
            entry["post"] = regionsHealed[region][row]["post"] - regionsHealed[region][row]["senza"];
            entry["booster"] = regionsHealed[region][row]["booster"] - regionsHealed[region][row]["post"];

            entry["Totale"] = regionsHealed[region][row]["booster"] + regionsHealed[region][row]["post"] + regionsHealed[region][row]["senza"];

            arrayTmp.push(entry);
        }

        healedRegionData[region] = arrayTmp;
    }

    let regionsHealedTmp = {}
    for (let row of data.dataGuariti.data) {
        entry = {};
        if (regionsHealedTmp.hasOwnProperty(row.area)) {
            entry = regionsHealedTmp[row.area];
        }

        let valueSum = row.guariti_senza_somm + row.guariti_post_somm;
        if (!regionsHealedTmp.hasOwnProperty(row.area)) {
            entry = {
                'code': row.area,
                'area': areaMapping[row.area],
                'guariti': valueSum
            };
        }
        else {
            entry['guariti'] += valueSum;
        }

        for (let rowAge of Object.keys(healedTmp)) {
            let keyAge = rowAge === 'over 80' ? 'fascia_over_80' : 'fascia_' + rowAge;
            if (entry.hasOwnProperty(keyAge)) {
                entry[keyAge] += (rowAge === row.eta || (rowAge === 'over 80' && (row.eta === '80+'))) ? valueSum : 0;
            }
            else {
                entry[keyAge] = (rowAge === row.eta || (rowAge === 'over 80' && (row.eta === '80+'))) ? valueSum : 0;
            }
        }

        regionsHealedTmp[row.area] = entry;
    }

    let healedMapData = [];
    for (let region of Object.keys(regionsHealedTmp)) {
        let tmpElem = regionsHealedTmp[region];

        let entry = {};
        for (let subItem of Object.keys(tmpElem)) {
            if (subItem.includes("fascia")) {
                entry[subItem] = tmpElem[subItem];
            }
            else {
                entry[subItem] = tmpElem[subItem];
            }
        }

        healedMapData.push(entry);
    }

    // suppliers
    let spectrum = ["#0f69c9", "#4d99eb", "#77b2f2", "#b5d4f5", "#d1e0f0", "#edf2f7", "#ffffff"];
    let suppliersColor = {};
    let suppliers = [];

    for (let row of data.dataSommVaxDetail.data) {
        if (!suppliers.includes(row.forn)) {
            suppliers.push(row.forn);
        }
    }

    var indexOfPediatrico = suppliers.indexOf('Pfizer Pediatrico');
    if (indexOfPediatrico !== -1) {
        suppliers.splice(indexOfPediatrico, 1);
        suppliers.push('Pfizer Pediatrico');
    }

    for (let rowFornitore of suppliers) {
        if ((Object.keys(suppliersColor).length - 1) < spectrum.length) {
            suppliersColor[rowFornitore] = spectrum[Object.keys(suppliersColor).length];
        }
        else {
            suppliersColor[rowFornitore] = "#ffffff";
        }
    }

    // all weeks
    let weeksMappingOptimation = {};
    var index = 0;

    let suppliersWeek = [];
    var date = new Date('2020-12-21'); // start date
    while(true) {
        let entry = {
            label: Moment(date).format('DD/MM'),
            from: Moment(date).format('YYYY-MM-DD'),
            labelfrom: Moment(date).format('DD/MM'),
            to: Moment(new Date(date.getTime() + 6 * 86400000)).format('YYYY-MM-DD'),
            labelto: Moment(new Date(date.getTime() + 6 * 86400000)).format('DD/MM'),
            total: 0
        };

        for (let supplier of suppliers) {
            entry[supplier] = 0;
        }

        weeksMappingOptimation[Moment(date).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 1 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 2 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 3 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 4 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 5 * 86400000)).format('YYYY-MM-DD')] = index;
        weeksMappingOptimation[Moment(new Date(date.getTime() + 6 * 86400000)).format('YYYY-MM-DD')] = index;
        index++;

        suppliersWeek.push(entry);

        date = new Date(date.getTime() + 7 * 86400000);

        if (date > new Date()) {
            break;
        }
    }

    // weeks data
    for (let row of data.dataSommVaxDetail.data) {
        let index = weeksMappingOptimation[Moment(new Date(row.data)).format('YYYY-MM-DD')];
        let week = suppliersWeek[index];

        // Totale Somministrazioni Settimanale
        week.total += (
            row.f +
            row.m 
        );

        // Totale Somministrazioni Settimanale per fornitore
        week[row.forn] += (
            row.f +
            row.m 
        );
    }

    let totalPlateaDoseAddizionaleBooster = 0;
    for (let platea of data.dataPlateaDoseAddizionaleBooster.data) {
        totalPlateaDoseAddizionaleBooster += parseInt(platea.totale_popolazione);
    }

    let totalPlateaDoseImmunocompromessiFragili = 0;
    let totalPlateaDoseSecondBooster = 0;
    for (let platea of data.dataPlateaSecondBooster.data) {
        if (platea.categoria_prevalente === 'fragili_immunocompromessi') {
            totalPlateaDoseImmunocompromessiFragili += parseInt(platea.totale_popolazione);
        }
        else {
            totalPlateaDoseSecondBooster += parseInt(platea.totale_popolazione);
        }
    }

    const timestamp = data.dataLastUpdate.ultimo_aggiornamento;
    const aggr = {
        timestamp,
        tot,
        deliverySummary,
        locations,
        dataSomeVaxDetail,
        locationsByRegion,
        maxNumberOfLocations,
        allDosesSupplier,
        doesesByArea,
        totalSuplier,
        totalDoses,
        totalDeliverySummaryByAge,
        totalDeliverySummary,
        suppliersColor,
        suppliers,
        suppliersWeek,
        keyValueDoses,
        keysDosesAges,
        dosesAges,
        dosesAgesColor,
        dosesAgesData,
        dosesAgesRegionData,
        ageDosesTotal,
        healed,
        keyValueHealed,
        keysHealed,
        healedColor,
        healedData,
        healedRegionData,
        healedTotal,
        healedMapData,
        secondDosesData,
        secondDosesPlateaData,
        totalPlatea,
        totalPlateaBaby,
        totalPlateaDoseAddizionaleBooster,
        totalPlateaDoseImmunocompromessiFragili,
        totalPlateaDoseSecondBooster,
        totalGuariti,
        totalGuaritiDoppia,
        totalGuaritiBooster,
        totalGuaritiBoosterNotBaby,
        totalGuaritiBaby
    };
    return aggr;
  };

  export const loadData = async () => {
    const [
        resSommVaxSummary,
        resSommVaxDetail,
        resVaxSummary,
        resProfileSummaryURL,
        resVaxLocations,
        resLastUpdate,
        resSupplierDoses,
        resPlatea,
        resPlateaDoseAddizionaleBooster,
        resPlateaDoseSecondBooster,
        resGuariti
    ] = await Promise.all([
        fetch(sommVaxSummaryURL),
        fetch(sommVaxDetailURL),
        fetch(vaxSummaryURL),
        fetch(anagraficaSummaryURL),
        fetch(vaxLocationsURL),
        fetch(lastUpdateURL),
        fetch(supplierDoses),
        fetch(plateaURL),
        fetch(plateaDoseAddizionaleBoosterURL),
        fetch(plateaDoseSecondBoosterURL),
        fetch(guaritiURL)
    ]);

    const [
        dataSommVaxSummary,
        dataSommVaxDetail,
        dataVaxSummary,
        dataProfileSummary,
        dataVaxLocations,
        dataLastUpdate,
        dataSupplierDoses,
        dataPlatea,
        dataPlateaDoseAddizionaleBooster,
        dataPlateaSecondBooster,
        dataGuariti
    ] = await Promise.all([
        resSommVaxSummary.json(),
        resSommVaxDetail.json(),
        resVaxSummary.json(),
        resProfileSummaryURL.json(),
        resVaxLocations.json(),
        resLastUpdate.json(),
        resSupplierDoses.json(),
        resPlatea.json(),
        resPlateaDoseAddizionaleBooster.json(),
        resPlateaDoseSecondBooster.json(),
        resGuariti.json()
    ]);

    return {
        ...elaborate({
            dataSommVaxSummary,
            dataSommVaxDetail,
            dataVaxSummary,
            dataProfileSummary,
            dataLastUpdate,
            dataVaxLocations,
            dataSupplierDoses,
            dataPlatea,
            dataPlateaDoseAddizionaleBooster,
            dataPlateaSecondBooster,
            dataGuariti
        })
    };
};
