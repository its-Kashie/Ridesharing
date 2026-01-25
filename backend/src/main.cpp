#include "system/RideShareSystem.h"
#include "../include/httplib.h"
#include "../include/json.hpp"
#include <iostream>
#include <string>

using json = nlohmann::json;

void add_cors_headers(httplib::Response &res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
}

int main() {
    RideShareSystem system;
    httplib::Server svr;

    // Setup City (Initial State)
    system.addNode(1, "Downtown", "Zone A");
    system.addNode(2, "North Station", "Zone B");
    system.addNode(3, "East Mall", "Zone C");
    system.addNode(4, "Airport", "Zone D");

    system.addEdge(1, 2, 10);
    system.addEdge(2, 3, 15);
    system.addEdge(3, 4, 20);
    system.addEdge(1, 3, 25);

    // Initial Drivers
    system.addDriver(101, "Ahmad Khan", 1, "Toyota Camry");
    system.addDriver(102, "Sara Ahmed", 2, "Honda Civic");
    system.addDriver(103, "Ali Hassan", 3, "Suzuki Swift");

    // OPTIONS handler for CORS preflight
    svr.Options(R"(/.*)", [](const httplib::Request&, httplib::Response& res) {
        add_cors_headers(res);
        res.status = 204;
    });

    svr.Get("/api/status", [&](const httplib::Request&, httplib::Response& res) {
        json j;
        j["status"] = "online";
        j["drivers"] = 3;
        j["message"] = "System is running";
        
        res.set_content(j.dump(), "application/json");
        add_cors_headers(res);
    });

    svr.Get("/api/drivers", [&](const httplib::Request&, httplib::Response& res) {
        json j;
        j["drivers"] = json::array();
        
        j["drivers"].push_back({
            {"id", 101},
            {"name", "Ahmad Khan"},
            {"status", "available"},
            {"location", "Downtown"}
        });
        j["drivers"].push_back({
            {"id", 102},
            {"name", "Sara Ahmed"},
            {"status", "busy"},
            {"location", "North Station"}
        });

        res.set_content(j.dump(), "application/json");
        add_cors_headers(res);
    });

    svr.Post("/api/trip/request", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto j = json::parse(req.body);
            int riderId = j.value("riderId", 0);
            int pickupNode = j.value("pickupNode", 1);
            int dropoffNode = j.value("dropoffNode", 4);

            int tripId = system.requestTrip(riderId, pickupNode, dropoffNode);
            bool dispatched = system.dispatchTrip(tripId);

            json resp;
            resp["tripId"] = tripId;
            resp["status"] = dispatched ? "dispatched" : "pending";
            resp["driverId"] = dispatched ? 101 : 0;

            res.set_content(resp.dump(), "application/json");
        } catch (const std::exception& e) {
            std::cerr << "Error parsing JSON: " << e.what() << std::endl;
            res.status = 400;
            res.set_content("Invalid JSON", "text/plain");
        }
        add_cors_headers(res);
    });

    svr.Get("/api/metrics", [&](const httplib::Request&, httplib::Response& res) {
        json j;
        j["coreEngineLoad"] = 12; // Mock
        j["memoryAllocation"] = "128 MB";
        j["dispatchLatency"] = "15ms";
        j["activeNodes"] = 4; // From system
        j["edgeDensity"] = "0.75";
        j["status"] = "Operational";
        
        res.set_content(j.dump(), "application/json");
        add_cors_headers(res);
    });

    svr.Post("/api/undo", [&](const httplib::Request&, httplib::Response& res) {
        system.undoLastAction();
        json j;
        j["success"] = true;
        res.set_content(j.dump(), "application/json");
        add_cors_headers(res);
    });

    svr.Get("/api/graph", [&](const httplib::Request&, httplib::Response& res) {
        json j;
        j["nodes"] = 4;
        j["edges"] = 4;
        j["zones"] = {"Downtown", "North Station", "East Mall", "Airport"};
        
        res.set_content(j.dump(), "application/json");
        add_cors_headers(res);
    });

    std::cout << "Starting Ride-Sharing API Server on port 8082..." << std::endl;
    svr.listen("0.0.0.0", 8082);

    return 0;
}
