#include "Trip.h"

Trip::Trip(int id, int riderId, int pickupId, int dropoffId)
    : id(id), riderId(riderId), driverId(-1), pickupLocationId(pickupId), 
      dropoffLocationId(dropoffId), status(TripStatus::REQUESTED), distance(0.0) {}
