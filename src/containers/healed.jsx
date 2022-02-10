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
        <div className="row">
            {/* Box Title */}
            <div className="col-12 d-flex justify-content-center align-items-center section-title mx-2">
                <div className="text-center">
                    <h3 class="mb-0">Platea guariti da al massimo sei mesi</h3>
                    <h3 class="mt-0">senza alcuna somministrazione</h3>
                </div>
            </div>
            {/* // Box Title */}

            <div className="col-12 col-md-12 m-3">
                {/* Total Box - Mobile Layout */}
                <div className="d-lg-none bg-box box-mobile m-3">
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-flex text-center box-logo-left"/>
                    <div className="text-white">
                        <div className="d-flex justify-content-center pt-5">
                            <h5>Totale guariti</h5>
                        </div>
                        <div className="d-flex justify-content-center">
                            <p className="box-numbers">
                                {totalGuariti && totalGuariti.toLocaleString("it")}
                            </p>
                        </div>
                        <div className="col-12 d-flex justify-content-end pb-2">
                            <img alt="reset-plot2" src="reset_white.png" onClick={resetFilter} height="36px"/>
                        </div>
                    </div>
                </div>
                {/* // Total Box - Mobile Layout */}

                {/* Total Box - Desktop Layout */}
                <div className="col-4 col-md-4 d-none d-lg-block">
                    <div className="bg-box box-card box-left">
                        <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-none d-md-block d-lg-block box-logo-left"/>
                        <div className="text-white">
                            <div className="d-flex justify-content-start pt-3 pl-5">
                                <h5>Totale guariti</h5>
                            </div>
                            <div className="d-flex justify-content-start pl-5">
                                <p className="box-numbers">
                                    {totalGuariti && totalGuariti.toLocaleString("it")}
                                </p>
                            </div>
                            <div className="col-12 d-flex justify-content-end pb-2">
                                <img alt="Reset" src="reset_white.png" onClick={resetFilter} height="36px"/>
                            </div>
                        </div>
                    </div>
                </div>
                {/* // Total Box - Desktop Layout */}
            </div>
            <div className="col-12 col-md-6">

                {/* Graph */}
                <BarChart
                    width={+350}
                    height={+300}
                    handleRectClick={handleAgeBarChartClick}
                    selectedCodeAge={selectedCodeAge}
                    data={haeledAgesData}
                />
                {/* // Graph */}
            </div>
            <div className="col-12 col-md-6 my-0 py-0">
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
                    className="ml-5"
                />
                {/* // Map Graph */}

                <p className="text-center">*Seleziona la Regione/Provincia Autonoma per visualizzare il dettaglio.</p>
            </div>
        </div>
    )
};