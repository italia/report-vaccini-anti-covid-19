import React, { useEffect, useState } from "react";
import { isEmpty, max } from "lodash";
import { MapArea } from "./../components/MapArea";
import { LocationsTable } from "./../components/LocationsTable";

const TextBoxTotal = ({locationCount}) => (
    <div className="text-white w-100">
        <div className="w-100  h-100 d-flex justify-content-start pt-5 pl-4">
            <h3>Totale: {locationCount}</h3>
        </div>
    </div>
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
            <div className="col-12  d-flex justify-content-center align-items-center p-5 bg-title-plot" style={{ marginTop: 40 }}>
                <div style={{textAlign: 'center'}}>
                    <h3 className="text-center">Principali Punti di Somministrazione</h3>
                    <p>(Sono inclusi i punti di somministrazione ospedalieri e territoriali;<br />
                        non sono inclusi i punti di somministrazione temporanei)</p>
                </div>
            </div>
            <div className="col-12 col-md-12 h-100 p-3 mb-3" style={{marginTop: -10}}>
                {/* Total Box - Mobile View */}
                <div className="d-lg-none m-3 pl-5" style={{background: "#013366",}}>
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="" style={{ position: "absolute", left:-10, top:0}}/>

                    <TextBoxTotal locationCount={locationCount}/>

                    <div className="col-12 d-flex justify-content-end  pb-2">
                        <img alt="reset-plot" src="reset_white.png" onClick={resetFilter} height={35} />
                    </div>

                </div>
                {/* // Total Box - Mobile View */}

                {/* Total Box - Desktop View */}
                <div className="col-3 col-md-3 h-100 d-none d-lg-block">
                    <div style={{ position: "relative", background: "#17324D", top: -50, left: 25, }} >
                    <img src="Coccarda.svg" width="100" height="100" alt="Logo" className="d-none d-md-block d-lg-block" style={{ zIndex: 10, position: 'absolute', right: -50, top: -25 }} />
                        <div className="text-white w-100">

                        <TextBoxTotal locationCount={locationCount}/>

                            <div className="col-12 d-flex justify-content-end  pb-2">
                                <img alt="reset-white" src="reset_white.png" onClick={resetFilter} height={35} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* // Total Box - Desktop View */}
            </div>
            <div className="col-12 col-md-6 pt-5">
                {/* Map Legend - Mobile View */}
                <div className="p-2 position-relative d-lg-none" style={{top:-100}}>Principali Punti di Somministrazione per Regione</div>

                {/* Map Legend - Desktop View */}
                <div className="p-4 mb-2 position-relative d-none d-lg-block" style={{ left: "300px", top: "-60px" }} ><TextBoxMap/></div>

                {/* Map Graph */}
                <div style={{marginTop: -150}}>
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
            <div className="col-12 col-md-6 pt-3 pl-3" style={{marginTop: -20}}>
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
