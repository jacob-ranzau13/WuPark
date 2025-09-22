import socket as sock
import struct # for extracting individual bytes

MAX_BYTES = 1024 # maximum number of bytes the socket will accept

s = sock.socket()
port = 12345

s.connect(('127.0.0.1', port))

data = s.recv(MAX_BYTES)
a, b, c, d = struct.unpack('BBBB', data) # unpacking bytes into four separate variables
print(b)

s.close()