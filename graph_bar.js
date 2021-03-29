
// GRAPH #1
// TOP 10 video games of all time or top 10 for a specific year. (will be interactive w toggle)
// TODO: Set up SVG object with width, height and margin
let svg_bar = d3.select('#graph1')
    .append("svg")
    .attr('width', graph_1_width)     // HINT: width
    .attr('height', graph_1_height)     // HINT: height
    .append("g")
    .attr('transform', `translate(${margin.left + 40}, ${margin.top})`);    // HINT: transform

// tooltip
let div_bar = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// TODO: Create a linear scale for the x axis (number of occurrences)
let x_bar = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y_bar = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability
/*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
 */

// Set up reference to count SVG group
let countRef_bar = svg_bar.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label_bar = svg_bar.append("g");

// x-axis label
svg_bar.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
            ${(graph_1_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Count (millions)");

// y-axis label
let y_axis_text_bar = svg_bar.append("text")
    .attr("transform", `translate(-190, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

// chart title
let title_bar = svg_bar.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);
/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
 */

/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */
function setData(year=null) {
    // TODO: Clean and strip desired amount of data for barplot
    data_bar = stripData(clean_data, comparator, 10, year);
    // TODO: Update the x axis domain with the max count of the provided data
    x_bar.domain([0,  d3.max(data_bar, d => d['Global_Sales'])]);

    // TODO: Update the y axis domains with the desired attribute
    y_bar.domain(data_bar.map(d => d['Name']));

    // TODO: Render y-axis label
    y_axis_label_bar.call(d3.axisLeft(y_bar).tickSize(0).tickPadding(10));

    /*
        This next line does the following:
            1. Select all desired elements in the DOM
            2. Count and parse the data values
            3. Create new, data-bound elements for each data value
      */
    let bars = svg_bar.selectAll("rect").data(data_bar);

    // OPTIONAL: Adding color
    let color = d3.scaleOrdinal()
        .domain(data_bar.map(function(d) { return d['Name'] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    // Render the bar elements on the DOM
    bars.enter()
        .append("rect")
        .on('mouseover', function(d) {
          d3.select(this).attr('opacity', 0.8)
          div_bar.transition()		
            .duration(200)		
            .style("opacity", .9);
          div_bar.html(`Percentage of Total Sales: ${d.percentage}%<br/>Genre: ${d.Genre}`)
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY) + "px");	
        })
        .on('mouseout', function(d) {
          d3.select(this).attr('opacity', 1)
          div_bar.transition()		
          .duration(200)		
          .style("opacity", 0);		
        })
        .merge(bars)
        .attr("fill", d => color(d.Name))
        .transition()
        .duration(1000)
        .attr("x", x_bar(0))
        .attr("y", d => y_bar(d.Name))
        .attr("width", d => x_bar(d.Global_Sales))
        .attr("height",  y_bar.bandwidth());

    /*
        In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
        bar plot. We will be creating these in the same manner as the bars.
      */
    let counts = countRef_bar.selectAll("text").data(data_bar);

    // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", d => x_bar(d.Global_Sales) + 8)
        .attr("y", d => y_bar(d.Name) + 12)
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .text(d => d.Global_Sales);

    y_axis_text_bar.text('Game');
    year ? title_bar.text(`Top 10 Video Games in ${year}`) : title_bar.text(`Top 10 Video Games of all Time`);

    // Remove elements not in use if fewer groups in new dataset
    bars.exit().remove();
    counts.exit().remove();
}

/**
 * strips to first numExamples given the provided comparator and year
 */
let stripData = (data, comparator, numExamples, year) => {
  console.log('her')
  if (year)
    data = data.filter(row => row['Year'] == year);
  data = addPercentages(data);
  data.sort(comparator);
  console.log(data.slice(0,numExamples));
  return data.slice(0,numExamples);
}

let addPercentages = (data) => {
  total_sales = 0.0;
  for (let i = 0; i < data.length; i++){
    total_sales += data[i]['Global_Sales'];
  }
  for (let i = 0; i < data.length; i++){
    data[i]['percentage'] = parseFloat((100*data[i]['Global_Sales']/total_sales).toFixed(3));
  }
  return data;
}