import React, { useEffect, useState } from "react";
import { isEmpty, max } from "lodash";
import { Over60HStackedBarChart } from "../components/Over60HStackedBarChart";
import { MapArea } from "../components/MapArea";

export const Over60 = ({ data }) => {
    const [over60Color, setOver60Color] = useState([]);
    const [over60, setOver60] = useState([]);
    const [over60Keys, setOver60Keys] = useState([]);
    const [over60Data, setOver60Data] = useState([]);
    const [keyValueOver60, setKeyValueOver60] = useState({});

    const [categoryMapData, setCategoryMapData] = useState([]);
    const [categoryMapField, setCategoryMapField] = useState("totale");

    const [categorySelectedRegion, setCategorySelectedRegion] = useState(null);
    const [categorySelectedRegionDescr, setCategorySelectedRegionDescr] = useState(null);
    const [selectedCodeAge, setSelectedCodeAge] = useState(null);

    useEffect(() => {
        if (!isEmpty(data)) {
            setOver60Color(data.over60Color);
            setOver60(data.over60);
            setOver60Data(data.over60Data);
            setOver60Keys(data.keysOver60);
            setCategoryMapData(data.over60MapData);
            setKeyValueOver60(data.keyValueOver60);
        }
    }, [data]);

    const resetFilter = () => {
        setSelectedCodeAge(null);
        setCategorySelectedRegion(null);
        setCategorySelectedRegionDescr(null);
        setOver60Data(data.over60Data);
        setCategoryMapField("totale");
        setCategoryMapData(data.over60MapData);
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
          setOver60Data(data.over60RegionData[region.code]);
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
        }
    };

    return (
        <div className="row">
            <div className="col-12 col-md-6">

                {/* Graph */}
                <Over60HStackedBarChart
                    width={+350}
                    height={+120}
                    property={{ xprop: "label", yprop: "total" }}
                    handleRectClick={handleCategoryBarChartClick}
                    regionSelected={categorySelectedRegionDescr}
                    selectedCodeAge={selectedCodeAge}
                    colors={over60Color}
                    keys={over60Keys}
                    labels={keyValueOver60}
                    data={over60Data}
                />
                {/* // Graph */}

                 {/* Legend */}
                 <div className="row mb-4 ml-4">
                    {over60.map((itemVal, index) => {
                        return (
                            <div className="row" key={itemVal}>
                                <div className="circle" style={{ backgroundColor: over60Color[index] }}></div>
                                <div className="legend-dark mr-4">{itemVal}</div>
                            </div>
                        )
                    })}
                </div>
                {/* // Legend */}

                <p className="d-none d-sm-block text-center">*Passa con il mouse sulle barre del grafico per visualizzare i dati di dettaglio</p>
            </div>
            <div className="col-12 col-md-6 my-0 py-0">

                {/* Map Title - Mobile View*/}
                <div className="p-4 d-lg-none">
                    <div className="text-center">
                        <h5>Percentuale copertura per regione</h5>
                    </div>
                </div>
                {/* // Map Title - Mobile View*/}

                {/* Map Graph */}
                <MapArea
                    fillMapDeliveryArea={fillMapCategoryArea}
                    summary={categoryMapData}
                    handleMapDeliveryClick={handleMapCategoryClick}
                    fillBy={categoryMapField}
                    percentage={true}
                    tooltip={(r) => {
                            return (
                                r.area +
                                " " +
                                (r[categoryMapField] && r[categoryMapField].toFixed(2).toLocaleString("it") + "%")
                            )
                        }
                    }
                    className="ml-5"
                />
                {/* // Map Graph */}

                {/* Map Title - Desktop View*/}
                {/* <div className="p-4 position-relative d-none d-lg-block" style={{ left: "300px", top: "-390px" }}> */}
                <div className="p-4 d-none d-lg-block map-legend">
                    <div className="d-flex justify-content-start pr-5">
                        <h5 className="pl-3 pl-sm-1">
                            Percentuale copertura
                            <br /> per regione
                        </h5>
                    </div>
                </div>
                {/* // Map Title - Desktop View*/}
            </div>
        </div>
    )
};