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

let selectedXAxis = "poverty";
let selectedYAxis = "healthcare";

function xScale(healthData,selectedXAxis){
    //create the scales for the x axis of the chart using d3 generator functions
    let xMin = d3.min(healthData,d => d[selectedXAxis]) - 1 ;
    let xMax = d3.max(healthData,d => d[selectedXAxis]) + 1 ;

    xlinearScale = d3.scaleLinear()
    .domain([xMin,xMax])
    .range([0,width]);

    return xlinearScale;
};

function yScale(healthData,selectedYAxis){
    //create the scales for the x axis of the chart using d3 generator functions
    let yMin = d3.min(healthData,d => d[selectedYAxis]) - 1 ;
    let yMax = d3.max(healthData,d => d[selectedYAxis]) + 1 ;

    ylinearScale = d3.scaleLinear()
    .domain([yMin,yMax])
    .range([height,0]);

    return ylinearScale;
};

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  };

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  };  

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

    //call xScale function to get the xAxis function, create the axes
    let bottomAxis = d3.axisBottom(xScale(healthData,selectedXAxis));
    let leftAxis = d3.axisLeft(yScale(healthData,selectedYAxis));

    // add the axes
    let xAxis = chartGroup.append("g")
    .attr("transform",`translate(0,${height})`) // move down or starts in upper left of chartgroup
    .call(bottomAxis) // call the bottomAxis function to generate an SVG in the shape of an axis

    let yAxis = chartGroup.append("g")
    //.attr("transform",`translate(0,${height})`) // move down or starts in upper left of chartgroup
    .call(leftAxis) // call the leftAxis function to generate an SVG in the shape of an axis

    // Create axes labels
    // y axis label
    let yLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left )
    .attr("x", 0 - (height / 1.5)) // mid way on the axis
    .attr("dy", "1em")
    .attr("id","yLabel")
    .classed("axisText",true)
    .text("Lacks Heakthcare(%)");
  
    // x axis label
    let xLabelGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let xPovertyLabel = xLabelGroup.append("text")
    .attr("y", 0)
    .attr("x",20) 
    .attr("id","xLabel")
    .classed("axisText",true)
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

    let labelGroup = chartGroup.append("g")

    // add the state to the circles
    let circleLabels = labelGroup.selectAll("text")
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