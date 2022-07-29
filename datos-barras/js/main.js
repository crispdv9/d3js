const width = 500;
const height = 400;

const margin = {
    left: 60,
    right: 20,
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
    d3.csv("https://raw.githubusercontent.com/fbecerra/dataexperiments/master/data/ingresos.csv")
]).then(function(datos) {
    let data = datos[0];

    const x = 'Tramos de ingresos en pesos ($)';
    const y = 'Proporción de personas ocupadas (%)';

    data.forEach(d => {
        d[y] = +d[y];
    });

    let xVars = data.map(d => d[x]);

    let xScale = d3.scaleBand()
        .padding(0.1)
        .range([margin.left, width - margin.right])
        .domain(xVars);

    let yScale = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0, 20]);

    xAxis.call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-35)");
    yAxis.call(d3.axisLeft(yScale));
    xLabel.text(x);
    yLabel.text(y);

    let bars = svg.selectAll(".bar")
        .data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[x]))
        .attr("y", d => yScale(d[y]))
        .attr("height", d => height - margin.bottom - yScale(d[y]))
        .attr("width", xScale.bandwidth())
        .style('fill', 'steelblue')
        .on("mousemove", (event, d) => {
            // Actualiza barras
            d3.select(event.target)
                .style("fill", "red");
            // Actualiza tooltip
            tooltip.attr('x', xScale(d[x]))
                .attr("y", yScale(d[y]) - 10)
                .text(d[y] + '%');
        })
        .on("mouseout", () => {
            // Actualiza barras
            d3.selectAll('.bar')
                .style("fill", "steelblue");
            // Actualiza tooltip
            tooltip.text('');
        });

    bars
        .attr("class", "bar")
        .attr("x", d => xScale(d[x]))
        .attr("y", d => yScale(d[y]))
        .attr("height", d => height - margin.bottom - yScale(d[y]))
        .attr("width", xScale.bandwidth())
        .style('fill', 'steelblue')
        .on("mousemove", (event, d) => {
            // Actualiza barras
            d3.select(event.target)
                .style("fill", "red");
            // Actualiza tooltip
            tooltip.attr('x', xScale(d[x]))
                .attr("y", yScale(d[y]) - 10)
                .text(d[y] + '%');
        })
        .on("mouseout", () => {
            // Actualiza barras
            d3.selectAll('.bar')
                .style("fill", "steelblue");
            // Actualiza tooltip
            tooltip.text('');
        });

    bars.exit().remove();
})