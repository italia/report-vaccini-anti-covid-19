import { React, useEffect, useState } from "react";
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
            <div className="col-12 col-md-12 mt-4">
                {/* Box Title */}
            <div className="col-12 d-flex justify-content-center align-items-center section-title mx-2">
                <div className="text-center">
                    <h3>Distribuzione vaccini per fornitore</h3>
                </div>
            </div>
            {/* // Box Title */}

            <div className="col-12 col-md-12 m-3">
                {/* Total Box - Mobile Layout */}
                <div className="d-lg-none bg-box box-mobile m-3">
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-flex text-center box-logo-right"/>
                        <div className="text-white">
                            <div className="d-flex justify-content-center pt-5">
                                <h5>Totale vaccini distribuiti</h5>
                            </div>
                            <div className="d-flex justify-content-center">
                                <p className="box-numbers">{totalSuplier?.toLocaleString('it')}</p>
                            </div>
                            <div className="col-12 d-flex justify-content-end pb-2">
                                <img alt="reset-plot2" src="reset_white.png" onClick={resetFilter} height="36px"/>
                            </div>
                        </div>
                    </div>
                    {/* // Total Box - Mobile Layout */}

                    {/* Total Box - Desktop Layout */}
                    <div className="offset-md-8 col-md-4 d-none d-lg-block">
                        <div className="bg-box box-card box-right">
                            <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-none d-md-block d-lg-block box-logo-right"/>
                            <div className="text-white">
                                <div className="d-flex justify-content-start pt-3 pl-5">
                                    <h5>Totale vaccini distribuiti</h5>
                                </div>
                                <div className="d-flex justify-content-start pl-5">
                                    <p className="box-numbers" >{totalSuplier?.toLocaleString('it')}</p>
                                </div>
                                <div className="col-12 d-flex justify-content-end pb-2">
                                    <img alt="Reset" src="reset_white.png" onClick={resetFilter} height="36px"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* // Total Box - Desktop Layout */}
                </div>
            </div>

            {/* Supplier BarChart */}
            <div className="col-12 col-md-7 w-100 h-100 pb-5">
                <BarChartSupplier
                    width="850"
                    handleBarChartClick={handleDeliveryBarChartClick}
                    height="350"
                    selected={selectedSupplier}
                    property={{ xprop: "fornitore", yprop: "totale" }}
                    data={deliveryBarChartData}
                />
            </div>
            {/* Supplier BarChart */}
        </div>
    );
};