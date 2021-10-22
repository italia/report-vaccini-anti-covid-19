import { React, useEffect, useState } from "react";
import "../App.css";
import { isEmpty } from "lodash";
import { simulateClick } from './../utils';
import { BarChartSupplier } from "./BarChartsSupplier";

export const Supplier = (data) => {
    const [selectedLocationCategoryMap, setSelectedLocationCategoryMap] = useState(null);
    const [selectedSupplier, setelectedSupplier] = useState(null);
    const [deliveryBarChartData, setdeliveryBarChartData] = useState([]);
    const [totalSuplier, setTotalSuplier] = useState(0);

    const resetFilter = () => {
        setdeliveryBarChartData(data?.data?.allDosesSupplier);
        setTotalSuplier(data?.data?.totalSuplier);
        setelectedSupplier(null);
        setSelectedLocationCategoryMap(null);
        setTotalSuplier(data?.data?.totalSuplier);
    }

    useEffect(() => {
        if (!isEmpty(data)) {
            setdeliveryBarChartData(data?.data?.allDosesSupplier);
            setTotalSuplier(data?.data?.totalSuplier);
        }
    }, [data]);

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
        }
    }

    const handleRectClick = (currentRect) => {
        setelectedSupplier(currentRect)
    }

    return (
        <div className="row">
            <div className="col-12 col-md-12 h-100" style={{marginTop: 40}}>
                <div className="col-12 d-flex justify-content-center align-items-center p-5 bg-title-plot">
                    <h3 className="text-center">Distribuzione vaccini per fornitore</h3>
                </div>
                <div className="col-12 col-md-12 h-100 p-0">

                    {/* Total Box - Mobile Layout */}
                    <div className="m-3 d-lg-none" style={{ position: 'relative', background: '#013366' }}>
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-flex text-center" style={{ position: "absolute", right:-40, top:-25}}/>
                        <div className="text-white w-100">
                            <div className="w-100  h-100 d-flex justify-content-center pt-3">
                                <h5>Totale vaccini distribuiti</h5>
                            </div>
                            <div className="w-100  h-100 d-flex justify-content-center">
                                <p className="numeri_box">{totalSuplier?.toLocaleString('it')}</p>
                            </div>
                            <div className="col-12 d-flex justify-content-end  pb-2">
                                <img alt="reset-plot2" src="reset_white.png" onClick={resetFilter} height={35} />
                            </div>
                        </div>
                    </div>
                    {/* // Total Box - Mobile Layout */}

                    {/* Total Box - Mobile Desktop */}
                    <div className="offset-md-9 col-md-3  d-none d-lg-block" style={{ height: 100 }}>
                        <div style={{ position: 'relative', background: '#17324D', top: -70, left: -50, }}>
                            <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-none d-lg-block" style={{ position: "absolute", right: -45, top: -25, zIndex: 10 }} />
                            <div className="text-white w-100">
                                <div className="w-100 h-100 d-flex justify-content-start pt-3 pl-4">
                                    <h5>Totale<br></br>vaccini distribuiti</h5>
                                </div>
                                <div className="w-100  h-100 d-flex justify-content-start pl-4">
                                    <p className="numeri_box" >{totalSuplier?.toLocaleString('it')}</p>
                                </div>
                                <div className="col-12 d-flex justify-content-end  pb-2">
                                    <img alt="Reset" src="reset_white.png" onClick={resetFilter} height={35} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* // Total Box - Mobile Desktop */}
                </div>
            </div>

            {/* Supplier BarChart */}
            <div className="col-12 col-md-6 h-100 pb-5">
                <BarChartSupplier
                    title=""
                    xtitle=""
                    ytitle=""
                    width="900"
                    handleBarChartClick={handleDeliveryBarChartClick}
                    height="350"
                    selected={selectedSupplier}
                    property={{ xprop: "fornitore", yprop: "totale" }}
                    data={deliveryBarChartData}
                />
            </div>
            {/* Supplier BarChart */}
            <div className=" d-none d-sm-none d-md-block d-lg-none  col-md-6"></div>
        </div>
    );
};