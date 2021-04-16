import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../App.css";
import { maxX } from "../utils";

export const HBarChart = ({
  handleRectClick,
  height,
  width,
  data = [],
  selectedCodeCategory,
  property,
  title,
  ytitle,
}) => {
  const myRef = useRef();
  const divRef = useRef();

  useEffect(() => {
    doExit();
    draw();
    // eslint-disable-next-line
  }, [data, selectedCodeCategory]);

  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        wrapped = false,
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .attr("y", 15)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          wrapped = true;
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy",  "1.0em")
            .text(word);
        }
      }

      if (wrapped) text.attr("y", -1);
    });
  }

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
      .attr("viewBox", `-20 30 ${width} ${height}`)
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
    const margin = { y: 50, x: 220 };

    // Add X axis
    const xScale = d3
      .scaleLinear()
      .domain([0, maxScale])
      .range([0, width - 20]);
    // Y axis
    const yScale = d3
      .scaleBand()
      .paddingInner(0.8)
      .paddingOuter(0)
      .range([0, height])
      .domain(data?.map((d) => d[property.xprop]));

    svg
      .attr("width", width + 2 * margin.x)
      .attr("height", height + 2 * margin.y)
      .call(responsivefy) // Call responsivefy to make the chart responsive
      .attr("id", "svg-horizontal-bar");

    svg
      .append("text")
      .attr("x", width / 2 + margin.x)
      .attr("y", margin.y / 2)
      .attr("class", "hb-title")
      .attr("text-anchor", "middle")
      .attr(title);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.x},${margin.y})`);

    chart
      .append("g")
      .attr("class", "hb-axis")
      .call(d3.axisLeft(yScale))
      .selectAll(".tick text")
      .call(wrap, 150)
      .style("font-size", "18px")
      .attr("transform", `translate(85,0)`);

    const path = chart.selectAll().data(data);

    path
      .enter()
      .append("rect")
      .on("click", (e, d) => {
        handleRectClick(d);
      })
      .attr("opacity", (d) => {
        let opac =
          selectedCodeCategory === d.code ? 1 : !selectedCodeCategory ? 1 : 0.3;
        return opac;
      })
      .attr("class", "hb-bar")
      .attr("x", xScale(0) + 95)
      .attr("y", (d) => yScale(d[property.xprop]))
      .attr("width", (d) => xScale(d[property.yprop]))
      .attr("height", yScale.bandwidth() * 4)
      .append("hb-title")
      .attr("x", (d) => xScale(d[property.xprop]))
      .attr("y", (d) => yScale(d[property.yprop]))
      .text((d) => `Fascia ${d[property.xprop]} totale: ${d[property.yprop]}`);

    path
      .enter()
      .append("text")
      .attr("class", "hb-bartext")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("x", (d) => xScale(d[property.yprop]) + 140)
      .attr("y", (d) =>
        height - yScale(d[property.xprop]) >= 0
          ? yScale(d[property.xprop]) + 20
          : yScale(d[property.xprop])
      )
      .text((d) => d[property.yprop].toLocaleString("it"));

    path.exit().remove();
  };

  return (
    <div ref={divRef} className="chart svg-container" style={{ marginTop: 40 }}>
      <svg ref={myRef} className="svg-content-responsive"></svg>
    </div>
  );
};
