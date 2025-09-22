import socket as sock

s = sock.socket()
port = 12345
print("socket created")

s.bind(('', port))
print("socket bound to port 12345")

s.listen(5)     
print ("socket is listening")

while True:
    c, addr = s.accept()
    print("got connection from", addr)

    c.send("Thank you for connecting".encode())
    print("message sent")
    c.close()
    break