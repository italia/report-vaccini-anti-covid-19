import React, { useEffect, useState } from "react";
import { isEmpty, max } from "lodash";
import { AgeHStackedBarChart } from "../components/AgeHStackedBarChart";
import { MapArea } from "./../components/MapArea";

export const AgeDoses = ({ data }) => {
    const [dosesAgesColor, setdosesAgesColor] = useState([]);
    const [dosesAges, setdosesAges] = useState([]);
    const [dosesAgesData, setDosesAgesData] = useState([]);

    const [categoryMapData, setCategoryMapData] = useState([]);
    const [dosesMapData, setDosesMapData] = useState([]);
    const [categoryMapField, setCategoryMapField] = useState("somministrazioni");

    const [categorySelectedRegion, setCategorySelectedRegion] = useState(null);
    const [categorySelectedRegionDescr, setCategorySelectedRegionDescr] = useState(null);
    const [selectedCodeAge, setSelectedCodeAge] = useState(null);

    const [totalByCategory, setTotalByCategory] = useState(0);

    useEffect(() => {
        if (!isEmpty(data)) {
            setdosesAgesColor(data.dosesAgesColor);
            setdosesAges(data.dosesAges);
            setDosesAgesData(data.dosesAgesData);

            setTotalByCategory(data.tot);
            setCategoryMapData(data.secondDosesIstatData);
            setDosesMapData(data.secondDosesData);
        }
    }, [data]);

    const resetFilter = () => {
        setSelectedCodeAge(null);
        setCategorySelectedRegion(null);
        setCategorySelectedRegionDescr(null);
        setTotalByCategory(data.tot);
        setDosesAgesData(data.dosesAgesData);
        setCategoryMapField("somministrazioni");
        setCategoryMapData(data.secondDosesIstatData);
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

    const handleMapCategoryClick = (region) => {
        if (selectedCodeAge) {
          resetFilter();
        }

        if (categorySelectedRegion === region.code) {
          resetFilter();
        } else {
          setCategorySelectedRegion(region.code);
          setCategorySelectedRegionDescr(region.area);
          setDosesAgesData(data.dosesAgesRegionData[region.code])

          for(let row of data?.totalDeliverySummary) {
            if (row.code === region.code) {
                setTotalByCategory(row.dosi_somministrate);
            }
          }
        }
    };

    const handleCategoryBarChartClick = (cat) => {
        if (categorySelectedRegion) {
          resetFilter();
        }

        const ageCode = cat.data.label.toLowerCase().replaceAll(' ', '_');

        if (selectedCodeAge === ageCode) {
          resetFilter();
        } else {
          setSelectedCodeAge(ageCode);
          setCategoryMapField(ageCode);
          setTotalByCategory(data.ageDosesTotal[cat.data.label]);
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
                <div style={{textAlign: 'center'}}>
                    <h3 className="text-center">Somministrazioni per fascia d'età - dose</h3>
                    <p>(Dati Popolazione su base Istat aggiornati al gennaio 2021)</p>
                </div>
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
            <div className="col-12 col-md-6 h-100" style={{marginTop: 80}}>
                <AgeHStackedBarChart
                    xtitle="Somministrazione settimanale"
                    width={+350}
                    height={+300}
                    property={{ xprop: "label", yprop: "total" }}
                    handleRectClick={handleCategoryBarChartClick}
                    regionSelected={categorySelectedRegionDescr}
                    selectedCodeAge={selectedCodeAge}
                    colors={dosesAgesColor}
                    keys={dosesAges}
                    data={dosesAgesData}
                />

                <div className="row" style={{marginBottom: 40, marginLeft: 40}}>
                    {dosesAges.map((dose) => {
                        return (
                            <div className="row" key={dose}>
                                <div className="circle" style={{ backgroundColor: dosesAgesColor[dose] }}></div>
                                <span className="legend" style={{color: '#19191a', marginRight: 25}}>{dose}</span>
                            </div>
                        )
                    })}
                </div>

                <p className="d-block d-sm-none text-center">*Tieni premuto sulle barre del grafico per visualizzare i dati sulle dosi somministrate</p>
                <p className="d-none d-sm-block text-center">*Passa con il mouse sulle barre del grafico per visualizzare i dati sulle dosi somministrate</p>

            </div>
            <div className="col-12 col-md-6 h-100" style={{ overflow: "hidden" }}>
                <div className="p-4 position-relative d-lg-none">
                <div className="w-100 h-100 d-flex justify-content-start pr-5">
                    <img src="logo.png" width="35" height="35" alt="Logo" />
                    <h5 className="pl-3 pl-sm-1">
                    Percentuale vaccinati
                    <br /> per regione
                    </h5>
                </div>
                </div>

                <MapArea
                    fillMapDeliveryArea={fillMapCategoryArea}
                    summary={categoryMapData}
                    handleMapDeliveryClick={handleMapCategoryClick}
                    fillBy={categoryMapField}
                    percentage={true}
                    tooltip={(r) => {
                            var region = null;
                            for(let row of dosesMapData) {
                                if (row.code === r.code) {
                                    region = row;
                                }
                            }

                            return (
                                r.area +
                                " " +
                                (r[categoryMapField] && r[categoryMapField].toFixed(2).toLocaleString("it") + "%") +
                                " " +
                                (region && region[categoryMapField] && "(" + region[categoryMapField].toLocaleString("it") + ")")
                            )
                        }
                    }
                    className="ml-5 w-100 h-100"
                />

                <div className="p-4 position-relative d-none d-lg-block" style={{ left: "300px", top: "-390px" }}>
                    <div className="w-100 h-100 d-flex justify-content-start pr-5">
                        <img src="logo.png" width="35" height="35" alt="Logo" />
                        <h5 className="pl-3 pl-sm-1">
                            Percentuale vaccinati
                            <br /> per regione
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )
};