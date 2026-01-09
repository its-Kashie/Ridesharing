# Ride-Sharing Dispatch & Trip Management System
DSA Semester Project

---

## 1. Project Overview

The **Ride-Sharing Dispatch & Trip Management System** is an in-memory simulation of a ride-sharing platform similar to Uber or Careem.  
The system manages riders, drivers, trip dispatching, cancellation, rollback, and analytics using **custom data structures**.

The project emphasizes **graphs, state machines, rollback mechanisms**, and **modular system design** without relying on STL graph or map containers.

---

## 2. Objectives

- Implement a weighted graph using custom adjacency structures
- Apply shortest path algorithms for driver dispatching
- Enforce strict trip lifecycle state transitions
- Support cancellation and rollback of trips
- Perform analytical queries on trip history
- Practice multi-file modular programming
- Integrate a UI to eliminate viva examination

---

## 3. Technology Stack

- **Core Language:** C++
- **UI (Optional but Recommended):**
  - HTML, CSS, JavaScript (Web UI)
  - OR Menu-driven Console UI
- **Data Storage:** In-memory only
- **Version Control:** Git & GitHub

---

## 4. Team Structure (2 Members)

### Member 1 – Core Logic & DSA
- City graph implementation
- Shortest path algorithm
- Trip lifecycle state machine
- Dispatch engine
- Rollback manager
- Analytics logic
- Test cases

### Member 2 – UI & Integration
- UI design
- User input handling
- System integration
- Daily progress reports
- Documentation

> Both members must understand all components for final evaluation.

---

## 5. System Architecture

### 5.1 City Representation
- City represented as a **weighted graph**
- Nodes → Locations
- Edges → Roads with distance
- Zones are logical partitions of nodes

### 5.2 Core Entities
- **City:** Graph and routing logic
- **Driver:** Location and availability
- **Rider:** Pickup and drop-off points
- **Trip:** Represents a ride request
- **DispatchEngine:** Assigns drivers
- **RollbackManager:** Handles cancellations
- **RideShareSystem:** Central controller

---

## 6. Trip Lifecycle (State Machine)

### Trip States
- REQUESTED
- ASSIGNED
- ONGOING
- COMPLETED
- CANCELLED

### Valid Transitions
- REQUESTED → ASSIGNED
- ASSIGNED → ONGOING
- ONGOING → COMPLETED
- REQUESTED → CANCELLED
- ASSIGNED → CANCELLED

Invalid transitions must be detected and blocked.

---

## 7. Dispatch Strategy

1. Identify nearby available drivers
2. Prefer drivers within the same zone
3. Compute shortest path distance
4. Assign closest driver
5. Apply penalty for cross-zone dispatch
6. Update driver availability and trip state

---

## 8. Shortest Path Algorithm

- Implement using:
  - Arrays
  - Adjacency list (custom linked list)
- No STL graph or map usage
- Dijkstra-style logic with manual priority handling

---

## 9. Cancellation & Rollback

- Uses **stack-based rollback**
- Each dispatch operation is recorded
- Cancelling a trip:
  - Restores driver availability
  - Restores trip state
- Rollback supports undoing last `k` operations

Rollback must undo:
- Driver assignment
- Trip state transitions

---

## 10. Trip History & Analytics

Supported analytics:
- Average trip distance
- Driver utilization rate
- Cancelled vs completed trips
- Peak usage zones

Analytics must remain correct after rollback operations.

---

## Project Structure
```bash
​📂 Ride-Sharing-System
├── 📂 src
│   ├── 📂 core
│   │   ├── 📄 City.h/cpp — Graph, Nodes, & Edges
│   │   ├── 📄 Driver.h/cpp — Location & Availability
│   │   ├── 📄 Rider.h/cpp — Pickup & Drop-off points
│   │   └── 📄 Trip.h/cpp — State Management Logic
│   ├── 📂 engine
│   │   ├── 📄 DispatchEngine.h/cpp — Driver Assignment
│   │   └── 📄 RollbackManager.h/cpp — Undo/Redo Stack
│   ├── 📂 system
│   │   └── 📄 RideShareSystem.h/cpp — System Controller
│   └── 📄 main.cpp — Entry Point
├── 📂 ui
│   ├── 📄 index.html
│   ├── 📄 style.css
│   └── 📄 app.js
├── 📂 tests
│   ├── 📄 test_graph.cpp — Path correctness
│   ├── 📄 test_dispatch.cpp — Driver assignment
│   ├── 📄 test_rollback.cpp — Multi-trip undo
│   └── 📄 test_states.cpp — State transitions
├── 📂 reports
│   └── 📄 report-day1..7.md
├── 📂 docs
│   ├── 📄 design.md — Complexity & Algorithms
│   └── 📄 algorithms.md
├── 📄 README.md
└── 📄 .gitignore  
```
---

## 12. Terminal Command to Create Project Structure

```bash
mkdir -p Ride-Sharing-System/{src/{core,engine,system},ui,tests,reports,docs}

touch Ride-Sharing-System/src/core/{City,Driver,Rider,Trip}.{h,cpp}
touch Ride-Sharing-System/src/engine/{DispatchEngine,RollbackManager}.{h,cpp}
touch Ride-Sharing-System/src/system/{RideShareSystem}.{h,cpp}
touch Ride-Sharing-System/src/main.cpp

touch Ride-Sharing-System/ui/{index.html,style.css,app.js}

touch Ride-Sharing-System/tests/{test_graph.cpp,test_dispatch.cpp,test_rollback.cpp,test_states.cpp}

touch Ride-Sharing-System/reports/report-day{1..7}.md

touch Ride-Sharing-System/docs/{design.md,algorithms.md}

touch Ride-Sharing-System/{README.md,.gitignore}