import { React, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import _ from "lodash";

import "./MapArea.css";

export const MapArea = ({
  handleMapDeliveryClick,
  fillMapDeliveryArea,
  fillBy,
  summary,
  tooltip,
}) => {
  const [geographies, setGeographies] = useState([]);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const maxValue = _.maxBy(summary || {}, fillBy);
    setMaxValue(maxValue ? maxValue[fillBy] : 0);
  }, [summary, fillBy]);

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

  return (
    <div className="map-area mt-sx-3" style={{ marginTop: "80px" }}>
      <svg className="h-100 w-100" height={height}>
        <g className="countries">
          {geographies.map((d, i) => {
            let reg_name = d.properties.reg_name;
            let regions = _.filter(summary, (i) => i.area === reg_name);

            let region = {};
            if (regions && regions.length > 0) {
              region = regions[0];
            }

            return (
              <path
                key={`path-${i}`}
                d={d3.geoPath().projection(projection)(d)}
                className="country"
                id={`${region?.area?.trim()}`}
                fill={fillMapDeliveryArea({ region, maxValue, field: fillBy })}
                stroke="#FFFFFF"
                strokeWidth={0.7}
                onClick={() => handleMapDeliveryClick(region)}
              >
                <title>
                  <span className="bg-info">{tooltip(region)}</span>
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
