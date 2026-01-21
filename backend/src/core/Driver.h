#ifndef DRIVER_H
#define DRIVER_H

#include <string>

enum class DriverStatus {
    AVAILABLE,
    BUSY,
    OFFLINE
};

class Driver {
private:
    int id;
    std::string name;
    int currentLocationId;
    DriverStatus status;
    std::string vehicle;

public:
    Driver(int id = -1, std::string name = "", int locId = -1, std::string vehicle = "");
    
    int getId() const { return id; }
    std::string getName() const { return name; }
    int getCurrentLocationId() const { return currentLocationId; }
    DriverStatus getStatus() const { return status; }
    std::string getVehicle() const { return vehicle; }
    
    void setLocation(int locId) { currentLocationId = locId; }
    void setStatus(DriverStatus s) { status = s; }
};

#endif
