#include "Driver.h"

Driver::Driver(int id, std::string name, int locId, std::string vehicle)
    : id(id), name(name), currentLocationId(locId), status(DriverStatus::AVAILABLE), vehicle(vehicle) {}
