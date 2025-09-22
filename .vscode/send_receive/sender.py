import socket as sock

s = sock.socket()
port = 12345
print("socket created")

s.bind(('', port))
print("socket bound to port 12345")

s.listen(5) # will hold five connections in queue, other connections will be refused
print ("socket is listening")

numBytes = int(input("Enter number of bytes to send (including this byte and lot number, minimum 3): "))
lotNum = int(input("Enter lot number: "))
data = bytearray()

data.extend(numBytes.to_bytes(1, 'big'))  # 1 byte, big-endian
data.extend(lotNum.to_bytes(1, 'big'))

for _ in range(numBytes - 2):
    value = int(input("Enter byte value (0-255): "))
    data.extend(value.to_bytes(1, 'big'))

while True:
    print("waiting for a connection...")
    c, addr = s.accept()
    print("got connection from", addr)

    c.sendall(data) # sending bytes, no encoding necessary
    print("message sent")
    c.close()
    break