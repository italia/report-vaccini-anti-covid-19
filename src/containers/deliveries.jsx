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
            <div className="row p-2 p-3 bg-grey">
                <div className="col-12 col-lg-6 h-100 order-md-2 order-lg-1 p-1 pb-5">
                    <Table deliveryTableData={deliveryTableData} className="mr-5 h-100" />
                </div>
                <div className="col-12 col-lg-6 order-md-1 order-lg-2 text-center">
                    <div className="p-4 position-relative d-lg-none">
                        <div className="d-flex justify-content-start pr-5">
                            <h5 className="pl-4 pl-sm-1 justify-content-center">Distribuzione somministrazioni rispetto alle consegne</h5>
                        </div>
                    </div>
                    <div className="p-4 d-none d-lg-block map-legend mt-5">
                        <div className="d-flex justify-content-end">
                            <h5 className="pl-1 pl-sm-1 text-left">
                                Distribuzione<br />somministrazioni <br />rispetto alle consegne
                            </h5>
                        </div>
                    </div>
                    <div className="justify-content-center mt-5">
                    <MapArea
                        fillMapDeliveryArea={fillMapDeliveryArea}
                        summary={deliveryMapData}
                        handleMapDeliveryClick={handleMapDeliveryClick}
                        tooltip={(r) => r.area + " " + (r.percentuale_somministrazione && r.percentuale_somministrazione.toLocaleString("it")) + "%"}
                        fillBy="percentuale_somministrazione"
                    />
                    </div>
                    <div className="p-4 position-relative">
                        <div className="text-black">
                            <div className="d-flex justify-content-center ">
                                <span className="numbers">{totalDelivery?.toLocaleString("it")}</span>
                            </div>
                            <div className="d-flex justify-content-center">
                                <h5>Totale somministrazioni</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
