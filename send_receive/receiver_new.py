import socket as sock
import sqlite3 as sql

conn = sql.connect('lots.db')
cursor = conn.cursor()

s = sock.socket()
port = 12345

s.bind(('', port))
s.listen(5)

for i in range(3):
    while True:
        print("waiting for connection " + str(i))
        c, addr = s.accept()

        data = c.recv(1024)
        bytenum = 0
        lotnumber = 0
        j = 0

        for byte in data:
            if(bytenum == 0):
                print("Expecting {} bytes".format(byte))
                bytenum += 1
            elif(bytenum == 1):
                print("Lot number {}".format(byte))
                lotnumber = int(byte)
                cursor.execute('UPDATE parkingLots SET lotStatus = ? WHERE name = ?', (b'', str(lotnumber)))
                conn.commit()
                bytenum += 1
            else:
                cursor.execute('SELECT lotStatus FROM parkingLots WHERE name = ?', (str(lotnumber),))
                row = cursor.fetchone()
                existing_bytes = row[0] if row and row[0] else b''
                combined_bytes = existing_bytes + byte.to_bytes(1, 'big')
                cursor.execute('UPDATE parkingLots SET lotStatus = ? WHERE name = ?', (combined_bytes, str(lotnumber)))
                conn.commit()

        cursor.execute('SELECT lotStatus FROM parkingLots WHERE name = ?', (str(lotnumber),))
        row = cursor.fetchone()
        print(row)

        c.close()
        break

conn.commit()
conn.close()
s.close()