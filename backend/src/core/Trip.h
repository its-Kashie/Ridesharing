#ifndef TRIP_H
#define TRIP_H

#include <string>

enum class TripStatus {
    REQUESTED,
    ASSIGNED,
    ONGOING,
    COMPLETED,
    CANCELLED
};

class Trip {
private:
    int id;
    int riderId;
    int driverId;
    int pickupLocationId;
    int dropoffLocationId;
    TripStatus status;
    double distance;

public:
    Trip(int id = -1, int riderId = -1, int pickupId = -1, int dropoffId = -1);
    
    int getId() const { return id; }
    int getRiderId() const { return riderId; }
    int getDriverId() const { return driverId; }
    int getPickupLocationId() const { return pickupLocationId; }
    int getDropoffLocationId() const { return dropoffLocationId; }
    TripStatus getStatus() const { return status; }
    double getDistance() const { return distance; }
    
    void setDriverId(int dId) { driverId = dId; }
    void setStatus(TripStatus s) { status = s; }
    void setDistance(double d) { distance = d; }
};

#endif
