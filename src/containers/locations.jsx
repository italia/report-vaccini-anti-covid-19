import React, { useEffect, useState } from "react";
import { isEmpty, max } from "lodash";
import { MapArea } from "./../components/MapArea";
import { LocationsTable } from "./../components/LocationsTable";

const TextBoxTotal = ({locationCount}) => (

    <>

        <div className="d-flex pl-5 pt-3">
            <h5>Totale punti somministrazione</h5>
        </div>
        <div className="d-flex pl-5">
            <p className="box-numbers">{locationCount}</p>
        </div>

    </>
)

const TextBoxMap = () => (
    <div className="w-100 h-100 d-flex justify-content-start pr-5">
        <h5 className="pl-3 pl-sm-1">Principali punti di<br /> somministrazione <br /> per regione</h5>
    </div>
)

export const Locations = ({ data }) => {
    const [summary, setSummary] = useState({});
    const [selectedLocation, setSelectedLocation] = useState("");
    const [locationCount, setLocationCount] = useState(0);

    useEffect(() => {
        if (!isEmpty(data)) {
            setSummary(data);
        }
    }, [data]);

    const resetFilter = () => {
        setSelectedLocation("");
        setLocationCount(0);
    };

    const fillMapDeliveryArea = ({ region, maxValue, field }) => {
        let scaleOp = 0;
            if (region.area === selectedLocation) {
                scaleOp = 1;
            } else if (!selectedLocation) {
                scaleOp = max([region[field] / maxValue, 0.1]);
            } else {
                const valueToFill = region[field] / (2 * maxValue);
                scaleOp = max([valueToFill, 0.1]);
            }
        return `rgba(23,50,77,${scaleOp})`;
    };

    const handleClick = (region) => {
        if (selectedLocation === region.area) {
            setSelectedLocation(null);
        } else {
            setSelectedLocation(region.area);
        }
    };

    return (
        <div className="row">
            {/* Box Title */}
            <div className="col-12 d-flex justify-content-center align-items-center section-title mx-2">
                <div className="text-center">
                    <h3>Principali punti di somministrazione</h3>
                    <p>(Sono inclusi i punti di somministrazione ospedalieri e territoriali;<br />
                        non sono inclusi i punti di somministrazione temporanei)</p>
                </div>
            </div>
            {/* Box Title */}

            <div className="col-12 col-md-12 m-3">
                {/* Total Box - Mobile View */}
                <div className="d-lg-none bg-box box-mobile m-3">
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-flex text-center box-logo-left"/>
                        <div className="text-white">
                            <TextBoxTotal locationCount={locationCount}/>
                        </div>
                    <div className="col-12 d-flex justify-content-end pb-2">
                        <img alt="reset-plot" src="reset_white.png" onClick={resetFilter} height="36" />
                    </div>
                </div>
                {/* // Total Box - Mobile View */}

                {/* Total Box - Desktop View */}
                <div className="col-4 col-md-4 d-none d-lg-block">
                <div className="bg-box box-card box-left">
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-none d-md-block d-lg-block box-logo-left"/>
                        <div className="text-white">

                        <TextBoxTotal locationCount={locationCount}/>

                            <div className="col-12 d-flex justify-content-end pb-2">
                                <img alt="reset-white" src="reset_white.png" onClick={resetFilter} height="36px" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* // Total Box - Desktop View */}
            </div>
            <div className="col-12 col-md-6">
                {/* Map Legend - Mobile View */}
                <div className="p-2 d-lg-none text-center">Principali Punti di Somministrazione per Regione</div>

                {/* Map Legend - Desktop View */}
                <div className="d-none d-lg-block map-legend" ><TextBoxMap/></div>

                {/* Map Graph */}
                <div className="mt-5">
                <MapArea
                    fillMapDeliveryArea={fillMapDeliveryArea}
                    summary={data.locationsByRegion}
                    handleMapDeliveryClick={handleClick}
                    tooltip={(r) => r.area + ": " + (r.locations && r.locations.toLocaleString("it")) }
                    fillBy="locations"
                    className="ml-5 w-100 h-100"
                />
                </div>
                {/* // Map Graph */}
            </div>
            {/* Data Table */}
            <div className="col-12 col-md-6 pl-3">
                <LocationsTable
                    summary={{ ...summary }}
                    selected={selectedLocation}
                    className="mr-5 h-100"
                    setLocationCount={setLocationCount}
                />
            </div>
            {/* // Data Table */}
        </div>
    );
};
