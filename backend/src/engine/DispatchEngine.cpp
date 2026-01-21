#include "DispatchEngine.h"

int DispatchEngine::findNearestDriver(City& city, Trip& trip, Driver** drivers, int numDrivers) {
    int nearestDriverId = -1;
    int minDistance = 1e9;
    
    int* path = new int[city.getNumNodes()];
    int pathLength = 0;

    for (int i = 0; i < numDrivers; ++i) {
        if (drivers[i]->getStatus() == DriverStatus::AVAILABLE) {
            int dist = city.findShortestPath(drivers[i]->getCurrentLocationId(), trip.getPickupLocationId(), path, pathLength);
            if (dist != -1 && dist < minDistance) {
                minDistance = dist;
                nearestDriverId = drivers[i]->getId();
            }
        }
    }

    delete[] path;
    return nearestDriverId;
}
