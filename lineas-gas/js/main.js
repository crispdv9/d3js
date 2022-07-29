const width = 600;
const height = 400;

const margin = {
    left: 60,
    right: 70,
    top: 10,
    bottom: 70
};

let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

let xAxis = svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")");

let yAxis = svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + margin.left + ",0)");

let xLabel = xAxis.append("g")
    .append("text")
    .attr("class", "x axis-title")
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(${(width - margin.right) / 2}, 25)`);

let yLabel = yAxis.append("g")
    .append("text")
    .attr("class", "y axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(10, ${margin.top}) rotate(-90)`);

let tooltip = svg.append("text")
    .style("font-size", "10px")
    .style("font-family", "sans-serif");

Promise.all([
    d3.csv("data/gas.csv")
]).then(function(datos) {

    let data = datos[0];
    console.log(data)

    let dateParse = d3.timeParse("%Y-%m-%d");

    const x = 'Fecha';
    const y = 'Total';

    data.forEach(d => {
        d.values.forEach(v => {
            v[x] = dateParse(v[x]);
        })
    });

    let xMin = d3.min(data, d => d3.min(d.values, v => v[x]));
    let xMax = d3.max(data, d => d3.max(d.values, v => v[x]));
    let yMin = d3.min(data, d => d3.min(d.values, v => v[y]));
    let yMax = d3.max(data, d => d3.max(d.values, v => v[y]));

    let xScale = d3.scaleTime()
        .range([margin.left, width - margin.right])
        .domain([xMin, xMax]);

    let yScale = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([yMin, yMax]);

    let line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d[x]))
        .y(d => yScale(d[y]));

    xAxis.call(
        d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%d/%m/%y"))
            .ticks(d3.timeMonth.every(6))
    );
    yAxis.call(d3.axisLeft(yScale));
    xLabel.text(x);
    yLabel.text(y);

    let curves = svg.selectAll(".curve")
        .data(data);

    curves.enter()
        .append("path")
        .attr("class", "curve")
        .attr("fill", "none")
        .attr("stroke-width", 2.0)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .style("opacity", 1.0)
        .attr("stroke", 'steelblue')
        .attr("d", d => line(d.values))
        .on("mousemove", (event, d) => {
            // Actualiza curvas
            d3.selectAll(".curve")
                .style("opacity", 0.2)
            d3.select(event.target)
                .style("opacity", 1.0);
            // Actualiza tooltip
            tooltip.attr('x', xScale(d.values[d.values.length - 1][x]) + 5)
                .attr("y", yScale(d.values[d.values.length - 1][y]))
                .text(d.region);
        })
        .on("mouseout", () => {
            // Actualiza barras
            d3.selectAll('.curve')
                .style("opacity", 1.0);
            // Actualiza tooltip
            tooltip.text('');
        });

    curves
        .attr("class", "curve")
        .attr("fill", "none")
        .attr("stroke-width", 2.0)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .style("opacity", 1.0)
        .attr("stroke", 'steelblue')
        .attr("d", d => line(d.values))
        .on("mousemove", (event, d) => {
            // Actualiza curvas
            d3.selectAll(".curve")
                .style("opacity", 0.2)
            d3.select(event.target)
                .style("opacity", 1.0);
            // Actualiza tooltip
            tooltip.attr('x', xScale(d.values[d.values.length - 1][x]) + 5)
                .attr("y", yScale(d.values[d.values.length - 1][y]))
                .text(d.region);
        })
        .on("mouseout", () => {
            // Actualiza barras
            d3.selectAll('.curve')
                .style("opacity", 1.0);
            // Actualiza tooltip
            tooltip.text('');
        });

    curves.exit().remove();
});