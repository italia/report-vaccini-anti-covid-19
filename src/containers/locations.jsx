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
    <img src="logo.png" width="35" height="35" alt="Logo" />
    <h5 className="pl-3 pl-sm-1">
      Principali punti di
      <br /> somministrazione <br /> per regione
    </h5>
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
    <div className="row ">
      <div className="col-12 d-flex justify-content-center align-items-center p-5 bg-title-plot">
        <img
          src="logo.png"
          width="86"
          height="86"
          alt="Logo"
          className="img-fluid"
          style={{ zIndex: 10 }}
        />
        <div style={{ paddingTop: 50 }}>
          <h3  className="text-center">Principali punti di somministrazione</h3>
          <div className="text-center position-relative">(Sono inclusi i punti di somministrazione ospedalieri e territoriali;<br/> non sono inclusi i punti di somministrazione temporanei)</div>
        </div>
      </div>
      <div className="col-12 col-md-12 h-100 p-0" style={{marginTop: 20}}>
        <div
          className="mb-5  d-lg-none "
          style={{
            position: "relative",
            background: "#013366",
          }}
        >
          <div className="text-white w-100">
            <TextBoxTotal locationCount={locationCount}/>
            <div className="col-12 d-flex justify-content-end  pb-2">
              <img
                alt="reset-plot"
                src="reset_white.png"
                onClick={resetFilter}
                height={35}
              />
            </div>
          </div>
        </div>
        <div className="col-3 col-md-3 h-100 d-none d-lg-block">
          <div
            style={{
              position: "relative",
              // width: 300,
              // height: 180,
              background: "#17324D",
              top: -90,
              left: 40,
            }}
          >
            <div className="text-white w-100">
              <TextBoxTotal locationCount={locationCount}/>
              <div className="col-12 d-flex justify-content-end  pb-2">
                <img
                  alt="reset-white"
                  src="reset_white.png"
                  onClick={resetFilter}
                  height={35}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 pt-5">
        <div className="p-4 position-relative d-lg-none" style={{left: 150, top: -115}}>
          <TextBoxMap/>
        </div>
        <div
          className="p-4 position-relative d-none d-lg-block"
          style={{ left: "300px", top: "-60px" }}
        >
          <TextBoxMap/>
        </div>
        <div style={{marginTop: -200}}>
        <MapArea
          fillMapDeliveryArea={fillMapDeliveryArea}
          summary={data.locationsByRegion}
          handleMapDeliveryClick={handleClick}
          tooltip={(r) =>
            r.area + ": " + (r.locations && r.locations.toLocaleString("it"))
          }
          fillBy="locations"
          className="ml-5 w-100 h-100"
        />
        </div>
      </div>
      <div className="col-12 col-md-6 pt-3 pl-3" style={{marginTop: -20}}>
        <LocationsTable
          summary={{ ...summary }}
          selected={selectedLocation}
          className="mr-5 h-100"
          setLocationCount={setLocationCount}
        />
      </div>
    </div>
  );
};
