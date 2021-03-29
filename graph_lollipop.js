
// GRAPH #1
// TOP 10 video games of all time or top 10 for a specific year. (will be interactive w toggle)
// TODO: Set up SVG object with width, height and margin
let svg_pop = d3.select('#graph3')
    .append("svg")
    .attr('width', graph_3_width)     // HINT: width
    .attr('height', graph_3_height)     // HINT: height
    .append("g")
    .attr('transform', `translate(${margin.left-50}, ${margin.top})`);    // HINT: transform

// TODO: Create a linear scale for the x axis (number of occurrences)
let x_pop = d3.scaleLinear()
    .range([0, graph_3_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y_pop = d3.scaleBand()
    .range([0, graph_3_height - margin.top - margin.bottom])
    .padding(0.9);  // Improves readability
/*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
 */

// Set up reference to count SVG group
let countRef_pop = svg_pop.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label_pop = svg_pop.append("g");

let x_axis_label_pop = svg_pop.append("g")
  .attr("transform", `translate(0,${graph_3_height - margin.top - margin.bottom})`);

// x-axis label
svg_pop.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
            ${(graph_3_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Publisher sales (millions)");

// y-axis label
let y_axis_text_pop = svg_pop.append("text")
    .attr("transform", `translate(-90, ${(graph_3_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

// chart title
let title_pop = svg_pop.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)
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
let build_lollipop_graph = (year=null) => {
    // TODO: Clean and strip desired amount of data for barplot
    let data_pop = get_publisher_data(clean_data, year);
    // TODO: Update the x axis domain with the max count of the provided data
    x_pop.domain([0, d3.max(data_pop, d => d['sales'])]);

    // TODO: Update the y axis domains with the desired attribute
    y_pop.domain(data_pop.map(d => d['genre']));

    // render x axis
    x_axis_label_pop.transition().duration(1000).call(d3.axisBottom(x_pop));
    // TODO: Render y-axis label
    // y_axis_label_pop.call(d3.axisLeft(y_pop).tickSize(0).tickPadding(10));
    y_axis_label_pop.call(d3.axisLeft(y_pop).tickSize(0).tickPadding(10));

    // // Render the bar elements on the DOM
    // Lines
    let lines = svg_pop.selectAll(".myline").data(data_pop);
    let circles = svg_pop.selectAll("circle").data(data_pop);
    
    lines.enter()
        .append("line")
        .attr("class", "myline")
        .merge(lines)
        .transition()
        .duration(1000)
        .attr("x1", x_pop(0))
        .attr("x2", d => x_pop(d.sales))
        .attr("y1", d => y_pop(d.genre))
        .attr("y2", d => y_pop(d.genre))
        .attr("stroke", "grey")

    // Circles
    circles.enter()
        .append("circle")
        .merge(circles)
        .transition()
        .duration(1000)
        .attr("cx", d => x_pop(d.sales))
        .attr("cy", d => y_pop(d.genre))
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "grey")

    /*
        In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
        bar plot. We will be creating these in the same manner as the bars.
      */
    let counts = countRef_pop.selectAll("text").data(data_pop);

    // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", d => x_pop(d.sales) + 8)
        .attr("y", d => y_pop(d.genre) + 12)
        .style("text-anchor", "start")
        .style("font-size", "12px")
        .text(d => d.publisher);

    y_axis_text_pop.text('Genre');
    year ? title_pop.text(`Top Publishers by Genre in ${year}`) : title_pop.text(`Top Publishers by Genre`);

    // Remove elements not in use if fewer groups in new dataset
    lines.exit().remove();
    circles.exit().remove();
    counts.exit().remove();
}

let get_publisher_data = (data, year) => {
    if (year) data = data.filter(row => row['Year'] == year);
    let genres = get_all_genres(data);
    let publishers = []
    for (genre of genres){
        let vals = getBestPublisher(data,genre)
        publishers.push({
            'genre': genre,
            'publisher': vals[0],
            'sales': parseFloat(vals[1].toFixed(2))
        });
    }
    return publishers;

}

let get_all_genres = (data) => {
    let genres = new Set();
    for (row of data) genres.add(row['Genre'])
    return genres;
}

// returns [publisherName, totalSales]
let getBestPublisher = (data, genre) => {
    let genreData = data.filter(row => row['Genre'] == genre);
    let p_in_g = {};
    for (let i = 0; i < genreData.length; i++){
        if (p_in_g.hasOwnProperty(genreData[i]['Publisher']))
            p_in_g[genreData[i]['Publisher']] += genreData[i]['Global_Sales'];
        else
            p_in_g[genreData[i]['Publisher']] = genreData[i]['Global_Sales'];
    }
    let max = 0;
    let topPublisher = "";
    for (const property in p_in_g) {
        if (p_in_g[property] > max) {
            max = p_in_g[property];
            topPublisher = property;
        }
    }
    return [topPublisher, max];
}
