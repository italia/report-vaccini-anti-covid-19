import React, { useEffect, useState } from "react";
import { isEmpty, max } from "lodash";

import { AgeHStackedBarChart } from "../components/AgeHStackedBarChart";
import { MapArea } from "../components/MapArea";
import { useCampaignContext } from "../campaigns/CampaignContext";

export const AgeDoses = ({ data }) => {
    const [dosesAgesColor, setdosesAgesColor] = useState([]);
    const [dosesAgesKeys, setDosesAgesKeys] = useState([]);
    const [keyValueDoses, setKeyValueDoses] = useState({});
    const [dosesAgesData, setDosesAgesData] = useState([]);

    const [categoryMapData, setCategoryMapData] = useState([]);
    const [categoryMapField, setCategoryMapField] = useState("totale");

    const [categorySelectedRegion, setCategorySelectedRegion] = useState(null);
    const [categorySelectedRegionDescr, setCategorySelectedRegionDescr] = useState(null);
    const [selectedCodeAge, setSelectedCodeAge] = useState(null);

    const [totalByCategory, setTotalByCategory] = useState(0);

    useEffect(() => {
        if (!isEmpty(data)) {
            setdosesAgesColor(data.agedosesContent.dosesAgesColor);
            setDosesAgesKeys(data.agedosesContent.keysDosesAges);
            setKeyValueDoses(data.agedosesContent.keyValueDoses);
            setDosesAgesData(data.agedosesContent.dosesAgesData);
            setTotalByCategory(data.totCampagna);
            setCategoryMapData(data.agedosesContent.secondDosesMapData);
        }
    }, [data]);

    const resetFilter = () => {
        setSelectedCodeAge(null);
        setCategorySelectedRegion(null);
        setCategorySelectedRegionDescr(null);
        setTotalByCategory(data.totCampagna);
        setDosesAgesData(data.agedosesContent.dosesAgesData);
        setCategoryMapField("totale");
        setCategoryMapData(data.agedosesContent.secondDosesMapData);
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

        if (categorySelectedRegion === region.code || region.code === undefined) {
            resetFilter();
        } else {
            setCategorySelectedRegion(region.code);
            setCategorySelectedRegionDescr(region.area);
            setDosesAgesData(data.agedosesContent.dosesAgesRegionData[region.code])

            var totale = 0;
            for(let row of data.agedosesContent.dosesAgesRegionData[region.code]) {
                totale += row.totale;
            }
            setTotalByCategory(totale);
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

          for(let row of data.agedosesContent.dosesAgesData) {
            if (row.label === cat.data.label) {
                setTotalByCategory(row.totale);
                break;
            }
          }
        }
    };

    const {title} = useCampaignContext('ageDoses')
    return (
        <div className="row">
            {/* Box Title */}
            <div className="col-12 d-flex justify-content-center align-items-center section-title mx-2">
                <div>
                    <h3>{title}</h3>
                </div>
            </div>
            {/* // Box Title */}

            <div className="col-12 col-md-12 m-3">
                {/* Total Box - Mobile Layout */}
                <div className="d-lg-none bg-box box-mobile m-3">
                    <div className="text-white">
                        <div className="d-flex justify-content-center pt-5">
                            <h5>Totale somministrazioni</h5>
                        </div>
                        <div className="d-flex justify-content-center">
                            <p className="box-numbers">
                                {totalByCategory && totalByCategory.toLocaleString("it")}
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
                        <div className="text-white">
                            <div className="d-flex justify-content-start pt-3 pl-5">
                                <h5>Totale somministrazioni</h5>
                            </div>
                            <div className="d-flex justify-content-start pl-5">
                                <p className="box-numbers">
                                    {totalByCategory && totalByCategory.toLocaleString("it")}
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
                <AgeHStackedBarChart
                    width={+350}
                    height={+300}
                    property={{ xprop: "label", yprop: "total" }}
                    handleRectClick={handleCategoryBarChartClick}
                    regionSelected={categorySelectedRegionDescr}
                    selectedCodeAge={selectedCodeAge}
                    colors={dosesAgesColor}
                    keys={dosesAgesKeys}
                    labels={keyValueDoses}
                    data={dosesAgesData}
                />
                {/* // Graph */}

                <p className="d-block d-sm-none text-center">*Tieni premuto sulle barre del grafico per visualizzare i dati sulle dosi somministrate</p>
                <p className="d-none d-sm-block text-center">*Passa con il mouse sulle barre del grafico per visualizzare i dati sulle dosi somministrate</p>
            </div>
            <div className="col-12 col-md-6">

                {/* Map Title - Mobile View*/}
                <div className="p-4 d-lg-none">
                    <div className="text-center">
                        <h5>Totale somministrazioni per regione</h5>
                    </div>
                </div>
                {/* // Map Title - Mobile View*/}

                {/* Map Graph */}
                <MapArea
                    fillMapDeliveryArea={fillMapCategoryArea}
                    summary={categoryMapData}
                    handleMapDeliveryClick={handleMapCategoryClick}
                    fillBy={categoryMapField}
                    tooltip={(r) => {
                            var region = null;
                            for(let row of categoryMapData) {
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

                {/* Map Title - Desktop View*/}
                {/* <div className="p-4 position-relative d-none d-lg-block" style={{ left: "300px", top: "-390px" }}> */}
                <div className="p-4 d-none d-lg-block map-legend">
                    <div className="d-flex justify-content-end">
                        <h5 className="ml-5 pl-sm-1">
                            Totale somministrazioni
                            <br /> per regione
                        </h5>
                    </div>
                </div>
                {/* // Map Title - Desktop View*/}
            </div>
        </div>
    )
};