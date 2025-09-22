import socket as sock

MAX_BYTES = 1024 # maximum number of bytes the socket will accept

s = sock.socket()
port = 12345

s.connect(('127.0.0.1', port))

data = s.recv(MAX_BYTES)
bytenum = 0
j = 0

for byte in data:
    if(bytenum == 0):
        print("Expecting {} bytes".format(byte))
        bytenum += 1
    elif(bytenum == 1):
        print("Lot number {}".format(byte))
        bytenum += 1
    else:
        for i in range(8):
            bit = (byte >> (7 - i)) & 1  # Get bit i (from most to least significant)
            if(bit & 1):
                print("Space {} is taken".format(1 + i + j * 8))
            else:
                print("Space {} is free".format(1 + i + j * 8))
        j += 1

s.close()