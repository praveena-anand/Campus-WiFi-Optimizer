console.log("script.js is running!");

// Define custom names for the buildings
const buildingNames = [
    "Academic Block",
    "Girls Hostel",
    "Library",
    "Canteen",
    "Administrative Office",
    "Boys Hostel"
];

function generateMatrix() {
    let nodes = parseInt(document.getElementById("nodes").value);
    if (isNaN(nodes) || nodes < 1 || nodes > buildingNames.length) {
        alert(`Please enter a valid number of buildings (1 to ${buildingNames.length}).`);
        return;
    }

    let matrixContainer = document.getElementById("matrixContainer");
    matrixContainer.innerHTML = "";

    let table = document.createElement("table");
    for (let i = 0; i <= nodes; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j <= nodes; j++) {
            let cell = document.createElement(i === 0 || j === 0 ? "th" : "td");
            if (i === 0 && j > 0) cell.textContent = buildingNames[j - 1]; // Top Header
            else if (j === 0 && i > 0) cell.textContent = buildingNames[i - 1]; // Left Header
            else if (i > 0 && j > 0) {
                let input = document.createElement("input");
                input.type = "number";
                input.min = "0";
                input.id = `cell-${i - 1}-${j - 1}`;
                input.value = i === j ? 0 : "";

                // Ensure symmetric input
                input.addEventListener("input", function() {
                    document.getElementById(`cell-${j - 1}-${i - 1}`).value = this.value;
                });

                cell.appendChild(input);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    matrixContainer.appendChild(table);
}

function calculateMST() {
    console.log("calculateMST function is running!");

    let nodes = parseInt(document.getElementById("nodes").value);
    if (isNaN(nodes) || nodes < 1) {
        alert("Please generate the matrix first.");
        return;
    }

    let matrix = [];
    for (let i = 0; i < nodes; i++) {
        matrix[i] = [];
        for (let j = 0; j < nodes; j++) {
            let input = document.getElementById(`cell-${i}-${j}`);
            let value = input ? parseInt(input.value) : Infinity;
            matrix[i][j] = isNaN(value) ? Infinity : value;
        }
    }

    console.log("Adjacency matrix:", matrix);

    let selected = Array(nodes).fill(false);
    let minEdge = Array(nodes).fill(Infinity);
    let parent = Array(nodes).fill(-1);
    minEdge[0] = 0;

    for (let i = 0; i < nodes; i++) {
        let min = Infinity, u = -1;
        for (let j = 0; j < nodes; j++) {
            if (!selected[j] && minEdge[j] < min) {
                min = minEdge[j];
                u = j;
            }
        }

        if (u === -1) {
            alert("The graph is not connected! Please ensure all buildings have at least one connection.");
            return;
        }

        selected[u] = true;

        for (let v = 0; v < nodes; v++) {
            if (matrix[u][v] < minEdge[v] && !selected[v]) {
                minEdge[v] = matrix[u][v];
                parent[v] = u;
            }
        }
    }

    let resultText = "Optimized WiFi Network (Minimum Spanning Tree):\n";
    let mstEdges = [];
    for (let i = 1; i < nodes; i++) {
        if (parent[i] !== -1) {
            resultText += `${buildingNames[parent[i]]} - ${buildingNames[i]}: ${matrix[i][parent[i]]}\n`;
            mstEdges.push([buildingNames[parent[i]], buildingNames[i], matrix[i][parent[i]]]);
        }
    }

    console.log("MST Result:", resultText);
    document.getElementById("result").textContent = resultText;

    drawGraph(mstEdges);
}

function randomizeDistances() {
    let nodes = parseInt(document.getElementById("nodes").value);
    if (isNaN(nodes) || nodes < 1) {
        alert("Please enter a valid number of buildings first.");
        return;
    }

    for (let i = 0; i < nodes; i++) {
        for (let j = i + 1; j < nodes; j++) {
            let randValue = Math.floor(Math.random() * 20) + 1;
            document.getElementById(`cell-${i}-${j}`).value = randValue;
            document.getElementById(`cell-${j}-${i}`).value = randValue;
        }
    }
}

function drawGraph(mstEdges) {
    console.log("Drawing graph with MST edges:", mstEdges);

    document.getElementById("graph").innerHTML = "";  // Clear any previous content

    const width = 600, height = 400;
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const links = mstEdges.map(([source, target, weight]) => ({ source, target, weight }));
    const nodes = [...new Set(links.flatMap(link => [link.source, link.target]))]
        .map(name => ({ id: name }));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.weight * 10))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#007bff")
        .style("stroke-width", 3);

    const node = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", "#FF4500")
        .call(d3.drag().on("start", event => { event.subject.fx = event.x; event.subject.fy = event.y; })
                      .on("drag", event => { event.subject.fx = event.x; event.subject.fy = event.y; })
                      .on("end", event => { event.subject.fx = null; event.subject.fy = null; }));

    // Adding labels to the nodes
    const label = svg.selectAll("text.nodeLabel")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "nodeLabel")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("text-anchor", "middle")
        .attr("dy", -15) // Position the label above the node
        .style("font-size", "12px")
        .style("fill", "black")
        .text(d => d.id);

    // Adding edge weights (distances) as labels
    const edgeLabels = svg.selectAll("text.edgeLabel")
        .data(links)
        .enter()
        .append("text")
        .attr("class", "edgeLabel")
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2)
        .attr("text-anchor", "middle")
        .attr("dy", -10) // Position the label above the edge
        .style("font-size", "10px")
        .style("fill", "black")
        .text(d => d.weight);

    let totalDistance = 0;
    links.forEach(link => {
        totalDistance += link.weight; // Sum the weights (distances)
    });

    // Display the total distance below the graph
    d3.select("#totalDistance")
        .text(`Total Distance (MST): ${totalDistance} units`);

    simulation.on("tick", function() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        edgeLabels
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2);
    });
}