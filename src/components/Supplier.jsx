import { React, useEffect, useState } from "react";
import "../App.css";
import { isEmpty, groupBy, sum } from "lodash";
import { areaMapping } from './../utils';

import { BarChartSupplier } from "./BarChartsSupplier";
import { MapAreaBySupplier } from "./MapAreaBySupplier";
export const Supplier = (data) => {
    const [barState, setBarState] = useState(null);
    const [selectedLocationCategoryMap, setSelectedLocationCategoryMap] = useState(null);
    const [selectedSupplier, setelectedSupplier] = useState(null);
    const [categoryRegionSelect, setCategoryRegionSelect] = useState(null);
    const [maxByCategory, setMaxByCategory] = useState(0);
    const [summary, setSummary] = useState({});
    const [deliveryBarChartData, setdeliveryBarChartData] = useState([]);

    const resetFilter = () => {
        setSummary(data);
        setMaxByCategory(data?.data?.totalSuplier)
        setdeliveryBarChartData(data?.data?.allDosesSupplier);
        setelectedSupplier(null);
        setSelectedLocationCategoryMap(null);
        setBarState(null);
    }
    useEffect(() => {
        if (!isEmpty(data)) {
            setSummary(data);
            setMaxByCategory(data?.data?.totalSuplier)
            setdeliveryBarChartData(data?.data?.allDosesSupplier);
        }
    }, [data]);

    const loadBar = (countryIndex) => {
        let barData = data?.data?.allDosesSupplier;
        let ar = barData.map((e) => {
            let group = e.allDoses.filter((el) => areaMapping[el.area] === countryIndex.area || el.area === countryIndex?.code);
            let totalNumberDosesByRegion = sum(group.map(eGroup => eGroup.numero_dosi));
            return { fornitore: e.fornitore, totale: totalNumberDosesByRegion }
        })
        setdeliveryBarChartData(ar);
        setSelectedLocationCategoryMap(countryIndex);
    };
    const handleCountryClickCategories = (countryIndex) => {

        if (countryIndex === selectedLocationCategoryMap) {
            resetFilter();
        } else if (selectedSupplier) {
            setelectedSupplier(null);
            loadBar(countryIndex);
        } else {
            loadBar(countryIndex);
        }
    };
    const handleDeliveryBarChartClick = (bar) => {
        if (selectedSupplier === bar) {
            resetFilter();
        } else {
            handleRectClick(bar);
            setelectedSupplier(bar);
        }
    }

    const handleRectClick = (currentRect) => {

        let doseBySuppier = groupBy(summary?.data?.allDosesSupplier?.filter(el => el?.fornitore === currentRect?.fornitore)[0]?.allDoses, 'area');
        let doses = Object.keys(areaMapping).map(k => {
            let totalDoses;
            let area = areaMapping[k];
            totalDoses = doseBySuppier[k] ? sum(doseBySuppier[k].map((d => d.numero_dosi))) : 0;
            return { area: area, dosi_consegnate: totalDoses }
        })
        setBarState(doses);
        setelectedSupplier(currentRect)

    }

    return (
        <div className="row">
            <div className="col-12 col-md-6 h-100">
                <div className="p-4 position-relative d-lg-none">
                    <div className="w-100 h-100 d-flex justify-content-start pr-5">
                        <img src="logo.png" width="35" height="35" alt="Logo" />
                        <h5 className="pl-3 pl-sm-1">Vaccinazioni<br /> per regione</h5>
                    </div>
                </div>
                <div className="p-4 position-relative d-none d-lg-block" style={{ left: '300px', top: '190px' }}>
                    <div className="w-100 h-100 d-flex justify-content-start pr-5">
                        <img src="logo.png" width="35" height="35" alt="Logo" />
                        <h5 className="pl-3 pl-sm-1">Vaccinazioni<br /> per regione</h5>
                    </div>
                </div>
                <MapAreaBySupplier
                    summary={barState ? { deliverySummary: barState } : summary.data}
                    selected={selectedLocationCategoryMap}
                    handleCountryClick={handleCountryClickCategories}
                    maxByCategory={maxByCategory}
                    setCategoryRegionSelect={setCategoryRegionSelect}
                    categoryRegionSelect={categoryRegionSelect}
                    className="w-100 h-100"
                />
            </div>
            <div className="col-12 col-md-6 h-100">
                <BarChartSupplier
                    title=""
                    xtitle="Fascia d'età"
                    ytitle=""
                    width="800"
                    handleDeliveryBarChartClick={handleDeliveryBarChartClick}
                    height="300"
                    selected={selectedSupplier}
                    property={{ xprop: "fornitore", yprop: "totale" }}
                    data={deliveryBarChartData}
                />
            </div>

        </div>
    );
};