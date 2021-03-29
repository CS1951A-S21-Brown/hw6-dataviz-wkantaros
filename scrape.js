// use this to get a list of all countries
// then go by hand to decide which fall into which category (run it on node), honestly was the fastest way


const https = require('https');

let url = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

countries = []

https.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let features = JSON.parse(body).features;
            // do something with JSON
            for (let i = 0; i < features.length; i++) {
              // Runs 5 times, with values of step 0 through 4.
              // console.log(features[i].properties.name);
              countries.push(features[i].properties.name);
            }
            for (country of countries) {
              console.log(`"${country}",`)
            }
            // console.log(countries)
            // console.log(features.length)
        } catch (error) {
            console.error(error.message);
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});