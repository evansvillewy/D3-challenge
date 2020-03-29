let dataFile = "./assets/data/data.csv";
///* relied heavily on hairband class activity to complete this homework */
// set up the overall chart size
let svgHeight = 500;
let svgWidth = 900;

let margin = {
    top:20,
    right:40,
    bottom:100,
    left:100
}

// set the chart size
let height = svgHeight - (margin.top + margin.bottom);
let width = svgWidth - (margin.right + margin.left);

// add the SVG wrapper to the DOM
let svg =d3.select("#scatter")
.append("svg")
.attr("width",svgWidth)
.attr("height",svgHeight )

//initial params
let selectedXAxis = "poverty";
let selectedYAxis = "healthcare";

function xScale(healthData,selectedXAxis){
    //create the scales for the x axis of the chart using d3 generator functions
    if (selectedXAxis === "poverty") {
        xMin = 8;
        xMax = 24;
    }
    else if(selectedXAxis === "age"){
        xMin = 27;
        xMax = 48;
    }
    else{
        xMin = 35000;
        xMax = 81000;
    }

    xlinearScale = d3.scaleLinear()
    .domain([xMin,xMax])
    .range([0,width]);

    return xlinearScale;
};

function yScale(healthData,selectedYAxis){
    //create the scales for the y axis of the chart using d3 generator functions

    if (selectedYAxis === "healthcare") {
        yMin = 3;
        yMax = 27;
    }
    else if(selectedYAxis === "smokes"){
        yMin = 9;
        yMax = 29;
    }
    else{
        yMin = 19;
        yMax = 39;
    }

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

// function used for updating nodes (circles & text) with a transition to
// new circles
function renderNodes(nodes, newXScale, newYScale,selectedXAxis,selectedYAxis) {

    nodes.transition()
    .duration(1000)
    .attr("transform", function(d) {
        // Set d.x and d.y here so that other elements can use it. d is 
        // expected to be an object here.
        d.x = newXScale(d[selectedXAxis]),
        d.y = newYScale(d[selectedYAxis]);
        return "translate(" + d.x + "," + d.y + ")";});    

  return nodes;
}

// add chart group to svg wrapper, transform by defined margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read in the data 
d3.csv(dataFile).then(function(healthData){

    // set healthcare% and poverty% to number by adding the value to zero (javascript behavior)
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });

    //call xScale function to get the xAxis function, create the axes
    let bottomAxis = d3.axisBottom(xScale(healthData,selectedXAxis));
    let leftAxis = d3.axisLeft(yScale(healthData,selectedYAxis));

    // add the axes
    let xAxis = chartGroup.append("g")
    .attr("transform",`translate(0,${height})`) // move down or starts in upper left of chartgroup
    .call(bottomAxis) // call the bottomAxis function to generate an SVG in the shape of an axis

    let yAxis = chartGroup.append("g")
    .call(leftAxis); // call the leftAxis function to generate an SVG in the shape of an axis

    // y axis label group with 3 axis
    let yLabelGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

    // Create y axes labels
    let yhealthcareLabel = yLabelGroup.append("text")
    .attr("y", 0 - margin.left+55 )
    .attr("x", 0 - (height / 1.5)) // mid way on the axis
    .attr("value", "healthcare") // value for event listener
    .attr("dy", "1em")
    .attr("id","yLabel")
    .classed("activeLabel",true)
    .text("Lacks Healthcare(%)");
  
    let ysmokesLabel = yLabelGroup.append("text")
    .attr("y", 0 - margin.left+35 )
    .attr("x", 0 - (height / 1.7)) // mid way on the axis
    .attr("value", "smokes") // value for event listener
    .attr("dy", "1em")
    .attr("id","yLabel")
    .classed("inactiveLabel",true)
    .text("Smokes(%)");

    let yobeseLabel = yLabelGroup.append("text")
    .attr("y", 0 - margin.left+15 )
    .attr("x", 0 - (height / 1.8)) // mid way on the axis
    .attr("value", "obesity") // value for event listener
    .attr("dy", "1em")
    .attr("id","yLabel")
    .classed("inactiveLabel",true)
    .text("Obese(%)");    

    // x axis label group with 3 axis
    let xLabelGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let xPovertyLabel = xLabelGroup.append("text")
    .attr("y", 20)
    .attr("x",0) 
    .attr("value", "poverty") // value for event listener
    .attr("id","xLabel")
    .classed("activeLabel",true)
    .text("In Poverty(%)");

    let xAgeLabel = xLabelGroup.append("text")
    .attr("y", 40)
    .attr("x",0) 
    .attr("value", "age") // value for event listener
    .attr("id","xLabel")
    .classed("inactiveLabel",true)
    .text("Age(Median)");

    let xIncomeLabel = xLabelGroup.append("text")
    .attr("y", 60)
    .attr("x",-50) 
    .attr("value", "income") // value for event listener
    .attr("id","xLabel")
    .classed("inactiveLabel",true)
    .text("Household Income(Median)");

    // append circles and text to same g element
    // https://stackoverflow.com/questions/11857615/placing-labels-at-the-center-of-nodes-in-d3-js
    let nodes = chartGroup.append("g")
    .selectAll("circle")
    .data(healthData)
    .enter()
    .append("g")
    .attr("class","nodes")
    .attr("transform", function(d) {
        // Set d.x and d.y here so that other elements can use it. d is 
        // expected to be an object here.
        d.x = xlinearScale(d.poverty),
        d.y = ylinearScale(d.healthcare);
        return "translate(" + d.x + "," + d.y + ")";});

    // Add a circle element to the previously added g element.
    let circleGroup = nodes.append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill","LightBlue");    

    //add the state to the circles
    let circleLabels = nodes.append("text")
    .attr("text-anchor", "middle")
    .text(function(d) {return d.abbr;})
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("fill", "white");      

  // x axis labels event listener
  xLabelGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== selectedXAxis) {

        // replaces chosenXAxis with value
        selectedXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, selectedXAxis);
        yLinearScale = yScale(healthData, selectedYAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        nodes = renderNodes(nodes, xLinearScale, yLinearScale, selectedXAxis,selectedYAxis);

        // changes classes to change bold text
        if (selectedXAxis === "poverty") {
          xPovertyLabel
            .classed("activeLabel", true)
            .classed("inactiveLabel", false);
          xAgeLabel
            .classed("activeLabel", false)
            .classed("inactiveLabel", true);
          xIncomeLabel
            .classed("activeLabel", false)
            .classed("inactiveLabel", true);
        }
        else if (selectedXAxis === "age") {
          xPovertyLabel
            .classed("activeLabel", false)
            .classed("inactiveLabel", true);
          xAgeLabel
            .classed("activeLabel", true)
            .classed("inactiveLabel", false);
          xIncomeLabel
            .classed("activeLabel", false)
            .classed("inactiveLabel", true);
        }
        else {
          xPovertyLabel
            .classed("activeLabel", false)
            .classed("inactiveLabel", true);
          xAgeLabel
            .classed("activeLabel", false)
            .classed("inactiveLabel", true);
          xIncomeLabel
            .classed("activeLabel", true)
            .classed("inactiveLabel", false);          
        }
      }
    });

      // x axis labels event listener
  yLabelGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== selectedYAxis) {

      // replaces chosenXAxis with value
      selectedYAxis = value;

      console.log(`selectedXAxis ${selectedXAxis}`);
      console.log(`selectedYAxis ${selectedYAxis}`);

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(healthData, selectedXAxis);
      yLinearScale = yScale(healthData, selectedYAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      nodes = renderNodes(nodes, xLinearScale, yLinearScale, selectedXAxis,selectedYAxis);

      // changes classes to change bold text
      if (selectedYAxis === "healthcare") {
        yhealthcareLabel
          .classed("activeLabel", true)
          .classed("inactiveLabel", false);
        ysmokesLabel
          .classed("activeLabel", false)
          .classed("inactiveLabel", true);
        yobeseLabel
          .classed("activeLabel", false)
          .classed("inactiveLabel", true);
      }
      else if (selectedYAxis === "smokes") {
        yhealthcareLabel
          .classed("activeLabel", false)
          .classed("inactiveLabel", true);
        ysmokesLabel
          .classed("activeLabel", true)
          .classed("inactiveLabel", false);
        yobeseLabel
          .classed("activeLabel", false)
          .classed("inactiveLabel", true);
      }
      else {
        yhealthcareLabel
          .classed("activeLabel", false)
          .classed("inactiveLabel", true);
        ysmokesLabel
          .classed("activeLabel", false)
          .classed("inactiveLabel", true);
        yobeseLabel
          .classed("activeLabel", true)
          .classed("inactiveLabel", false);          
      }
    }
  });

}).catch(function(error) {
  console.log(error);
});