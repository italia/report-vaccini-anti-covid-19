import React, { useEffect, useState } from "react";
import { isEmpty, max } from "lodash";
import { HealedHStackedBarChart } from "../components/HealedHStackedBarChart";
import { MapArea } from "../components/MapArea";

export const Healed = ({ data }) => {
    const [healedColor, setHealedColor] = useState([]);
    const [healed, setHealed] = useState([]);
    const [healedKeys, setHealedKeys] = useState([]);
    const [healedData, setHealedData] = useState([]);
    const [keyValueHealed, setKeyValueHealed] = useState({});
    
    const [categoryMapData, setCategoryMapData] = useState([]);
    const [categoryMapField, setCategoryMapField] = useState("guariti");

    const [categorySelectedRegion, setCategorySelectedRegion] = useState(null);
    const [categorySelectedRegionDescr, setCategorySelectedRegionDescr] = useState(null);
    const [selectedCodeAge, setSelectedCodeAge] = useState(null);

    const [totalByCategory, setTotalByCategory] = useState(0);

    useEffect(() => {
        if (!isEmpty(data)) {
            setHealedColor(data.healedColor);
            setHealed(data.healed);
            setHealedData(data.healedData);
            setHealedKeys(data.keysHealed);

            setTotalByCategory(data.totalGuariti + data.totalGuaritiBaby + data.totalGuaritiDoppia);
            setCategoryMapData(data.healedMapData);

            setKeyValueHealed(data.keyValueHealed);
        }
    }, [data]);

    const resetFilter = () => {
        setSelectedCodeAge(null);
        setCategorySelectedRegion(null);
        setCategorySelectedRegionDescr(null);
        setTotalByCategory(data.totalGuariti + data.totalGuaritiBaby + data.totalGuaritiDoppia);
        setHealedData(data.healedData);
        setCategoryMapField("guariti");
        setCategoryMapData(data.healedMapData);
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
          setHealedData(data.healedRegionData[region.code]);

          var val = 0;
          for(let row of data.healedRegionData[region.code]) {
            val += row.Totale;
          }
          setTotalByCategory(val);
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
          setTotalByCategory(data.healedTotal[cat.data.label]);
        }
    };

    return (
        <div className="row">
            {/* Box Title */}
            <div className="col-12 d-flex justify-content-center align-items-center section-title mx-2">
                <div className="text-center">
                    <h3 class="mb-0">Platea guariti</h3>
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
                        <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-none d-md-block d-lg-block box-logo-left"/>
                        <div className="text-white">
                            <div className="d-flex justify-content-start pt-3 pl-5">
                                <h5>Totale guariti</h5>
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
                <HealedHStackedBarChart
                    width={+350}
                    height={+300}
                    property={{ xprop: "label", yprop: "total" }}
                    handleRectClick={handleCategoryBarChartClick}
                    regionSelected={categorySelectedRegionDescr}
                    selectedCodeAge={selectedCodeAge}
                    colors={healedColor}
                    keys={healedKeys}
                    labels={keyValueHealed}
                    data={healedData}
                />
                {/* // Graph */}

                 {/* Legend */}
                 <div className="row mb-4 ml-4">
                    {healed.map((itemVal, index) => {
                        return (
                            <div className="row" key={itemVal}>
                                <div className="circle" style={{ backgroundColor: healedColor[index] }}></div>
                                <div className="legend-dark mr-4">{itemVal}</div>
                            </div>
                        )
                    })}
                </div>
                {/* // Legend */}

            </div>
            <div className="col-12 col-md-6 my-0 py-0">
                {/* Map Graph */}
                <MapArea
                    fillMapDeliveryArea={fillMapCategoryArea}
                    summary={categoryMapData}
                    handleMapDeliveryClick={handleMapCategoryClick}
                    fillBy={categoryMapField}
                    percentage={false}
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

                <p className="text-center">*Seleziona la Regione/Provincia Autonoma per visualizzare il dettaglio.</p>
            </div>
        </div>
    )
};