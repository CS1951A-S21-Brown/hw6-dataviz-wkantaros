// // GRAPH #2
// // Get top video games by NA, EU, JP
// The svg
let div_map = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

let svg_map = d3.select('#graph2')
    .append("svg")
    .attr('width', graph_2_width)
    .attr('height', graph_2_height)     

// Map and projection
let projection = d3.geoNaturalEarth()
    .scale(graph_2_width / 2.1 / Math.PI)
    .translate([graph_2_width / 2, graph_2_height / 1.8])

let build_map_graph = (year = null) => {

  let top_genre_by_region = {
    'JP': find_top_genres(clean_data, year, 'JP_Sales'),
    'EU': find_top_genres(clean_data, year, 'EU_Sales'),
    'NA': find_top_genres(clean_data, year, 'NA_Sales'),
    'Other': find_top_genres(clean_data, year, 'Other_Sales')
  };

  // Load external data and boot
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(d){
    // Draw the map
    svg_map.append("g")
    .selectAll("path")
    .data(d.features)
    .enter().append("path")
    .attr("d", d3.geoPath()
    .projection(projection)
    )
    .attr("class", "popup")
    .attr("fill", (d) => {
      return region_color[getRegion(d.properties.name)]
    })
    .style("stroke", "#fff")
    .on("mouseover", function(d) {	
      d3.select(this)
      .attr("fill", region_color_hover[getRegion(d.properties.name)])

      div_map.transition()		
          .duration(200)		
          .style("opacity", .9);
      div_map.html("Country: " + d.properties.name + "<br/>" +
            "Region: " + idToRegion[getRegion(d.properties.name)] +
            "<br/>" + 
            "Top genre: " + top_genre_by_region[getRegion(d.properties.name)]
          )	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY) + "px");					
    })		
    .on("mouseout", function(d) {		
      d3.select(this)
      .attr("fill", region_color[getRegion(d.properties.name)]);
      div_map.transition()		
          .duration(200)		
          .style("opacity", 0);		
    });
  });
  year ? d3.select('.g2-title').text(`Top Genre by Region in ${year}`) : d3.select('.g2-title').text(`Top Genre by Region`);
}

const HOVER_COLOR = '#555';
const OG_COLOR = '#69b3a2';

let find_top_genres = (data, year, sales_col) => {
  if (year)
    return get_top_g(data.filter(row => row['Year'] == year), sales_col);
  else
    return get_top_g(data, sales_col);

}

let get_top_g = (data, sales_col) => {
  let genre = {};
  for (let i = 0; i < data.length; i++){
    if (genre.hasOwnProperty(data[i]['Genre']))
      genre[data[i]['Genre']] += data[i][sales_col];
    else
      genre[data[i]['Genre']] = data[i][sales_col];
  }
  let max = 0;
  let topGenre = "";
  for (const property in genre) {
    if (genre[property] > max) {
      max = genre[property];
      topGenre = property;
    }
  }
  return topGenre;
}

let region_color = {
  'JP': '#E56399',
  'NA': '#ADFCF9',
  'EU': '#33C3F0',
  'Other': '#70E0F5'
  // 'Other': '#4357AD'
  // 'Other': '#585481',
  // 'Other': '#297373',
  // 'Other': '#F6E4F6',
};

let region_color_hover = {
  'JP': '#f4bdd4',
  'NA': '#d6fefc',
  'EU': '#60d0f3',
  'Other': '#a8ecf9'
};

let idToRegion = {
  'JP': 'Japan',
  'NA': 'North America',
  'EU': 'Europe',
  'Other': 'Other'
}