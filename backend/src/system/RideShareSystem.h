#ifndef RIDESHARE_SYSTEM_H
#define RIDESHARE_SYSTEM_H

#include "../core/City.h"
#include "../core/Driver.h"
#include "../core/Rider.h"
#include "../core/Trip.h"
#include "../engine/DispatchEngine.h"
#include "../engine/RollbackManager.h"

class RideShareSystem {
private:
    City city;
    Driver** drivers;
    int numDrivers;
    int driverCapacity;
    
    Rider** riders;
    int numRiders;
    int riderCapacity;
    
    Trip** trips;
    int numTrips;
    int tripCapacity;
    
    RollbackManager rollbackManager;

public:
    RideShareSystem();
    ~RideShareSystem();

    void addNode(int id, std::string name, std::string zone);
    void addEdge(int from, int to, int weight);
    void addDriver(int id, std::string name, int locId, std::string vehicle);
    void addRider(int id, std::string name, int locId);
    
    int requestTrip(int riderId, int pickupId, int dropoffId);
    bool dispatchTrip(int tripId);
    bool completeTrip(int tripId);
    bool cancelTrip(int tripId);
    bool undoLastAction();
    
    void displayStatus();
};

#endif
