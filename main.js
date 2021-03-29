// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

var clean_data = {};

let create_graphs = (year=null) => {
  setData(year);
  build_map_graph(year);
  build_lollipop_graph(year);
}

d3.select("#update-year").on("click", function() {
  let year = d3.select("#year").property("value");
  if (year >= 1980 && year <= 2016) create_graphs(year); 
})

d3.select("#all-years").on("click", function() {
  create_graphs();
})

d3.csv(`./data/video_games.csv`).then(function(d) {
        // clean data
        clean_data = cleanData(d, comparator, 10, year);
        create_graphs(2010);
});

let trimName = (name, platform) => {
  return (name.length > 25) ? name.substring(0, 20).trim() + "..." + " (" + platform + ")"
 : name + " (" + platform + ")";
}

let comparator = (a,b) =>  parseFloat(a['Rank']) - parseFloat(b['Rank']);

let cleanData = (data) => {
  // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
  for (let i = 0; i < data.length; i++){
    data[i]['Rank'] = parseInt(data[i]['Rank']);
    data[i]['Name'] = trimName(data[i]['Name'], data[i]['Platform']);
    data[i]['Year'] = parseInt(data[i]['Year']);
    data[i]['Global_Sales'] = parseFloat(data[i]['Global_Sales']);
    data[i]['NA_Sales'] = parseFloat(data[i]['NA_Sales']);
    data[i]['EU_Sales'] = parseFloat(data[i]['EU_Sales']);
    data[i]['JP_Sales'] = parseFloat(data[i]['JP_Sales']);
    data[i]['Other_Sales'] = parseFloat(data[i]['Other_Sales']);
  }
  return data
}

