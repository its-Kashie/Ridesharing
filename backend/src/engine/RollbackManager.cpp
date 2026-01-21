#include "RollbackManager.h"

RollbackManager::~RollbackManager() {
    while (top) {
        Action* temp = top;
        top = top->next;
        delete temp;
    }
}

void RollbackManager::recordAction(int tripId, int driverId, TripStatus oldStatus, TripStatus newStatus) {
    top = new Action(tripId, driverId, oldStatus, newStatus, top);
}

bool RollbackManager::rollback(int& tripId, int& driverId, TripStatus& oldStatus, TripStatus& newStatus) {
    if (!top) return false;

    Action* temp = top;
    tripId = temp->tripId;
    driverId = temp->driverId;
    oldStatus = temp->oldStatus;
    newStatus = temp->newStatus;

    top = top->next;
    delete temp;
    return true;
}
