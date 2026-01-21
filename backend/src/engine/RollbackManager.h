#ifndef ROLLBACK_MANAGER_H
#define ROLLBACK_MANAGER_H

#include "../core/Trip.h"

struct Action {
    int tripId;
    int driverId;
    TripStatus oldStatus;
    TripStatus newStatus;
    Action* next;

    Action(int tId, int dId, TripStatus oldS, TripStatus newS, Action* n)
        : tripId(tId), driverId(dId), oldStatus(oldS), newStatus(newS), next(n) {}
};

class RollbackManager {
private:
    Action* top;

public:
    RollbackManager() : top(nullptr) {}
    ~RollbackManager();

    void recordAction(int tripId, int driverId, TripStatus oldStatus, TripStatus newStatus);
    bool rollback(int& tripId, int& driverId, TripStatus& oldStatus, TripStatus& newStatus);
};

#endif
