import socket as sock

s = sock.socket()
port = 12345
print("socket created")

s.bind(('', port))
print("socket bound to port 12345")

s.listen(5) # will hold five connections in queue, other connections will be refused
print ("socket is listening")

data = b'\x01\x02\x03\x04'

while True:
    c, addr = s.accept()
    print("got connection from", addr)

    c.sendall(data) # sending bytes, no encoding necessary
    print("message sent")
    c.close()
    break