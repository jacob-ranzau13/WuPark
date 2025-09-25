import socket as sock

s = sock.socket()
port = 12345

s.bind(('', port))

s.listen(5)

for i in range(5):
    while True:
        print("waiting for connection " + str(i))
        c, addr = s.accept()

        data = c.recv(1024)
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
                    if(bit):
                        print("Space {} is taken".format(1 + i + j * 8))
                    else:
                        print("Space {} is free".format(1 + i + j * 8))
                j += 1

        c.close()
        break