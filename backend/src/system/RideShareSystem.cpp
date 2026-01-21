#include "RideShareSystem.h"
#include <iostream>

RideShareSystem::RideShareSystem() : numDrivers(0), driverCapacity(100), numRiders(0), riderCapacity(100), numTrips(0), tripCapacity(100) {
    drivers = new Driver*[driverCapacity];
    riders = new Rider*[riderCapacity];
    trips = new Trip*[tripCapacity];
}

RideShareSystem::~RideShareSystem() {
    for (int i = 0; i < numDrivers; ++i) delete drivers[i];
    delete[] drivers;
    for (int i = 0; i < numRiders; ++i) delete riders[i];
    delete[] riders;
    for (int i = 0; i < numTrips; ++i) delete trips[i];
    delete[] trips;
}

void RideShareSystem::addNode(int id, std::string name, std::string zone) {
    city.addNode(id, name, zone);
}

void RideShareSystem::addEdge(int from, int to, int weight) {
    city.addEdge(from, to, weight);
}

void RideShareSystem::addDriver(int id, std::string name, int locId, std::string vehicle) {
    if (numDrivers < driverCapacity) {
        drivers[numDrivers++] = new Driver(id, name, locId, vehicle);
    }
}

void RideShareSystem::addRider(int id, std::string name, int locId) {
    if (numRiders < riderCapacity) {
        riders[numRiders++] = new Rider(id, name, locId);
    }
}

int RideShareSystem::requestTrip(int riderId, int pickupId, int dropoffId) {
    if (numTrips < tripCapacity) {
        int tripId = numTrips + 1;
        trips[numTrips++] = new Trip(tripId, riderId, pickupId, dropoffId);
        return tripId;
    }
    return -1;
}

bool RideShareSystem::dispatchTrip(int tripId) {
    Trip* trip = nullptr;
    for (int i = 0; i < numTrips; ++i) {
        if (trips[i]->getId() == tripId) {
            trip = trips[i];
            break;
        }
    }

    if (!trip || trip->getStatus() != TripStatus::REQUESTED) return false;

    int driverId = DispatchEngine::findNearestDriver(city, *trip, drivers, numDrivers);
    if (driverId != -1) {
        Driver* driver = nullptr;
        for (int i = 0; i < numDrivers; ++i) {
            if (drivers[i]->getId() == driverId) {
                driver = drivers[i];
                break;
            }
        }

        if (driver) {
            rollbackManager.recordAction(tripId, driverId, TripStatus::REQUESTED, TripStatus::ASSIGNED);
            trip->setDriverId(driverId);
            trip->setStatus(TripStatus::ASSIGNED);
            driver->setStatus(DriverStatus::BUSY);
            return true;
        }
    }
    return false;
}

bool RideShareSystem::completeTrip(int tripId) {
    Trip* trip = nullptr;
    for (int i = 0; i < numTrips; ++i) {
        if (trips[i]->getId() == tripId) {
            trip = trips[i];
            break;
        }
    }

    if (!trip || trip->getStatus() != TripStatus::ASSIGNED) return false;

    Driver* driver = nullptr;
    for (int i = 0; i < numDrivers; ++i) {
        if (drivers[i]->getId() == trip->getDriverId()) {
            driver = drivers[i];
            break;
        }
    }

    if (driver) {
        rollbackManager.recordAction(tripId, driver->getId(), TripStatus::ASSIGNED, TripStatus::COMPLETED);
        trip->setStatus(TripStatus::COMPLETED);
        driver->setStatus(DriverStatus::AVAILABLE);
        driver->setLocation(trip->getDropoffLocationId());
        return true;
    }
    return false;
}

bool RideShareSystem::cancelTrip(int tripId) {
    Trip* trip = nullptr;
    for (int i = 0; i < numTrips; ++i) {
        if (trips[i]->getId() == tripId) {
            trip = trips[i];
            break;
        }
    }

    if (!trip || (trip->getStatus() != TripStatus::REQUESTED && trip->getStatus() != TripStatus::ASSIGNED)) return false;

    TripStatus oldStatus = trip->getStatus();
    int driverId = trip->getDriverId();

    rollbackManager.recordAction(tripId, driverId, oldStatus, TripStatus::CANCELLED);
    trip->setStatus(TripStatus::CANCELLED);
    
    if (driverId != -1) {
        for (int i = 0; i < numDrivers; ++i) {
            if (drivers[i]->getId() == driverId) {
                drivers[i]->setStatus(DriverStatus::AVAILABLE);
                break;
            }
        }
    }
    return true;
}

bool RideShareSystem::undoLastAction() {
    int tripId, driverId;
    TripStatus oldStatus, newStatus;
    if (rollbackManager.rollback(tripId, driverId, oldStatus, newStatus)) {
        Trip* trip = nullptr;
        for (int i = 0; i < numTrips; ++i) {
            if (trips[i]->getId() == tripId) {
                trip = trips[i];
                break;
            }
        }

        if (trip) {
            trip->setStatus(oldStatus);
            if (newStatus == TripStatus::ASSIGNED && oldStatus == TripStatus::REQUESTED) {
                // Undo dispatch
                for (int i = 0; i < numDrivers; ++i) {
                    if (drivers[i]->getId() == driverId) {
                        drivers[i]->setStatus(DriverStatus::AVAILABLE);
                        break;
                    }
                }
                trip->setDriverId(-1);
            }
            // Add more undo logic as needed
            return true;
        }
    }
    return false;
}

void RideShareSystem::displayStatus() {
    std::cout << "\n--- System Status ---\n";
    std::cout << "Drivers: " << numDrivers << ", Riders: " << numRiders << ", Trips: " << numTrips << "\n";
    for (int i = 0; i < numTrips; ++i) {
        std::cout << "Trip #" << trips[i]->getId() << ": Status=" << (int)trips[i]->getStatus() << "\n";
    }
}
