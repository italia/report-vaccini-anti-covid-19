import { React, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { filterByArea } from "../utils";
import { sum } from 'lodash';
import "./MapArea.css"

export const MapAreaBySupplier = (
  {
    handleCountryClick,
    selectedCodeCategory,
    maxByCategory,
    summary,
    selected,
    categoryRegionSelect,
    setCategoryRegionSelect
  }
) => {
  const [geographies, setGeographies] = useState([]);



  const width = 498,
    height = 478;

  const projection = d3
    .geoAlbers()
    .center([0, 41])
    .rotate([347, 0])
    .parallels([35, 45])
    .scale(2200)
    .translate([width / 2, height / 2]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("data/geo/it.json");
      const data = await res.json();
      setGeographies(topojson.feature(data, data.objects.regions).features);
    };
    fetchData();
  }, []);

  const getCategoryQuantity = (region) => {
    return region?.dosi_consegnate?.toLocaleString('it');
  }

  const fillRegion = (region) => {
    let dosi = region.dosi_consegnate
    if (selected === region) {
      return 1
    } else if (!selected) {
      return (1 / 5) * (dosi / maxByCategory * 100)
    } else {
      return (0.2 / 5) * (dosi / maxByCategory * 100)
    }
    // return 1;
  }

  return (
    <div className="map-area mt-2">
      <svg className="h-100 w-100" height={height} >
        <g className="countries">
          {geographies.map((d, i) => {
            let sum = summary.deliverySummary
            const regions = sum?.filter(filterByArea(d.properties.reg_name));
            let region = {};
            if (regions && regions.length > 0) {
              region = regions[0];
            }
            return (
              <path
                key={`path-${i}`}
                d={d3.geoPath().projection(projection)(d)}
                className="country"

                fill={`rgba(0,102,204, ${fillRegion(region)}) `}
                stroke="#FFFFFF"
                strokeWidth={0.7}
                onClick={() => handleCountryClick(region)}
              >
                <title>
                  <span className="bg-info">
                    {region.area} {getCategoryQuantity(region)}
                  </span>
                </title>
              </path>
            );
          })}
          );
        </g>
      </svg>
    </div>
  );
};
