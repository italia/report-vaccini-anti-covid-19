import { React, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../App.css";
import { maxX } from "../utils";

export const BarChart = ({
  handleDeliveryBarChartClick, 
  height,
  width,
  data,
  selected,
  property,
  title,
  ytitle
  }) => {

  const myRef = useRef();
  const divRef = useRef();

  useEffect(() => {
      doExit();
      draw();
  // eslint-disable-next-line 
  },[data, selected]);


  const responsivefy = (svg) => {
    // Container is the DOM element, svg is appended.
    // Then we measure the container and find its
    // aspect ratio.
    const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10),
      aspect = width / height;

    // Add viewBox attribute to set the value to initial size
    // add preserveAspectRatio attribute to specify how to scale
    // and call resize so that svg resizes on page load
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    function resize() {
      const targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    }
  };

  function doExit() {
    d3.select(divRef.current).selectAll("svg").remove();
  }

  const draw = () => {

    const maxScale = data?.reduce(maxX(property.yprop), 0) || 0;
    // append element
    const svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    const margin = { y: 50, x: 50 };

    // axis
    const xScale = d3.scaleBand().padding(0.2);
    const yScale = d3.scaleLinear().domain([0, maxScale]); //max scale should be dynamic
    yScale.range([height, 0]);
    xScale.range([0, width]).domain(data.map((d) => d[property.xprop]));

    svg
      .attr("width", width + 2 * margin.x)
      .attr("height", height + 2 * margin.y)
      .call(responsivefy) // Call responsivefy to make the chart responsive
      .attr("id", "svg-bar");

    svg
      .append("text")
      .attr("x", width / 2 + margin.x)
      .attr("y", margin.y / 2)
      .attr("class", "title")
      .attr("text-anchor", "middle")
      .attr(title);

    svg
      .append("text")
      .attr("x", -(height / 2) - margin.y)
      .attr("y", margin.x / 2.4)
      .attr("transform", "rotate(-90)")
      .attr("class", "title")
      .text(ytitle);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.x},${margin.y})`);

    chart
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .style('font-size', 20)
      .call(d3.axisBottom(xScale));

    const path = chart.selectAll().data(data);

    path
      .enter()
      .append("rect").on('click', (e, d) => {
        handleDeliveryBarChartClick(d);
      })
      .attr('id', (d) => d?.fascia_anagrafica)
      .attr('opacity', (d) => {
        if(selected){
          return selected === d?.fascia_anagrafica ? 1 : 0.3
        }else{
          return 1
        }
      })
      .attr("class", "bar")
      .attr("x", (d) => xScale(d[property.xprop]))
      .attr("y", (d) => yScale(d[property.yprop]))
      .attr("height", (d) => height - yScale(d[property.yprop]))
      .attr("width", xScale.bandwidth())
      .append("title")
      .attr("x", (d) => xScale(d[property.xprop]))
      .attr("y", (d) => yScale(d[property.yprop]))
      .text((d) => `Fascia ${d[property.xprop]} totale: ${d[property.yprop]}`)

    path
      .enter()
      .append("text")
      .attr("class", "bartext")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("x", (d) => xScale(d[property.xprop]) + 35)
      .attr("y", (d) =>
        height - yScale(d[property.yprop]) >= 0
          ? yScale(d[property.yprop]) - 10
          : yScale(d[property.yprop])
      )
      .text((d) => d[property.yprop].toLocaleString('it'));

    path.exit().remove();
  };

  return (
    <div ref={divRef} className="chart svg-container">
      <svg ref={myRef} className="svg-content-responsive"></svg>
    </div>
  );
};
