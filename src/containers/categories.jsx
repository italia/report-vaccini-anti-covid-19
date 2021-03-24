import React, { useEffect, useState } from "react";
import { find, max, isEmpty } from "lodash";
import { HBarChart } from "./../components/HBarChart";
import { MapArea } from "./../components/MapArea";

export const Categories = ({ data }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryMapData, setCategoryMapData] = useState([]);
  const [selectedCodeCategory, setSelectedCodeCategory] = useState(null);
  const [totalByCategory, setTotalByCategory] = useState(0);
  const [categoryMapField, setCategoryMapField] = useState(
    "dosi_somministrate"
  );
  const [categorySelectedRegion, setCategorySelectedRegion] = useState(null);

  useEffect(() => {
    if (!isEmpty(data)) {
      setCategoryData(data.categories);
      setTotalByCategory(data.tot);
      setCategoryMapData(data?.totalDeliverySummary);
    }
  }, [data]);

  const resetFilter = () => {
    setCategorySelectedRegion(null);
    setCategoryData(data?.categories);
    setTotalByCategory(data?.tot);
    setCategoryMapData(data?.totalDeliverySummary);
    setSelectedCodeCategory(null);
    setCategoryMapField("dosi_somministrate");
  };

  const handleMapCategoryClick = (region) => {
    /* if (selectedCodeCategory) {
      resetFilter();
    }

    if (categorySelectedRegion === region.code) {
      resetFilter();
    } else {
      setCategorySelectedRegion(region.code);
      setCategoryData(data.categoriesByRegions[region.code]);
      setTotalByCategory(region.dosi_somministrate);
    } */
  };

  const fillMapCategoryArea = ({ region, maxValue, field }) => {
    let scaleOp = 0;
    if (region.code === categorySelectedRegion) {
      scaleOp = 1;
    } else if (!categorySelectedRegion) {
      scaleOp = max([region[field] / maxValue, 0.1]);
    } else {
      const valueToFill = region[field] / (2 * maxValue);
      scaleOp = max([valueToFill, 0.1]);
    }
    return `rgba(0,102,204,${scaleOp}) `;
  };

  const handleCategoryBarChartClick = (cat) => {
    if (categorySelectedRegion) {
      resetFilter();
    }

    if (selectedCodeCategory === cat?.code) {
      resetFilter();
    } else if (cat) {
      const details = find(data.categories, (i) => i.code === cat.code);
      setSelectedCodeCategory(cat.code);
      setCategoryMapField(cat.code);
      setTotalByCategory(details?.total);
    }
  };

  return (
    <div className="row ">
      <div
        style={{ marginTop: 40 }}
        className="col-12  d-flex justify-content-center align-items-center p-5 bg-title-plot"
      >
        <img
          src="logo.png"
          width="86"
          height="86"
          alt="Logo"
          className="img-fluid"
          style={{ zIndex: 10 }}
        />
        <h3 className="text-center">Somministrazioni per categoria</h3>
      </div>
      <div className="col-12 col-md-12 h-100  ">
        <div
          className="mb-5  d-lg-none "
          style={{
            position: "relative",
            background: "#013366",
          }}
        >
          <div className="text-white w-100">
            <div className="w-100  h-100 d-flex justify-content-start pt-5 pl-4">
              <h5>
                Totale<br></br>somministrazioni
              </h5>
            </div>
            <div className="w-100  h-100 d-flex justify-content-start pl-4">
              <p className="numeri_box">
                {totalByCategory && totalByCategory.toLocaleString("it")}
              </p>
            </div>
            <div className="col-12 d-flex justify-content-end  pb-2">
              <img
                alt="reset-plot2"
                src="reset_white.png"
                onClick={resetFilter}
                height={35}
              />
            </div>
          </div>
        </div>
        <div
          className="col-3 col-md-3  d-none d-lg-block"
          style={{ height: 100 }}
        >
          <div
            style={{
              position: "relative",
              background: "#17324D",
              top: -90,
              left: 105,
            }}
          >
            <div className="text-white w-100">
              <div className="w-100  h-100 d-flex justify-content-start pt-3 pl-4">
                <h5>
                  Totale<br></br>somministrazioni
                </h5>
              </div>
              <div className="w-100  h-100 d-flex justify-content-start pl-4">
                <p className="numeri_box">
                  {totalByCategory && totalByCategory.toLocaleString("it")}
                </p>
              </div>
              <div className="col-12 d-flex justify-content-end  pb-2">
                <img
                  alt="Reset"
                  src="reset_white.png"
                  onClick={resetFilter}
                  height={35}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 h-100">
        <HBarChart
          title=""
          xtitle="Vaccinazioni per categoria"
          handleRectClick={handleCategoryBarChartClick}
          ytitle=""
          width={+220}
          height={+260}
          property={{ xprop: "name", yprop: "total" }}
          data={categoryData}
          selectedCodeCategory={selectedCodeCategory}
        />
      </div>
      <div className="col-12 col-md-6 h-100" style={{ overflow: "hidden" }}>
        <div className="p-4 position-relative d-lg-none">
          <div className="w-100 h-100 d-flex justify-content-start pr-5">
            <img src="logo.png" width="35" height="35" alt="Logo" />
            <h5 className="pl-3 pl-sm-1">
              Vaccinazioni
              <br /> per regione
            </h5>
          </div>
        </div>
        <div
          className="p-4 position-relative d-none d-lg-block"
          style={{ left: "300px", top: "190px" }}
        >
          <div className="w-100 h-100 d-flex justify-content-start pr-5">
            <img src="logo.png" width="35" height="35" alt="Logo" />
            <h5 className="pl-3 pl-sm-1">
              Somministrazioni
              <br /> per regione
            </h5>
          </div>
        </div>
        <MapArea
          fillMapDeliveryArea={fillMapCategoryArea}
          summary={categoryMapData}
          handleMapDeliveryClick={handleMapCategoryClick}
          fillBy={categoryMapField}
          tooltip={(r) =>
            r.area +
            " " +
            (r[categoryMapField] && r[categoryMapField].toLocaleString("it"))
          }
          className="ml-5 w-100 h-100"
        />
      </div>
    </div>
  );
};
