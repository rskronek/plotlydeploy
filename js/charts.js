const data_file = "js/samples.json";

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(data_file).then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json(data_file).then((data) => {
        const metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        const result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        const PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function buildBarChart(sample_values, otu_ids, otu_labels) {
    otu_ids = otu_ids.slice(0, 10).reverse().map(id => 'OTU ' + id + ' ');
    console.log(otu_ids);

    otu_labels = otu_labels.slice(0, 10).reverse();
    console.log(otu_labels);

    sample_values = sample_values.slice(0, 10).reverse();
    console.log(sample_values);

    const barTrace = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        name: "Bacteria",
        type: "bar",
        orientation: "h",
        marker: {
            color: '#1a02a3'
        }
    };
    const barData = [barTrace];

    // 9. Create the layout for the bar chart.
    const barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);
}

function buildBubbleChart(sample_values, otu_ids, otu_labels) {
    const bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values
        }
    };

    const bubbleData = [bubbleTrace];

    const bubbleLayout = {
        title: 'Bacteria Cultures per Sample',
        hovertext: otu_labels,
        showlegend: false,
        height: 600,
        width: 950,
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

function buildGaugeChart(data, selectedID) {
    const allMetadatas = data.metadata;
    const selected = allMetadatas.filter(meta => meta.id == selectedID);
    const selectedMetadata = selected[0];
    const wfreq = parseFloat(selectedMetadata.wfreq);

    const gaugeData = [
        {
            domain: {x: [0, 1], y: [0, 1]},
            value: wfreq,
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: {size: 18}
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                bar: {color: "black"},
                axis: {range: [null, 10]},
                steps: [
                    {range: [0, 2], color: "red"},
                    {range: [2, 4], color: "orange"},
                    {range: [4, 6], color: "yellow"},
                    {range: [6, 8], color: "chartreuse"},
                    {range: [8, 10], color: "green"}
                ]
            }
        }
    ];

    const gaugeLayout = {
        width: 500,
        height: 400,
        margin: {t: 120},
        paper_bgcolor: "#d7d1ff"
    };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
}

// 1. Create the buildCharts function.
function buildCharts(selectedID) {
    // 2. Use d3.json to load and retrieve the samples.json file
    d3.json(data_file).then((data) => {
        console.log(data);

        // 3. Create a variable that holds the samples array.
        const allSamples = data.samples;

        // 4. Create a variable that filters the samples for the object with the desired sample number.
        const selected = allSamples.filter(sample => sample.id === selectedID);

        //  5. Create a variable that holds the first sample in the array.
        const selectedSample = selected[0];

        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        // 7. Create the yticks for the bar chart.
        const otu_ids = selectedSample.otu_ids;
        console.log(otu_ids);

        const otu_labels = selectedSample.otu_labels;
        console.log(otu_labels);

        const sample_values = selectedSample.sample_values;
        console.log(sample_values);

        // 8. Create the trace for the bar chart.
        buildBarChart(sample_values, otu_ids, otu_labels);
        buildBubbleChart(sample_values, otu_ids, otu_labels);
        buildGaugeChart(data, selectedID);
    });
}
