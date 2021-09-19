import React, { useEffect, useState } from "react";
import { find, max, isEmpty } from "lodash";
import { Table } from "./../components/Table";

import { MapArea } from "./../components/MapArea";

export const Deliveries = ({ data }) => {
    const [deliveryMapData, setDeliveryMapData] = useState([]);
    const [deliveryTableData, setDeliveryTableData] = useState([]);
    const [deliverySelectedRegion, setDeliverySelectedRegion] = useState(null);
    const [totalDelivery, setTotalDelivery] = useState(0);


    const [selectedAge, setSelectedAge] = useState(null);

    useEffect(() => {
        if (!isEmpty(data)) {
            setDeliveryMapData(data.totalDeliverySummary);


            setDeliveryTableData(data.totalDeliverySummary);
            setTotalDelivery(data.tot);
        }
    }, [data]);

    const resetFilter = () => {
        setDeliverySelectedRegion(null);
        setDeliveryTableData(data.totalDeliverySummary);
        setTotalDelivery(data.tot);


        setSelectedAge(null);
        setDeliveryMapData(data.totalDeliverySummary);
    };

    const fillMapDeliveryArea = ({ region, maxValue, field }) => {
        let scaleOp = 0;
        if (region.code === deliverySelectedRegion) {
            scaleOp = 1;
        } else if (!deliverySelectedRegion) {
            scaleOp = max([region[field] / maxValue, 0.1]);
        } else {
            const valueToFill = region[field] / (2 * maxValue);
            scaleOp = max([valueToFill, 0.1]);
        }
        return `rgba(0,102,204,${scaleOp}) `;
    };

    const handleMapDeliveryClick = (region) => {
        if (selectedAge) {
            resetFilter();
        }

        if (deliverySelectedRegion === region.code) {
            resetFilter();
        } else {
            const deliveryTableFilteredData = find(
            data.totalDeliverySummary,
            (d) => d.code === region.code
        );

        setDeliveryTableData([deliveryTableFilteredData]);

        setDeliverySelectedRegion(region.code);
        setTotalDelivery(deliveryTableFilteredData.dosi_somministrate);

    }
};


return (
    <div>
        <div className="row">
            <div className="col-12 d-flex justify-content-end"></div>
        </div>
        <div className="row p-2 pb-5" style={{ backgroundColor: "#F8FBFE" }}>
            <div className="col-12 col-lg-6 h-100 order-md-2 order-lg-1 ">
                <div className="container-info d-none d-sm-none d-md-flex d-lg-flex">
                    <span data-toggle="tooltip" title="% somministrazioni su dosi consegnate" className="circle-info">i</span>
                </div>
                <Table deliveryTableData={deliveryTableData} className="mr-5 h-100" />
            </div>
            <div className="col-12 col-lg-6 order-md-1 order-lg-2 text-center">
                <div className="p-4 position-relative d-lg-none">
                    <div className="w-100 h-100 d-flex justify-content-start pr-5">
                        <h5 className="pl-3 pl-sm-1 justify-content-center">Distribuzione somministrazioni rispetto alle consegne</h5>
                    </div>
                </div>
                <div className="p-5 d-none d-lg-block">
                    <div className="d-flex justify-content-end" style={{position: "absolute ", top: 150, right: 50,}}>
                        <h5 className="pl-1 pl-sm-1 text-left">
                            <span
                                data-toggle="tooltip"
                                title="Nel grafico è rappresentato il tasso di somministrazione,ovvero il rapporto tra le somministrazioni e le dosi consegnate (%)"
                                className="circle-info"
                                style={{
                                    position: "relative",
                                    right: 23,
                                    top: 25,
                                }}
                            >i</span>Distribuzione<br />somministrazioni <br />rispetto alle consegne
                        </h5>
                    </div>
                </div>
                <div className="justify-content-center">
                <MapArea
                    fillMapDeliveryArea={fillMapDeliveryArea}
                    summary={deliveryMapData}
                    handleMapDeliveryClick={handleMapDeliveryClick}
                    tooltip={(r) => r.area + " " + (r.percentuale_somministrazione && r.percentuale_somministrazione.toLocaleString("it")) + "%"}
                    fillBy="percentuale_somministrazione"
                    className="w-100 h-100 ml-5"
                />
                </div>
                <div className="p-4 position-relative">
                    <div className="text-black w-100">
                        <div className="w-100 h-100 d-flex justify-content-center ">
                            <span className="font-50 pl-3">{totalDelivery?.toLocaleString("it")}</span>
                        </div>
                        <div className="w-100  h-100 d-flex justify-content-center">
                            <h5>Totale somministrazioni</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};
