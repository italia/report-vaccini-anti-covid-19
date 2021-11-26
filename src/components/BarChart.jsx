import { React, useEffect, useRef } from "react";
import * as d3 from "d3";
import "../App.css";

export const BarChart = ({
  handleRectClick,
  height,
  width,
  data,
  selectedCodeAge,
  regionSelected
  }) => {

  const myRef = useRef();
  const divRef = useRef();

  useEffect(() => {
      doExit();
      draw();
  // eslint-disable-next-line
  },[data, selectedCodeAge]);


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

    // append element
    const svg = d3
      .select(divRef.current)
      .append("svg")
      .style('margin-bottom', 10)
      .attr("width", width)
      .attr("height", height);
    const margin = { y: 30, x: 60 };


    const xScale = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.guariti; })]);
    const yScale = d3.scaleBand().padding(0.2);
    xScale.range([0, width]);
    yScale.range([0, height]).domain(data.map((d) => d.label));

    svg
      .attr("width", width + 2 * margin.x)
      .attr("height", height + 2 * margin.y)
      .call(responsivefy) // Call responsivefy to make the chart responsive
      .attr("id", "svg-stack-bar");


    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.x},${margin.y})`);

    chart
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, 0)`)
      .style("font-size", "12px")
      .call(d3.axisLeft(yScale))
      .attr('stroke-width', 0)
        .selectAll("text")
            .attr("y", 0)
            .attr("x", -30)
            .style("text-anchor", "start")
            .style("fill", "#19191a");

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('display', 'none')
      .style('padding', '10px')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('border-radius', '4px')
      .style('color', '#fff');

    const path = chart.selectAll().data(data);

    path
      .enter()
      .append("g")
      .attr("fill", "#77b2f2")
      .selectAll("rect")
      .data(data)
      .enter().append("rect")
      .on("click", (e, d) => {
        handleRectClick(d);
        tooltip.html(``).style('display', 'none');
      })
      .attr("opacity", (d) => {
        const ageCode = d.label.toLowerCase().replaceAll(' ', '_');

        let opac = selectedCodeAge === ageCode ? 1 : !selectedCodeAge ? 1 : 0.1;
        return opac;
      })
      .attr("x", function(d) {
        return 60;
      })
      .attr("y", function(d) {
        return yScale(d.label);
      })
      .attr("width", function(d) {
        return xScale(d.guariti);
      })
      .attr("height", yScale.bandwidth())
      .on('mousemove', function (event, d) {
        let regione = regionSelected ? " " + regionSelected : "";

        tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
        tooltip
          .html(
              `<div style="text-align: center; line-height: 1.15rem;">
              <div style="font-size: 12px;">${regione} ${d.label}</div>
              <div style="font-size: 14px;"><b>${d.guariti.toLocaleString('it')}</b></div>`
          )
          .style('display', null);
      })
      .on('mouseout', function (d) {
        tooltip.html(``).style('display', 'none');
    });

    path.exit().remove();
  };

  return (
    <div ref={divRef} className="chart svg-container">
      <svg ref={myRef} className="svg-content-responsive"></svg>
    </div>
  );
};
