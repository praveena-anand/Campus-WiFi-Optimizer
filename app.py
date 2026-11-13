from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/optimize', methods=['POST'])
def optimize_wifi():
    try:
        data = request.json
        matrix = np.array(data.get('matrix'))
        if matrix is None or len(matrix) == 0:
            return jsonify({"error": "Invalid or empty matrix"}), 400

        mst_result = prims_algorithm(matrix)
        return jsonify(mst_result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def prims_algorithm(graph):
    nodes = len(graph)
    selected = [False] * nodes
    min_edge = [float('inf')] * nodes
    parent = [-1] * nodes
    min_edge[0] = 0

    for _ in range(nodes):
        u = min((min_edge[i], i) for i in range(nodes) if not selected[i])[1]
        selected[u] = True

        for v in range(nodes):
            if 0 < graph[u][v] < min_edge[v] and not selected[v]:
                min_edge[v] = graph[u][v]
                parent[v] = u

    mst_edges = []
    for v in range(1, nodes):
        if parent[v] != -1:
            mst_edges.append({"from": parent[v], "to": v, "weight": graph[v][parent[v]]})

    return {"mst": mst_edges}

if __name__ == '__main__':
    app.run(debug=True)