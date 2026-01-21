#include "City.h"
#include <iostream>

City::City(int cap) : capacity(cap), numNodes(0) {
    nodes = new Node[capacity];
}

City::~City() {
    for (int i = 0; i < numNodes; ++i) {
        Edge* curr = nodes[i].head;
        while (curr) {
            Edge* next = curr->next;
            delete curr;
            curr = next;
        }
    }
    delete[] nodes;
}

void City::addNode(int id, std::string name, std::string zone) {
    if (numNodes < capacity) {
        nodes[numNodes].id = id;
        nodes[numNodes].name = name;
        nodes[numNodes].zone = zone;
        nodes[numNodes].head = nullptr;
        numNodes++;
    }
}

void City::addEdge(int from, int to, int weight) {
    Node* startNode = getNode(from);
    if (startNode) {
        startNode->head = new Edge(to, weight, startNode->head);
    }
    
    // Assuming undirected graph for simplicity, or add another edge for directed
    Node* endNode = getNode(to);
    if (endNode) {
        endNode->head = new Edge(from, weight, endNode->head);
    }
}

Node* City::getNode(int id) {
    for (int i = 0; i < numNodes; ++i) {
        if (nodes[i].id == id) return &nodes[i];
    }
    return nullptr;
}

int City::findShortestPath(int startId, int endId, int* path, int& pathLength) {
    const int INF = 1e9;
    int* dist = new int[numNodes];
    int* prev = new int[numNodes];
    bool* visited = new bool[numNodes];

    for (int i = 0; i < numNodes; ++i) {
        dist[i] = INF;
        prev[i] = -1;
        visited[i] = false;
    }

    int startIdx = -1, endIdx = -1;
    for (int i = 0; i < numNodes; ++i) {
        if (nodes[i].id == startId) startIdx = i;
        if (nodes[i].id == endId) endIdx = i;
    }

    if (startIdx == -1 || endIdx == -1) return -1;

    dist[startIdx] = 0;

    for (int i = 0; i < numNodes; ++i) {
        int u = -1;
        for (int j = 0; j < numNodes; ++j) {
            if (!visited[j] && (u == -1 || dist[j] < dist[u])) {
                u = j;
            }
        }

        if (dist[u] == INF) break;
        visited[u] = true;

        Edge* curr = nodes[u].head;
        while (curr) {
            int vIdx = -1;
            for (int k = 0; k < numNodes; ++k) {
                if (nodes[k].id == curr->to) {
                    vIdx = k;
                    break;
                }
            }

            if (vIdx != -1 && dist[u] + curr->weight < dist[vIdx]) {
                dist[vIdx] = dist[u] + curr->weight;
                prev[vIdx] = u;
            }
            curr = curr->next;
        }
    }

    int totalDist = dist[endIdx];
    
    // Reconstruct path
    pathLength = 0;
    if (totalDist != INF) {
        int curr = endIdx;
        while (curr != -1) {
            path[pathLength++] = nodes[curr].id;
            curr = prev[curr];
        }
        // Reverse path
        for (int i = 0; i < pathLength / 2; ++i) {
            int temp = path[i];
            path[i] = path[pathLength - 1 - i];
            path[pathLength - 1 - i] = temp;
        }
    }

    delete[] dist;
    delete[] prev;
    delete[] visited;

    return totalDist == INF ? -1 : totalDist;
}
