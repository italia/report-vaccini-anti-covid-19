import { React, useEffect, useRef } from "react";
import * as d3 from "d3";

export const StackedBarChart = ({
  height,
  width,
  data,
  keys,
  colors,
  selectedFrom,
  selectedTo,
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
  }, [data, keys, selectedFrom, selectedTo]);


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
      .attr("viewBox", `0 0 ${width} ${height+10}`)
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

    const dataset = d3.stack().keys(keys)(data.slice(selectedFrom, selectedTo));

    // append element
    const svg = d3
      .select(divRef.current)
      .append("svg")
      .style('margin-bottom', 15)
      .attr("width", width)
      .attr("height", height);
    const margin = { y: 50, x: 50 };

    // axis
    const xScale = d3.scaleBand().padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(data.slice(selectedFrom, selectedTo), function(d) { return d.total; })]);
    yScale.range([height, 0]);
    xScale.range([0, width]).domain(data.slice(selectedFrom, selectedTo).map((d) => d.label));

    svg
      .attr("width", width + 2 * margin.x)
      .attr("height", height + 2 * margin.y)
      .call(responsivefy) // Call responsivefy to make the chart responsive
      .attr("id", "svg-stack-bar");

    svg
      .append("text")
      .attr("x", width / 2 + margin.x)
      .attr("y", margin.y / 2)
      .attr("class", "title")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(90)")
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
      .style('font-size', 16)
      .call(d3.axisBottom(xScale))
        .selectAll("text") // x axis label rotation
            .attr("y", -5)
            .attr("x", 11)
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");


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

    const path = chart.selectAll().data(dataset);

    path
      .enter()
      .append("g")
      .attr("fill", function(d) {
        return colors[d.key];
      })
      .attr("supply", function(d) {
        return d.key;
      })
      .selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter().append("rect")
      .attr("x", function(d) {
        return xScale(d.data.label);
      })
      .attr("y", function(d) {
        return yScale(d[1]);
      })
      .attr("height", function(d) {
        return yScale(d[0]) - yScale(d[1]);
      })
      .attr("width", xScale.bandwidth())
      .on('mouseover', function (d, i) {
        d3.select(this).transition().attr('fill', '#0BD9D3');
      })
      .on('mousemove', function (event, d) {
        tooltip
            .style('top', event.pageY - 10 + 'px')
            .style('left', event.pageX + 10 + 'px');
        tooltip
          .html(
            `<div style="text-align: center"><b>${d3.select(this.parentNode).attr("supply")}</b></div>
            <div>${(d[1] - d[0]).toLocaleString('it')} su ${d.data.total.toLocaleString("it")}</div>
            <div style="text-align: center; font-size: 12px">dal ${(d.data.labelfrom)} al ${d.data.labelto}</div>`
          )
          .style('display', null);
      })
      .on('mouseout', function (d) {
          tooltip.html(``).style('display', 'none');
          d3.select(this).transition().attr('fill', colors[d.key]);
      });
    path.exit().remove();
  };

  return (
    <div ref={divRef} className="chart svg-container">
      <svg ref={myRef} className="svg-content-responsive"></svg>
    </div>
  );
};
