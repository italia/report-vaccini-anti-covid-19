import { React, useEffect, useState } from "react";
import "../App.css";
import { isEmpty } from "lodash";
import { simulateClick } from './../utils';

import { BarChartSupplier } from "./BarChartsSupplier";
// import { MapAreaBySupplier } from "./MapAreaBySupplier";
export const Supplier = (data) => {
    // const [barState, setBarState] = useState(null);
    const [selectedLocationCategoryMap, setSelectedLocationCategoryMap] = useState(null);
    const [selectedSupplier, setelectedSupplier] = useState(null);
    // const [maxByCategory, setMaxByCategory] = useState(0);
    // const [summary, setSummary] = useState({});
    const [deliveryBarChartData, setdeliveryBarChartData] = useState([]);
    const [totalSuplier, setTotalSuplier] = useState(0);

    const resetFilter = () => {
        // setSummary(data);
        // setMaxByCategory(data?.data?.totalSuplier)
        setdeliveryBarChartData(data?.data?.allDosesSupplier);
        setTotalSuplier(data?.data?.totalSuplier);
        setelectedSupplier(null);
        setSelectedLocationCategoryMap(null);
        // setBarState(null);
        setTotalSuplier(data?.data?.totalSuplier);

    }
    useEffect(() => {
        if (!isEmpty(data)) {
            // setSummary(data);
            // setMaxByCategory(data?.data?.totalSuplier)
            setdeliveryBarChartData(data?.data?.allDosesSupplier);
            setTotalSuplier(data?.data?.totalSuplier);
        }
    }, [data]);

    // const loadBar = (countryIndex) => {
    //     let barData = data?.data?.allDosesSupplier;
    //     let ar = barData.map((e) => {
    //         let group = e.allDoses.filter((el) => areaMapping[el.area] === countryIndex.area || el.area === countryIndex?.code);
    //         let totalNumberDosesByRegion = sum(group.map(eGroup => eGroup.numero_dosi));
    //         return { fornitore: e.fornitore, totale: totalNumberDosesByRegion }
    //     })
    //     let total = sum(ar.map(e => e?.totale))
    //     setTotalSuplier(total);
    //     // setMaxByCategory(total);
    //     setdeliveryBarChartData(ar);
    //     setSelectedLocationCategoryMap(countryIndex);
    // };
    // const handleCountryClickCategories = (countryIndex) => {
    //     if (countryIndex === selectedLocationCategoryMap) {
    //         resetFilter();
    //     } else if (selectedSupplier) {
    //         setelectedSupplier(null);
    //         loadBar(countryIndex);
    //     } else {
    //         loadBar(countryIndex);
    //     }
    // };
    const handleDeliveryBarChartClick = (bar) => {
        if (selectedSupplier === bar) {
            resetFilter();
        } else if (selectedLocationCategoryMap) {
            resetFilter();
            simulateClick(bar.fornitore);
        } else {
            handleRectClick(bar);
            setelectedSupplier(bar);
            setTotalSuplier(bar?.totale);
            // setMaxByCategory(bar?.totale)
        }
    }

    const handleRectClick = (currentRect) => {
        // let doseBySuppier = groupBy(summary?.data?.allDosesSupplier?.filter(el => el?.fornitore === currentRect?.fornitore)[0]?.allDoses, 'area');
        // let doses = Object.keys(areaMapping).map(k => {
        //     let totalDoses;
        //     let area = areaMapping[k];
        //     totalDoses = doseBySuppier[k] ? sum(doseBySuppier[k].map((d => d.numero_dosi))) : 0;
        //     return { area: area, dosi_consegnate: totalDoses }
        // })
        // setBarState(doses);
        setelectedSupplier(currentRect)
    }

    return (
        <div className="row">
            <div className="col-12 col-md-12 h-100">
                <div className="col-12 d-flex justify-content-center align-items-center p-5 bg-title-plot">
                    <h3 className="text-center">Distribuzione vaccini per fornitore</h3>
                    <img src="logo.png" width="86" height="86" alt="Logo" className="d-none d-lg-block"
                        style={{
                            position: "absolute",
                            right: 28,
                            zIndex: 10
                        }} />
                </div>
                {/* BOX BLU */}
                <div className="col-12 col-md-12 h-100">
                    {/* LAYOUT MOBILE */}
                    <div className="mb-5 d-lg-none" style={{
                        position: 'relative',
                        background: '#013366',
                    }}>
                        <div className="text-white w-100">
                            <div className="w-100  h-100 d-flex justify-content-start pt-5 pl-4">
                                <h5>Totale vaccini distribuiti</h5>
                            </div>
                            <div className="w-100  h-100 d-flex justify-content-start pl-4">
                                <p className="numeri_box">{totalSuplier?.toLocaleString('it')}             </p>
                            </div>
                            <div className="col-12 d-flex justify-content-end  pb-2">
                                <img alt="reset-plot2" src="reset_white.png" onClick={resetFilter} height={35} />
                            </div>
                        </div>
                    </div>
                    {/* LAYOUT DESKTOP */}
                    <div className="offset-md-9 col-md-3  d-none d-lg-block" style={{ height: 100 }}>
                        <div style={{
                            position: 'relative',
                            background: '#17324D',
                            top: -90,
                            left: -50,
                        }}>
                            <div className="text-white w-100">
                                <div className="w-100 h-100 d-flex justify-content-start pt-3 pl-4">
                                    <h5>Totale<br></br>vaccini distribuiti</h5>
                                </div>
                                <div className="w-100  h-100 d-flex justify-content-start pl-4">
                                    <p className="numeri_box" >{totalSuplier?.toLocaleString('it')}
                                    </p>
                                </div>
                                <div className="col-12 d-flex justify-content-end  pb-2">
                                    <img alt="Reset" src="reset_white.png" onClick={resetFilter} height={35} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="col-12 col-md-6 h-100">

                <div className="p-4  d-lg-none">
                    <div className="w-100 h-100 d-flex justify-content-start pr-5">
                        <img src="logo.png" width="35" height="35" alt="Logo" />
                        <h5 className="pl-3 pl-sm-1">Distribuzione vaccini<br /> per regione</h5>
                    </div>
                </div>
                <div className="p-4  d-none d-lg-block position-text-lg">
                    <div className="w-100 h-100 d-flex justify-content-start pr-5">
                        <img src="logo.png" width="35" height="35" alt="Logo" />
                        <h5 className="pl-3 pl-sm-1">Distribuzione<br />vaccini<br /> per regione</h5>
                    </div>
                </div>
                <MapAreaBySupplier
                    summary={barState ? { deliverySummary: barState } : summary.data}
                    selected={selectedLocationCategoryMap}
                    handleCountryClick={handleCountryClickCategories}
                    maxByCategory={maxByCategory}
                    className="w-100 h-100"
                />
            </div> */}
            <div className="col-12 col-md-6 h-100 pb-5">
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
            <div className=" d-none d-sm-none d-md-block d-lg-none  col-md-6">

            </div>
        </div>
    );
};