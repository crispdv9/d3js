const width = 500;
const height = 400;

const margin = {
    left: 80,
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
    .attr("transform", `translate(${(width - margin.right) / 1}, 50)`);

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
    d3.csv("https://raw.githubusercontent.com/crispdv9/d3js/main/datos-barras/datos/esper-puntos.csv")
]).then(function(datos) {
    let data = datos[0];

    const x = 'Distrito';
    const y = 'mujer';

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
        .domain([60, 100]);

    xAxis.call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)");
    yAxis.call(d3.axisLeft(yScale));
    xLabel.text(x);
    yLabel.text(y);

    let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("z-index", 1)
    .style("left", 0)
    .style("top", 0);

    let bars = svg.selectAll(".bar")
        .data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[x]))
        .attr("y", d => yScale(d[y]))
        .attr("height", d => height - margin.bottom - yScale(d[y]))
        .attr("width", xScale.bandwidth())
        .style('fill', '#f3c598')
        .on("mousemove", (event, d) => {
            // Actualiza barras
            d3.select(event.target)
                .style("fill", "#ba8959");
            // Actualiza tooltip
            //toltip
            tooltip.html(`<p><strong>Región</strong> ${d.region}</p>
            <p><strong>Population</strong> ${d.Total}</p>
            <p><strong>GDP per capita</strong> ${d.x}</p>
            <p><strong>Life expectancy</strong> ${d.y}</p>`)
            .style("left", (event.pageX + 10) + 'px')
            .style("top", event.pageY + 'px')
            .style("display", "block");
        })
        .on("mouseout", () => {
            // Actualiza barras
            d3.selectAll('.bar')
                .style("fill", "#f3c598");
            // Actualiza tooltip
            tooltip.style("display", "none");
        });

    bars
        .attr("class", "bar")
        .attr("x", d => xScale(d[x]))
        .attr("y", d => yScale(d[y]))
        .attr("height", d => height - margin.bottom - yScale(d[y]))
        .attr("width", xScale.bandwidth())
        .style('fill', '#f3c598')
        .on("mousemove", (event, d) => {
            // Actualiza barras
            d3.select(event.target)
                .style("fill", "#ba8959");
            // Actualiza tooltip
            tooltip.attr('x', xScale(d[x]))
                .attr("y", yScale(d[y]) - 10)
                .text(d[y] + ' años');
        })
        .on("mouseout", () => {
            // Actualiza barras
            d3.selectAll('.bar')
                .style("fill", "#f3c598");
            // Actualiza tooltip
            tooltip.text('');
        });

    bars.exit().remove();
})