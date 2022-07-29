const div = d3.select("#barras");


const width = (div.node().getBoundingClientRect().width);
const height = 4/5 * width;

const margin = {
    left: 80,
    right: 20,
    top: 50,
    bottom: 100,
};


let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


let xAxis = svg.append("g")
    .attr("class", "axis axis--x")
    .attr("fill", "#b4b9c2")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")");

    
let yAxis = svg.append("g")
    .attr("class", "axis axis--y")
    .attr("fill", "#b4b9c2")
    .attr("transform", "translate(" + margin.left + ",0)");

    let xLabel = xAxis.append("g")
    .append("text")
    .attr("class", "x axis-title")
    .style("font-size", "10px")
    .style("font-family", 'Open Sans',"sans-serif")
    .attr("fill", "#b4b9c2")
    .attr("display", "none")
    .attr("transform", `translate(${(width - margin.right) / 1}, 25)`);

    

let yLabel = yAxis.append("g")
    .append("text")
    .attr("class", "y axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .style("font-family", 'Open Sans',"sans-serif")
    .attr("fill", "#b4b9c2")
    .attr("display", "none")
    .attr("transform", `translate(30, ${margin.top}) rotate(0)`);
    

let tooltip = svg.append("text")
    .style("font-size", "10px")
    .style("font-family", 'Open Sans',"sans-serif");

Promise.all([
    d3.csv("https://raw.githubusercontent.com/crispdv9/d3js/main/datos-barras/datos/espmujer-1.csv")
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
        .domain([70, 90]);

    xAxis.call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.5em")
        .attr("dy", ".5em")
        .attr("fill", "#757a85")
        .attr("transform", "rotate(-90)");
    yAxis.call(d3.axisLeft(yScale))
    .selectAll("text")
    .attr("fill", "#757a85")
    ;
    xLabel.text(x)
    .selectAll("text")
   
    .attr("fill", "#757a85");
    yLabel.text(y)
    .selectAll("text")

    .attr("fill", "#757a85");

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
            tooltip.html(`<p><strong>Distrito</strong> ${d.Distrito}</p>
            <p><strong>Esperanza de vida en <b style="background-color:#f3c598;padding:1px 4px">mujeres</b></strong> ${d.mujer} años</p>
            <p><strong>Esperanza de vida en <b style="background-color:#112039;color:white;padding:1px 4px">hombres</b></strong> ${d.hombre} años</p>
           `)
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
