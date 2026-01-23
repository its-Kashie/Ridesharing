CXX = g++
CXXFLAGS = -std=c++17 -Iinclude -Wall -pthread
SRC = src/main.cpp \
      src/system/RideShareSystem.cpp \
      src/core/City.cpp \
      src/core/Driver.cpp \
      src/core/Rider.cpp \
      src/core/Trip.cpp \
      src/engine/DispatchEngine.cpp \
      src/engine/RollbackManager.cpp

OBJ = $(SRC:.cpp=.o)
TARGET = rideshare_server

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $^

clean:
	rm -f $(OBJ) $(TARGET)
