# class that will eventually represent a fully fledged parking lot on the backend

class ParkingLot:
    def __init__(self, name: str, totalSpaces: int):
        self.name = name
        self.totalSpaces = totalSpaces # total spaces won't change - read from db file?
        self.freeSpaces = 0

    def getInfo(self):
        return (self.name, self.freeSpaces, self.totalSpaces) # tuple

    def updateFreeSpaces(self, delta: int):
        self.freeSpaces = self.freeSpaces + delta
    
    def howFullIsLot(self):
        return (self.freeSpaces / self.totalSpaces)