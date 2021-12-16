import React, { useEffect, useState } from "react";
import { isEmpty, max } from "lodash";
import { BarChart } from "../components/BarChart";
import { MapArea } from "../components/MapArea";

export const Healed = ({ data }) => {

    const [categoryMapData, setCategoryMapData] = useState([]);
    const [categoryMapField, setCategoryMapField] = useState("guariti");
    const [totalGuariti, setTotalGuariti] = useState(0);
    const [healedMapData, setHealedMapData] = useState([]);


    const [haeledAgesData, setHaeledAgesData] = useState([]);

    const [selectedCodeAge, setSelectedCodeAge] = useState(null);
    const [selectedCodeRegion, setSelectedCodeRegion] = useState(null);

    useEffect(() => {
        if (!isEmpty(data)) {
            setHaeledAgesData(data.haeledAgesData);
            setHealedMapData(data.healedData);
            setTotalGuariti(data.totalGuariti + data.totalGuaritiBaby);
            setCategoryMapData(data.healedPlateaData);
        }
    }, [data]);

    const resetFilter = () => {
        setSelectedCodeAge(null);
        setSelectedCodeRegion(null);

        setHaeledAgesData(data.haeledAgesData);

        setCategoryMapField("guariti");
        setTotalGuariti(data.totalGuariti + data.totalGuaritiBaby);
        setCategoryMapData(data.healedPlateaData);
    };

    const fillMapCategoryArea = ({ region, maxValue, field }) => {
        let scaleOp = 0;
        if (region.code === selectedCodeRegion) {
            scaleOp = 1;
        } else if (!selectedCodeRegion) {
            scaleOp = max([region[field] / maxValue, 0.1]);
        } else {
            const valueToFill = region[field] / (2 * maxValue);
            scaleOp = max([valueToFill, 0.1]);
        }
        return `rgba(0,102,204,${scaleOp}) `;
    };

    const handleMapClick = (region) => {
        if (selectedCodeAge) {
            resetFilter();
        }

        if (selectedCodeRegion === region.code) {
            resetFilter();
        } else {
            setSelectedCodeRegion(region.code);
            setHaeledAgesData(data.regionHaeledAgesData[region.code]);

            for(let row of data?.healedData) {
                if (row.code === region.code) {
                    setTotalGuariti(row.guariti);
                }
            }
        }
    };

    const handleAgeBarChartClick = (cat) => {
        if (selectedCodeRegion) {
            resetFilter();
        }

        const ageCode = cat.label.toLowerCase().replaceAll(' ', '_');

        if (selectedCodeAge === ageCode) {
            resetFilter();
        } else {
            setSelectedCodeAge(ageCode);
            setCategoryMapField(ageCode);

            for(let row of data?.haeledAgesData) {
                const tmp = row.label.toLowerCase().replaceAll(' ', '_');
                if (tmp === ageCode) {
                    setTotalGuariti(row.guariti);
                }
            }
        }
    };

    return (
        <div className="row ">
            {/* Box Title */}
            <div style={{ marginTop: 40 }} className="col-12 d-flex justify-content-center align-items-center p-5 bg-title-plot">
                <div style={{textAlign: 'center'}}>
                    <h3 className="text-center">Platea guariti da al massimo sei mesi</h3>
                </div>
            </div>
            {/* // Box Title */}

            <div className="col-12 col-md-12 h-100 m-3 ">
                {/* Total Box - Mobile View */}
                <div className="m-3  d-lg-none" style={{ position: "relative", background: "#013366" }}>
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-flex text-center" style={{ position: "absolute", left:-40, top:-25}}/>
                    <div className="text-white w-100 ">
                        <div className="w-100  h-100 d-flex justify-content-center pt-5">
                            <h5>Totale guariti</h5>
                        </div>
                        <div className="w-100  h-100 d-flex justify-content-center">
                            <p className="numeri_box">
                                {totalGuariti && totalGuariti.toLocaleString("it")}
                            </p>
                        </div>
                        <div className="col-12 d-flex justify-content-end  pb-2">
                            <img alt="reset-plot2" src="reset_white.png" onClick={resetFilter} height={35}/>
                        </div>
                    </div>
                </div>
                {/* // Total Box - Mobile View */}

                {/* Total Box - Desktop View */}
                <div className="col-3 col-md-3  d-none d-lg-block" style={{ height: 100 }} >
                    <div style={{ position: "relative", background: "#17324D", top: -55, left: 40 }} >
                        <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-none d-md-block d-lg-block" style={{ zIndex: 10, position: 'absolute', right: -50, top: -25 }} />
                        <div className="text-white w-100">
                            <div className="w-100  h-100 d-flex justify-content-start pt-3 pl-4">
                                <h5>Totale<br></br>guariti</h5>
                            </div>
                            <div className="w-100  h-100 d-flex justify-content-start pl-4">
                                <p className="numeri_box">
                                    {totalGuariti && totalGuariti.toLocaleString("it")}
                                </p>
                            </div>
                            <div className="col-12 d-flex justify-content-end  pb-2">
                                <img alt="Reset" src="reset_white.png" onClick={resetFilter} height={35} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* // Total Box - Desktop View */}
            </div>
            <div className="col-12 col-md-6 h-100" style={{marginTop: 50}}>

                {/* Graph */}
                <BarChart
                    title=""
                    xtitle="Fascia d'età"
                    ytitle=""
                    handleRectClick={handleAgeBarChartClick}
                    width={+350}
                    height={+300}
                    selectedCodeAge={selectedCodeAge}
                    data={haeledAgesData}
                />
                {/* // Graph */}
            </div>
            <div className="col-12 col-md-6 h-100" style={{ overflow: "hidden" }}>
                {/* Map Graph */}
                <MapArea
                    fillMapDeliveryArea={fillMapCategoryArea}
                    summary={categoryMapData}
                    handleMapDeliveryClick={handleMapClick}
                    fillBy={categoryMapField}
                    percentage={false}
                    tooltip={(r) => {
                            var region = null;
                            for(let row of healedMapData) {
                                if (row.code === r.code) {
                                    region = row;
                                }
                            }

                            return (
                                r.area +
                                " " +
                                (region && region[categoryMapField] && "(" + region[categoryMapField].toLocaleString("it") + ")")
                            )
                        }
                    }
                    className="ml-5 w-100 h-100"
                />
                {/* // Map Graph */}

                <p className="d-none d-sm-block text-center">*Seleziona la Regione/Provincia Autonoma per visualizzare il dettaglio.</p>
            </div>
        </div>
    )
};