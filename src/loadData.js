import { sumDoseX, filterByAreaITA, replaceArea, aggrBy, areaMapping } from "./utils";
import _ from 'lodash';
const baseURL =
  "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati";

const sommVaxSummaryURL = `${baseURL}/somministrazioni-vaccini-summary-latest.json`;
const sommVaxDetailURL = `${baseURL}/somministrazioni-vaccini-latest.json`;
const deliveryVaxDetailURL = `${baseURL}/consegne-vaccini-latest.json`;
const vaxSummaryURL = `${baseURL}/vaccini-summary-latest.json`;
const vaxLocationsURL = `${baseURL}/punti-somministrazione-latest.json`;

const anagraficaSummaryURL = `${baseURL}/anagrafica-vaccini-summary-latest.json`;
const puntiSommSummaryURL = `${baseURL}/punti-somministrazione-latest.json`;
const lastUpdateURL = `${baseURL}/last-update-dataset.json`;
const supplierDoses = `${baseURL}/consegne-vaccini-latest.json`;

const elaborate = (data) => {

  const tot = data.dataSommVaxSummary.data
    .filter(filterByAreaITA)
    .reduce(sumDoseX("totale"), 0);
  // datatable and map
  const dataSupplier = data.dataSupplierDoses.data;
  const dataSomeVaxDetail = data.dataSommVaxDetail.data.map(replaceArea);

  const deliverySummary = data.dataVaxSummary.data.map(replaceArea);
  // categories and ages summary
  const categoriesAndAges = data.dataProfileSummary.data;
  const categories = [
    {
      name: "Operatori Sanitari e Sociosanitari",
      code: "cat_oss",
      total: categoriesAndAges.reduce(
        sumDoseX("categoria_operatori_sanitari_sociosanitari"),
        0
      ),
    },
    {
      name: "Personale non sanitario",
      code: "cat_pns",
      total: categoriesAndAges.reduce(
        sumDoseX("categoria_personale_non_sanitario"),
        0
      ),
    },
    {
      name: "Ospiti Strutture Residenziali",
      code: "cat_rsa",
      total: categoriesAndAges.reduce(sumDoseX("categoria_ospiti_rsa"), 0),
    }
  ];
  const categoriesByRegionRAW = data.dataSommVaxSummary.data.reduce(
    aggrBy("area"),
    {}
  );
  const groups = _.groupBy(dataSupplier, 'fornitore');

  let allDosesSupplier = Object.keys(groups).map(k => {
    let groupByKey = groups[k].map(group => group.numero_dosi);
    let sumTotalDoses = _.sum(groupByKey);  
    return { totale: sumTotalDoses, fornitore: k, allDoses: groups[k] }
  })
  
  let totalSuplier =_.sum(allDosesSupplier.map(e=>e?.totale));

  let allDosesMapByArea = _.groupBy(dataSupplier, 'area');
  let doesesByArea = Object.keys(allDosesMapByArea).map(area => {

    let groupByArea = allDosesMapByArea[area].map((dose) => dose.numero_dosi);
    let totalDosesByArea = _.sum(groupByArea);
    return { area: areaMapping[area], dosi_somministrate: totalDosesByArea }
  })
  let categoriesByRegions = {};
  Object.keys(categoriesByRegionRAW).map((x) => {
    categoriesByRegions[x] = [
      {
        name: "Operatori Sanitari e Sociosanitari",
        code: "cat_oss",
        total: categoriesByRegionRAW[x].reduce(
          sumDoseX("categoria_operatori_sanitari_sociosanitari"),
          0
        ),
      },
      {
        name: "Personale non sanitario",
        code: "cat_pns",
        total: categoriesByRegionRAW[x].reduce(
          sumDoseX("categoria_personale_non_sanitario"),
          0
        ),
      },
      {
        name: "Ospiti Strutture Residenziali",
        code: "cat_rsa",
        total: categoriesByRegionRAW[x].reduce(
          sumDoseX("categoria_ospiti_rsa"),
          0
        ),
      }
    ];
    return categoriesByRegions;
  });

  deliverySummary.forEach(ds => {
    ds['byCategory'] = categoriesByRegions[ds.code].reduce(
      aggrBy("code"),
      {}
    )
  })

  const locations = data.dataVaxLocations.data.map(replaceArea);

  let maxNumberOfLocations = 0

  const locationsByRegion = _(data.dataVaxLocations.data.map(replaceArea))
    .groupBy('area')
    .map((items, area) => {
      maxNumberOfLocations = maxNumberOfLocations > items.length ? maxNumberOfLocations : items.length;
      return { area: area, locations: items.length }
    }).value()
    ;

  const gender = {
    gen_m: categoriesAndAges.reduce(sumDoseX("sesso_maschile"), 0),
    gen_f: categoriesAndAges.reduce(sumDoseX("sesso_femminile"), 0),
  };

  const timestamp = data.dataLastUpdate.ultimo_aggiornamento;
  const aggr = {
    timestamp,
    tot,
    deliverySummary,
    categoriesAndAges,
    categories,
    categoriesByRegions,
    locations,
    gender,
    dataSomeVaxDetail,
    locationsByRegion,
    maxNumberOfLocations,
    allDosesSupplier,
    doesesByArea,
    totalSuplier
  };
  return aggr;
};

export const loadData = async () => {
  const resSommVaxSummary = await fetch(sommVaxSummaryURL);
  const resSommVaxDetail = await fetch(sommVaxDetailURL);
  const resDeliveryVaxDetail = await fetch(deliveryVaxDetailURL);
  const resVaxSummary = await fetch(vaxSummaryURL);
  const resProfileSummaryURL = await fetch(anagraficaSummaryURL);
  const resPointsSommSummaryURL = await fetch(puntiSommSummaryURL);
  const resVaxLocations = await fetch(vaxLocationsURL);
  const resLastUpdate = await fetch(lastUpdateURL);
  const resSupplierDoses = await fetch(supplierDoses);

  const dataSommVaxSummary = await resSommVaxSummary.json();
  const dataSommVaxDetail = await resSommVaxDetail.json();
  const dataDeliveryVaxDetail = await resDeliveryVaxDetail.json();
  const dataVaxSummary = await resVaxSummary.json();
  const dataProfileSummary = await resProfileSummaryURL.json();
  const dataPointsSommSummary = await resPointsSommSummaryURL.json();
  const dataVaxLocations = await resVaxLocations.json();
  const dataLastUpdate = await resLastUpdate.json();

  const dataSupplierDoses = await resSupplierDoses.json(resSupplierDoses)
  return {
    ...elaborate({
      dataSommVaxSummary,
      dataSommVaxDetail,
      dataDeliveryVaxDetail,
      dataVaxSummary,
      dataProfileSummary,
      dataPointsSommSummary,
      dataLastUpdate,
      dataVaxLocations,
      dataSupplierDoses
    }),
  };
};
