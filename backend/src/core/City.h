#ifndef CITY_H
#define CITY_H

#include <string>

struct Node {
    int id;
    std::string name;
    std::string zone;
    struct Edge* head;

    Node() : id(-1), head(nullptr) {}
};

struct Edge {
    int to;
    int weight;
    Edge* next;

    Edge(int t, int w, Edge* n) : to(t), weight(w), next(n) {}
};

class City {
private:
    Node* nodes;
    int numNodes;
    int capacity;

public:
    City(int cap = 100);
    ~City();

    void addNode(int id, std::string name, std::string zone);
    void addEdge(int from, int to, int weight);
    
    int getNumNodes() const { return numNodes; }
    Node* getNode(int id);
    
    // Shortest path using Dijkstra (Custom implementation)
    int findShortestPath(int startId, int endId, int* path, int& pathLength);
};

#endif
