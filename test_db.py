import sqlite3

DB_FILE = "lots.db"

def test_db_fetch():
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute("SELECT name, lotStatus FROM parkingLots")
        rows = cur.fetchall()
        conn.close()

        if not rows:
            print("No rows returned from the database.")
            return

        print(f"Fetched {len(rows)} rows from the database:")
        for row in rows:
            db_id, status = row
            print(f"ID: {db_id}, lotStatus: {status}, type: {type(status)}")
    
    except Exception as e:
        print(f"Error accessing DB: {e}")

if __name__ == "__main__":
    test_db_fetch()
