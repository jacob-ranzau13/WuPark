import sqlite3 as sql

conn = sql.connect('lots.db')
c = conn.cursor()

c.execute('''
          CREATE TABLE IF NOT EXISTS parkingLots
          (name TEXT PRIMARY KEY NOT NULL, 
          lotStatus BLOB NOT NULL)
          ''')

c.execute('INSERT INTO parkingLots (name, lotStatus) VALUES (?, ?)', ('1', b''))

conn.commit()
conn.close()