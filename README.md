# Campus WiFi Optimizer

A web app that plans a cost-efficient WiFi network for a college campus. It models buildings as nodes of a weighted graph and uses **Prim's Minimum Spanning Tree (MST) algorithm** to connect every building with the smallest total cable or link distance.

---

## Features

- **Interactive distance matrix**: generate an editable N × N table of distances between campus buildings
- **Auto-symmetric input**: entering the distance from A to B also fills in B to A
- **Randomize distances**: fill the matrix with random values (1–20) for quick testing
- **MST computation**: Prim's algorithm finds the cheapest way to connect every building
- **Connectivity check**: warns you if some building can't be reached
- **Interactive graph**: a D3.js force-directed graph with draggable nodes, building labels and edge weights
- **Total cost display**: shows the total distance of the optimized network

---

## Buildings Modeled

| # | Building |
|---|----------|
| 0 | Academic Block |
| 1 | Girls Hostel |
| 2 | Library |
| 3 | Canteen |
| 4 | Administrative Office |
| 5 | Boys Hostel |

(Up to 6 buildings are supported. Edit the `buildingNames` array in `static/script.js` to add or rename them.)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, Flask, Flask-CORS, NumPy |
| Frontend | HTML5, CSS3, JavaScript |
| Visualization | D3.js v7 |
| Algorithm | Prim's MST |

---

## Project Structure

```
Campus-WiFi-Optimizer/
├── app.py                 # Flask server and /optimize API (Prim's in Python)
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html         # Main UI
└── static/
    ├── script.js          # Matrix generation, Prim's MST, D3 graph rendering
    └── styles.css         # Styling
```

---

## Getting Started

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/praveena-anand/Campus-WiFi-Optimizer.git
cd Campus-WiFi-Optimizer

# (Optional) create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Run

```bash
python app.py
```

Open **http://127.0.0.1:5000** in your browser.

---

## How to Use

1. Enter the **number of buildings** (1–6).
2. Click **Generate Distance Matrix**.
3. Type in the distances between buildings, or click **Randomize Distances**.
   - Leave a cell blank if two buildings can't be directly connected.
4. Click **Optimize WiFi**.
5. Look at the MST connections, the network graph and the total distance.

---

## 🔌 API

### `POST /optimize`

Computes the MST on the server.

**Request**
```json
{
  "matrix": [
    [0, 4, 0, 8],
    [4, 0, 6, 2],
    [0, 6, 0, 5],
    [8, 2, 5, 0]
  ]
}
```
> In the API, a `0` off the diagonal means "no direct edge".

**Response**
```json
{
  "mst": [
    { "from": 0, "to": 1, "weight": 4 },
    { "from": 1, "to": 3, "weight": 2 },
    { "from": 3, "to": 2, "weight": 5 }
  ]
}
```

---

## Algorithm: Prim's MST

1. Start from building 0 with key value 0. Every other building starts at ∞.
2. Repeatedly pick the unvisited building with the smallest key.
3. Mark it as visited and update its neighbours' keys whenever a cheaper edge is found.
4. Keep going until every building is in the tree.

| Metric | Complexity |
|--------|-----------|
| Time | **O(V²)** (adjacency-matrix implementation) |
| Space | **O(V)** |

For dense graphs like a campus distance matrix, the O(V²) array-based version works well and is simple to follow.

---

## Future Enhancements

- Load real building coordinates from a campus map
- Model router range, signal strength and interference
- Support any number of buildings with custom names
- Compare against Kruskal's algorithm
- Export the optimized network as an image or PDF
