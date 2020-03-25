let dataFile = "./assets/data/data.csv";

// set up the overall chart size
let svgHeight = 500;
let svgWidth = 960;

let margin = {
    top:20,
    right:40,
    bottom:60,
    left:50
}

// set the chart size
let height = svgHeight - (margin.top + margin.bottom);
let width = svgWidth - (margin.right + margin.left);

// add the SVG wrapper to the DOM
let svg =d3.select("#scatter")
.append("svg")
.attr("width",svgWidth)
.attr("height",svgHeight )

// add chart group to svg wrapper, transform by defined margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read in the data 
d3.csv(dataFile).then(function(healthData){

    // set healthcare% and poverty% to number by adding the value to zero (javascript behavior)
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    console.log(healthData);

    //create the scales for the x & y axies of the chart using d3 generator functions
    let poverty = healthData.map(d=>d.poverty);
    let healthcare = healthData.map(d=>d.healthcare);

    let xMin = Math.min(...poverty) - 1 ;
    let xMax = Math.max(...poverty) + 1 ;
    let yMin = Math.min(...healthcare) - 1 ;
    let yMax = Math.max(...healthcare) + 1 ;

    xlinearScale = d3.scaleLinear()
    .domain([xMin,xMax])
    .range([0,width]);
    ylinearScale = d3.scaleLinear()
    .domain([yMin,yMax])
    .range([height,0]);

    //create the axes
    let xAxis = d3.axisBottom(xlinearScale)
    let yAxis = d3.axisLeft(ylinearScale)

    // add the axes
    chartGroup.append("g")
    .attr("transform",`translate(0,${height})`) // move down or starts in upper left of chartgroup
    .call(xAxis) // call the xAxis function to generate an SVG in the shape of an axis

    chartGroup.append("g")
    //.attr("transform",`translate(0,${height})`) // move down or starts in upper left of chartgroup
    .call(yAxis) // call the xAxis function to generate an SVG in the shape of an axis

    // Create axes labels
    // y axis label
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left )
    .attr("x", 0 - (height / 1.5)) // mid way on the axis
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Heakthcare(%)");
  
    // x axis label
    chartGroup.append("text")
    .attr("y", height + margin.top + 30 )
    .attr("x", width / 2.5) // mid way on the axis
    .attr("class", "axisText")
    .text("In Poverty(%)");
        
    // add the circles to the chartGroup
    let circleGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cy",d => ylinearScale(d.healthcare))
    .attr("cx",d => xlinearScale(d.poverty))
    .attr("r","10")
    .attr("fill","LightBlue");

    let textGroup = chartGroup.append("g")

    // add the state to the circles
    let circleLabels = textGroup.selectAll("text")
    .data(healthData)
    .enter()
    .append("text")    
    .attr("y", function(d) {return ylinearScale(d.healthcare-.1);})
    .attr("x", function(d) {return xlinearScale(d.poverty-.1);})    
    .text(function(d) {return d.abbr;})
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black");
});