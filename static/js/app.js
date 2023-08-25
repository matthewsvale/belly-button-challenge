const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

const dataPromise = d3.json(url);

d3.json(url).then(function(data) {
	console.log(data);
});


function init() {
	
  let dropdownMenu = d3.select("#selDataset");
  
  d3.json(url).then((data) => {
  	console.log(`Data: ${data}`);
  
  	let names = data.names;
    
    names.forEach((name) => {
    	dropdownMenu.append("option").text(name).property("value", name);
    });
  
    let name = names[0];
    
    demo(name);
    bar(name);
    bubble(name);
    gauge(name);
  
  });
}

function demo(selectedValue) {
	d3.json(url).then((data) => {
  	console.log(`Data: $(data)`);
    
    	let metadata = data.metadata;
      let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      let obj = filteredData[0];
      
      d3.select("#sample-metadata").html("");
      
      let entries = Object.entries(obj);
      
      entries.forEach(([key,value]) => {
      	d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
      
      console.log(entries);
  });
}

function bar(selectedValue) {
	d3.json(url).then((data) => {
  	console.log(`Data: ${data}`);
    
    	let samples = data.samples;
      let filteredData = samples.filter((sample) => sample.id === selectedValue);
      let obj = filteredData[0];
     	
      let trace = [{
      	x: obj.sample_values.slice(0,10).reverse(),
        y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
        text: obj.otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
                color: "blue"
            },
     
      }];
      
      Plotly.newPlot("bar", trace);
  });
}

function bubble(selectedValue) {

    d3.json(url).then((data) => {

        let samples = data.samples;
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];
     
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Sunset"
            }
        }];
  
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
     
        Plotly.newPlot("bubble", trace, layout);
    });
}


function gauge(selectedValue) {
  
    d3.json(url).then((data) => {
        
        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let obj = filteredData[0];

        
        let trace = [{
            domain: { x: [0, 10], y: [0, 10] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number+delta",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "black"},
                steps: [
                    { range: [0, 2], color: "maroon" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "gold" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 10], color: "green" },
                
                ]
            }
        }];

        
         Plotly.newPlot("gauge", trace);
    });
}


function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue);
}

init();