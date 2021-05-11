import React, { useEffect, useState } from "react";
import { find, head, max, isEmpty } from "lodash";
import { Table } from "./../components/Table";
import { BarChart } from "./../components/BarChart";
import { MapArea } from "./../components/MapArea";

export const Deliveries = ({ data }) => {
  const [deliveryMapData, setDeliveryMapData] = useState([]);
  const [deliveryTableData, setDeliveryTableData] = useState([]);
  const [deliverySelectedRegion, setDeliverySelectedRegion] = useState(null);
  const [totalDelivery, setTotalDelivery] = useState(0);
  const [totalAgeByGender, setTotalAgeByGender] = useState({});
  const [deliveryBarChartData, setdeliveryBarChartData] = useState([]);
  const [selectedAge, setSelectedAge] = useState(null);

  useEffect(() => {
    if (!isEmpty(data)) {
      setDeliveryMapData(data.totalDeliverySummary);
      setdeliveryBarChartData(data.categoriesAndAges);
      setTotalAgeByGender(data.gender);
      setDeliveryTableData(data.totalDeliverySummary);
      setTotalDelivery(data.tot);
    }
  }, [data]);

  const resetFilter = () => {
    setDeliverySelectedRegion(null);
    setDeliveryTableData(data.totalDeliverySummary);
    setTotalDelivery(data.tot);
    setTotalAgeByGender(data.gender);
    setdeliveryBarChartData(data.categoriesAndAges);
    setSelectedAge(null);
    setDeliveryMapData(data.totalDeliverySummary);
  };

  const fillMapDeliveryArea = ({ region, maxValue, field }) => {
    let scaleOp = 0;
    if (region.code === deliverySelectedRegion) {
      scaleOp = 1;
    } else if (!deliverySelectedRegion) {
      scaleOp = max([region[field] / maxValue, 0.1]);
    } else {
      const valueToFill = region[field] / (2 * maxValue);
      scaleOp = max([valueToFill, 0.1]);
    }
    return `rgba(0,102,204,${scaleOp}) `;
  };

  const handleMapDeliveryClick = (region) => {
    if (selectedAge) {
      resetFilter();
    }

    if (deliverySelectedRegion === region.code) {
      resetFilter();
    } else {
      const deliveryTableFilteredData = find(
        data.totalDeliverySummary,
        (d) => d.code === region.code
      );

      setDeliveryTableData([deliveryTableFilteredData]);
      setdeliveryBarChartData(deliveryTableFilteredData?.byAge || []);
      setDeliverySelectedRegion(region.code);
      setTotalDelivery(deliveryTableFilteredData.dosi_somministrate);
      setTotalAgeByGender({
        gen_m: deliveryTableFilteredData.sesso_maschile,
        gen_f: deliveryTableFilteredData.sesso_femminile,
      });
    }
  };

  const handleDeliveryBarChartClick = (bar) => {
    if (deliverySelectedRegion) {
      resetFilter();
    }

    if (bar.fascia_anagrafica === selectedAge) {
      resetFilter();
    } else {
      const details = find(
        data.categoriesAndAges,
        (i) => i.fascia_anagrafica === bar.fascia_anagrafica
      );

      setdeliveryBarChartData(data.categoriesAndAges);
      setTotalDelivery(details.totale);
      setSelectedAge(bar.fascia_anagrafica);
      setDeliveryTableData(
        head(data.totalDeliverySummaryByAge[bar.fascia_anagrafica]).details
      );
      setTotalAgeByGender({
        gen_m: bar.sesso_maschile,
        gen_f: bar.sesso_femminile,
      });
      setDeliveryMapData(
        head(data.totalDeliverySummaryByAge[bar.fascia_anagrafica]).details
      );
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-12 d-flex justify-content-end">
          <img alt="Ripristinare i filtri" src="reset.png" onClick={resetFilter} />
        </div>
      </div>

      <div className="row" style={{ backgroundColor: "#F8FBFE" }}>
        <div className="col-12 col-lg-5 h-100 order-md-2 order-lg-1 ">
          <div className="container-info d-none d-sm-none d-md-flex d-lg-flex">
            <span
              data-toggle="tooltip"
              title="% somministrazioni su dosi consegnate"
              className="circle-info"
            >
              i
            </span>
          </div>
          <Table deliveryTableData={deliveryTableData} className="mr-5 h-100" />
        </div>

        <div className="col-12 col-lg-7 order-md-1 order-lg-2">
          <div className="p-4 position-relative d-lg-none">
            <div className="w-100 h-100 d-flex justify-content-start pr-5">
              <img src="logo.png" width="35" height="35" alt="" />

              <h5 className="pl-3 pl-sm-1">
                Distribuzione somministrazioni
                <br /> rispetto alle consegne
              </h5>
            </div>
          </div>

          <div className="p-5 d-none d-lg-block">
            <div
              className="d-flex justify-content-end"
              style={{
                position: "absolute ",
                top: 150,
                right: 50,
              }}
            >
              <img
                src="logo.png"
                width="35"
                height="35"
                alt=""
                style={{
                  position: "absolute",
                  top: -10,
                }}
              />

              <h5 className="pl-3 pl-sm-1 text-right">
                <span
                  data-toggle="tooltip"
                  title="Nel grafico è rappresentato il tasso di somministrazione, 
      ovvero il rapporto tra le somministrazioni e le dosi consegnate (%)"
                  className="circle-info"
                  style={{
                    position: "relative",
                    right: 23,
                    top: 25,
                  }}
                >
                  i
                </span>
                Distribuzione somministrazioni
                <br /> rispetto alle consegne
              </h5>
            </div>
          </div>
          <MapArea
            fillMapDeliveryArea={fillMapDeliveryArea}
            summary={deliveryMapData}
            handleMapDeliveryClick={handleMapDeliveryClick}
            tooltip={(r) =>
              r.area +
              " " +
              (r.percentuale_somministrazione &&
                r.percentuale_somministrazione.toLocaleString("it")) +
              "%"
            }
            fillBy="percentuale_somministrazione"
            className="ml-5 w-100 h-100"
          />
          <div className="p-4 position-relative">
            <div className="text-black w-100">
              <div className="w-100 h-100 d-flex justify-content-start ">
                <img
                  src="logo.png"
                  width="45"
                  height="45"
                  alt="Logo"
                  className="mt-3"
                />
                <span className="font-50 pl-3">
                  {totalDelivery?.toLocaleString("it")}
                </span>
              </div>

              <div className="w-100  h-100 d-flex justify-content-start">
                <h5>Totale somministrazioni</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row position-powerbi"
        style={{ backgroundColor: "#F8FBFE" }}
      >
        <div className="col-12 col-md-6 align-items-end testo-info-campania d-none d-sm-none d-md-flex d-lg-flex"></div>
        <div className="col-12 col-md-6  position-relative">
          <div className="bg-gradient-bar"></div>
          <div className="row">
            <div className="col-6 d-flex align-items-baseline">
              <img src="user_f.png" alt="" width="75px" />
              <span className="text-center font-weight-light text-white">
                <h3 className="total_gender">
                  {totalAgeByGender?.gen_f?.toLocaleString("it")}
                </h3>
              </span>
            </div>
            <div className="col-6  d-flex align-items-baseline">
              <img src="user_m.png" alt="" width="75px" />
              <span className="text-center font-weight-light text-white">
                <h3 className="total_gender">
                  {totalAgeByGender?.gen_m?.toLocaleString("it")}
                </h3>
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-5" style={{ backgroundColor: "#17324D" }}>
          <div className="p-4 position-relative">
            <div style={{ height: 100 }}>
              <img src="group_person.svg" alt="" className="img-fluid" />
            </div>
            <div className="text-white w-100">
              <div className="w-100 h-100 d-flex justify-content-end">
                <img src="logo.png" width="40" height="40" alt="" />
              </div>
              <div className="w-100  h-100 d-flex justify-content-end text-right">
                <h3>
                  Somministrazioni<br></br> per fasce di età
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-12  col-md-7"
          style={{
            backgroundColor: "#17324D",
          }}
        >
          <BarChart
            title=""
            xtitle="Fascia d'età"
            ytitle=""
            width={800}
            handleDeliveryBarChartClick={handleDeliveryBarChartClick}
            height={300}
            selected={selectedAge}
            property={{ xprop: "fascia_anagrafica", yprop: "totale" }}
            data={deliveryBarChartData}
          />
        </div>
      </div>
    </div>
  );
};
