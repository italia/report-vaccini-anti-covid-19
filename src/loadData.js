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
        prima_dose:                     _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? 0 : e?.prima_dose)),
        prima_dose_baby:                _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? e?.prima_dose : 0)),
        seconda_dose:                   _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? 0 : e?.seconda_dose)),
        seconda_dose_baby:              _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? e?.seconda_dose : 0)),
        pregressa_infezione:            _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? 0 : e?.pregressa_infezione)),
        pregressa_infezione_baby:       _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? e?.pregressa_infezione : 0)),
        dose_addizionale_booster:       _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? 0 : e?.dose_addizionale_booster)),
        dose_addizionale_booster_baby:  _.sum(dataVaxSomLatest?.map((e) => e?.fascia_anagrafica === '05-11' ? e?.dose_addizionale_booster : 0)),
        prima_dose_janssen:         _.sum(
                                        dataVaxSomLatest
                                        ?.filter((e) => e.fornitore === "Janssen" && e?.fascia_anagrafica !== '05-11')
                                        .map((e) => e?.prima_dose)
                                    ),
        prima_dose_janssen_baby:         _.sum(
                                        dataVaxSomLatest
                                        ?.filter((e) => e.fornitore === "Janssen" && e?.fascia_anagrafica === '05-11')
                                        .map((e) => e?.prima_dose)
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

    const groups = _.groupBy(dataSupplier, "fornitore");
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
                    .groupBy("fascia_anagrafica")
                    .map((rows, age) => {
                        const dosi_somministrate = _.sumBy(
                            rows,
                            (r) => r.sesso_maschile + r.sesso_femminile
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
                sesso_femminile: _.sumBy(items, "sesso_femminile"),
                sesso_maschile: _.sumBy(items, "sesso_maschile"),
                dosi_consegnate: details.dosi_consegnate || 0,
                dosi_somministrate: details.dosi_somministrate || 0,
                percentuale_somministrazione: details.percentuale_somministrazione || 0,
            };
        })
        .value();

    const totalDeliverySummaryByAge = _(data.dataSommVaxDetail.data.map(replaceArea))
        .groupBy((i) => i["fascia_anagrafica"].toString().trim())
        .map((rows, age) => {
            const details = _(rows)
            .groupBy("code")
            .map((rowsData, code) => {
                const dosi_somministrate = _.sumBy(
                    rowsData,
                    (r) => r.sesso_maschile + r.sesso_femminile
                );
                const percentage =
                    dosi_somministrate /
                    (_.head(deliveredByArea[code]).dosi_consegnate || 1);
                return {
                    age: age,
                    dosi_somministrate,
                    sesso_maschile: _.sumBy(rowsData, "sesso_maschile"),
                    sesso_femminile: _.sumBy(rowsData, "sesso_femminile"),
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
    let dosesAgesColor = {
        "Dose addizionale/booster": "#012675",
        "2ª dose/unica dose": "#196ac6",
        "1ª dose": "#519ae8",
        "Totale fascia": "#b6d5f4"
    };

    let regionsDoses = {};
    let dosesAges = ["Dose addizionale/booster", "2ª dose/unica dose", "1ª dose", "Totale fascia"];
    let dosesAgesData = [];
    let dosesAgesRegionData = {};

    let agesTmp = {};
    for (let row of data.dataSommVaxDetail.data) {
        var key = row.fascia_anagrafica;

        if (key === '80-89' || key === '90+') {
            key = 'over 80'
        }
        if (key === '5-11') {
            key = '05-11'
        }

        if (!agesTmp.hasOwnProperty(key)) {
            agesTmp[key] = {
                "Totale fascia": 0,
                "1ª dose": 0,
                "2ª dose/unica dose": 0,
                "Dose addizionale/booster": 0
            };
        }

        if (row.fornitore === 'Janssen') {
            agesTmp[key]["2ª dose/unica dose"] += row.prima_dose;
        }
        else {
            agesTmp[key]["1ª dose"] += row.prima_dose;
            agesTmp[key]["2ª dose/unica dose"] += row.seconda_dose;
        }
        if (row.hasOwnProperty('pregressa_infezione')) {
            agesTmp[key]["2ª dose/unica dose"] += row.pregressa_infezione;
        }

        if (row.hasOwnProperty('dose_addizionale_booster')) {
            agesTmp[key]["Dose addizionale/booster"]+= row.dose_addizionale_booster;
        }

        /* regions data */
        if (!regionsDoses.hasOwnProperty(row.area)) {
            regionsDoses[row.area] = {};
            regionsDoses[row.area][key] = {
                "Totale fascia": 0,
                "1ª dose": 0,
                "2ª dose/unica dose": 0,
                "Dose addizionale/booster": 0
            };
        }
        else {
            if (!regionsDoses[row.area].hasOwnProperty(key)) {
                regionsDoses[row.area][key] = {
                    "Totale fascia": 0,
                    "1ª dose": 0,
                    "2ª dose/unica dose": 0,
                    "Dose addizionale/booster": 0
                };
            }
        }
        if (row.fornitore === 'Janssen') {
            regionsDoses[row.area][key]["2ª dose/unica dose"] += row.prima_dose;
        }
        else {
            regionsDoses[row.area][key]["1ª dose"] += row.prima_dose;
            regionsDoses[row.area][key]["2ª dose/unica dose"] += row.seconda_dose;
        }
        if (row.hasOwnProperty('pregressa_infezione')) {
            regionsDoses[row.area][key]["2ª dose/unica dose"] += row.pregressa_infezione;
        }

        if (row.hasOwnProperty('dose_addizionale_booster')) {
            regionsDoses[row.area][key]["Dose addizionale/booster"] += row.dose_addizionale_booster;
        }
    }

    let ageDosesTotal = {};

    for (let row of Object.keys(agesTmp).sort().reverse()) {
        var entry = {
            label: "Fascia " + row
        };
        entry["Dose addizionale/booster"] = agesTmp[row]["Dose addizionale/booster"];
        entry["2ª dose/unica dose"] = agesTmp[row]["2ª dose/unica dose"] - agesTmp[row]["Dose addizionale/booster"];
        entry["1ª dose"] = agesTmp[row]["1ª dose"] - agesTmp[row]["2ª dose/unica dose"];

        entry["Totale platea"] = 0;
        for (let platea of data.dataPlatea.data) {
            if (platea.fascia_anagrafica === row || (row === 'over 80' && platea.fascia_anagrafica === '80+') || (row === '05-11' && platea.fascia_anagrafica === '05-11')) {
                entry["Totale platea"] += parseInt(platea.totale_popolazione);
            }
        }

        entry["Totale fascia"] = entry["Totale platea"] - entry["1ª dose"] - entry["2ª dose/unica dose"] - entry["Dose addizionale/booster"];

        ageDosesTotal[entry['label']] = entry["1ª dose"] + entry["2ª dose/unica dose"] + entry["Dose addizionale/booster"];

        dosesAgesData.push(entry);
    }

    let totalGuariti = 0;
    let totalGuaritiBaby = 0;
    for (let row of data.dataGuariti.data) {
        if (row.fascia_anagrafica === '05-11') {
            totalGuaritiBaby += parseInt(row.totale_guariti);
        }
        else {
            totalGuariti += parseInt(row.totale_guariti);
        }
    }

    let totalPlatea = 0;
    let totalPlateaBaby = 0;
    for (let platea of data.dataPlatea.data) {
        if (platea.fascia_anagrafica === '05-11') {
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

        var secondDoseTmp = row.seconda_dose;
        if (row.fornitore === 'Janssen') {
            secondDoseTmp = row.prima_dose;
        }
        if (row.hasOwnProperty('pregressa_infezione')) {
            secondDoseTmp += row.pregressa_infezione;
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
                entry[keyAge] += (rowAge === row.fascia_anagrafica || (rowAge === '05-11' && row.fascia_anagrafica === '05-11') || (rowAge === 'over 80' && (row.fascia_anagrafica === '90+' || row.fascia_anagrafica === '80-89'))) ? secondDoseTmp : 0;
            }
            else {
                entry[keyAge] = (rowAge === row.fascia_anagrafica || (rowAge === '05-11' && row.fascia_anagrafica === '05-11') || (rowAge === 'over 80' && (row.fascia_anagrafica === '90+' || row.fascia_anagrafica === '80-89'))) ? secondDoseTmp : 0;
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

        let keyAge = platea.fascia_anagrafica === '80+' ? 'fascia_over_80' : (platea.fascia_anagrafica === '05-11' ? 'fascia_05-11' : 'fascia_' + platea.fascia_anagrafica);
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
            entry["Dose addizionale/booster"] = regionsDoses[region][row]["Dose addizionale/booster"];
            entry["2ª dose/unica dose"] = regionsDoses[region][row]["2ª dose/unica dose"] - regionsDoses[region][row]["Dose addizionale/booster"];
            entry["1ª dose"] = regionsDoses[region][row]["1ª dose"] - regionsDoses[region][row]["2ª dose/unica dose"];

            entry["Totale platea"] = 0;
            for (let platea of data.dataPlatea.data) {
                if (platea.area === region && (platea.fascia_anagrafica === row || (platea.fascia_anagrafica === '05-11' && row === '05-11') || (row === 'over 80' && platea.fascia_anagrafica === '80+'))) {
                    entry["Totale platea"] += parseInt(platea.totale_popolazione);
                }
            }

            entry["Totale fascia"] = entry["Totale platea"] - entry["1ª dose"] - entry["2ª dose/unica dose"] - entry["Dose addizionale/booster"];

            arrayTmp.push(entry);
        }

        dosesAgesRegionData[region] = arrayTmp;
    }

    // guariti
    let healed = {}
    for (let row of data.dataGuariti.data) {
        entry = {};
        if (healed.hasOwnProperty(row.area)) {
            entry = healed[row.area];
        }

        if (!healed.hasOwnProperty(row.area)) {
            entry = {
                'code': row.area,
                'area': areaMapping[row.area],
                'guariti': row.totale_guariti
            };
        }
        else {
            entry['guariti'] += row.totale_guariti;
        }

        for (let rowAge of Object.keys(agesTmp)) {
            let keyAge = rowAge === 'over 80' ? 'fascia_over_80' : (rowAge === '05-11' ? 'fascia_05-11' : 'fascia_' + rowAge);
            if (entry.hasOwnProperty(keyAge)) {
                entry[keyAge] += (rowAge === row.fascia_anagrafica || (rowAge === '05-11' && row.fascia_anagrafica === '05-11') || (rowAge === 'over 80' && (row.fascia_anagrafica === '80+' || row.fascia_anagrafica === '90+' || row.fascia_anagrafica === '80-89'))) ? row.totale_guariti : 0;
            }
            else {
                entry[keyAge] = (rowAge === row.fascia_anagrafica || (rowAge === '05-11' && row.fascia_anagrafica === '05-11') || (rowAge === 'over 80' && (row.fascia_anagrafica === '80+' || row.fascia_anagrafica === '90+' || row.fascia_anagrafica === '80-89'))) ? row.totale_guariti : 0;
            }
        }
        healed[row.area] = entry;
    }

    let healedPlateaData = [];
    for (let region of Object.keys(healed)) {
        let tmpElem = healed[region];

        let entry = {};
        for (let subItem of Object.keys(tmpElem)) {
            entry[subItem] = tmpElem[subItem];
        }

        healedPlateaData.push(entry);
    }

    let healedData = [];
    for (let region of Object.keys(healed)) {
        healedData.push(healed[region]);
    }

    let haeledAgesTmp = {};
    let haeledAgesData = [];
    let regionHaeledAgesData = [];
    let regionHaeledAgesDataTmp = {};

    for (let row of data.dataGuariti.data) {
        var keyAge = row.fascia_anagrafica;

        if (keyAge === '80+' || keyAge === '80-89' || keyAge === '90+') {
            keyAge = 'over 80'
        }
        if (keyAge === '05-11') {
            keyAge = '05-11'
        }

        if (!haeledAgesTmp.hasOwnProperty(keyAge)) {
            haeledAgesTmp[keyAge] = row.totale_guariti;
        }
        else {
            haeledAgesTmp[keyAge] += row.totale_guariti;
        }

        // regions data
        if (!regionHaeledAgesDataTmp.hasOwnProperty(row.area)) {
            regionHaeledAgesDataTmp[row.area] = {};
            regionHaeledAgesDataTmp[row.area][keyAge] = row.totale_guariti;;
        }
        else {
            if (!regionHaeledAgesDataTmp[row.area].hasOwnProperty(keyAge)) {
                regionHaeledAgesDataTmp[row.area][keyAge] = row.totale_guariti;
            }
            else {
                regionHaeledAgesDataTmp[row.area][keyAge] += row.totale_guariti;
            }
        }
    }

    for (let row of Object.keys(haeledAgesTmp).sort().reverse()) {
        var entryHealedAges = {
            label: "Fascia " + row
        };
        entryHealedAges["guariti"] = haeledAgesTmp[row];

        haeledAgesData.push(entryHealedAges);
    }

    for (let region of Object.keys(regionHaeledAgesDataTmp).sort().reverse()) {
        for (let row of Object.keys(regionHaeledAgesDataTmp[region]).sort().reverse()) {
            var entryRegionHealed = {
                label: "Fascia " + row
            };
            entryRegionHealed["guariti"] = regionHaeledAgesDataTmp[region][row];

            if (!regionHaeledAgesData.hasOwnProperty(region)) {
                regionHaeledAgesData[region] = [entryRegionHealed];
            }
            else {
                regionHaeledAgesData[region].push(entryRegionHealed);
            }
        }
    }

    // suppliers
    let spectrum = ["#0f69c9", "#4d99eb", "#77b2f2", "#b5d4f5", "#d1e0f0", "#edf2f7", "#ffffff"];
    let suppliersColor = {};
    let suppliers = [];

    for (let row of data.dataSommVaxDetail.data) {
        if (!suppliers.includes(row.fornitore)) {
            suppliers.push(row.fornitore);
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
        let index = weeksMappingOptimation[Moment(new Date(row.data_somministrazione)).format('YYYY-MM-DD')];
        let week = suppliersWeek[index];

        // Totale Somministrazioni Settimanale
        week.total += (
            row.prima_dose +
            row.seconda_dose +
            row.pregressa_infezione +
            row.dose_addizionale_booster
        );

        // Totale Somministrazioni Settimanale per fornitore
        week[row.fornitore] += (
            row.prima_dose +
            row.seconda_dose +
            row.pregressa_infezione +
            row.dose_addizionale_booster
        );
    }

    let totalPlateaDoseAddizionaleBooster = 0;
    for (let platea of data.dataPlateaDoseAddizionaleBooster.data) {
        totalPlateaDoseAddizionaleBooster += parseInt(platea.totale_popolazione);
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
        dosesAges,
        dosesAgesColor,
        dosesAgesData,
        dosesAgesRegionData,
        ageDosesTotal,
        secondDosesData,
        secondDosesPlateaData,
        totalPlatea,
        totalPlateaBaby,
        totalPlateaDoseAddizionaleBooster,
        totalGuariti,
        totalGuaritiBaby,
        healedData,
        healedPlateaData,
        haeledAgesData,
        regionHaeledAgesData
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
            dataGuariti
        })
    };
};
