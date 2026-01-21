#ifndef RIDER_H
#define RIDER_H

#include <string>

class Rider {
private:
    int id;
    std::string name;
    int currentLocationId;

public:
    Rider(int id = -1, std::string name = "", int locId = -1);
    
    int getId() const { return id; }
    std::string getName() const { return name; }
    int getCurrentLocationId() const { return currentLocationId; }
    
    void setLocation(int locId) { currentLocationId = locId; }
};

#endif
