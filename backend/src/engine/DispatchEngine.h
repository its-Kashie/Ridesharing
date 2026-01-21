#ifndef DISPATCH_ENGINE_H
#define DISPATCH_ENGINE_H

#include "../core/City.h"
#include "../core/Driver.h"
#include "../core/Trip.h"

class DispatchEngine {
public:
    static int findNearestDriver(City& city, Trip& trip, Driver** drivers, int numDrivers);
};

#endif
