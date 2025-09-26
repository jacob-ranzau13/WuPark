import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk, ImageDraw
import sqlite3

DB_FILE = "lots.db"

parking_data = {
    "Lot9E": {
        "Total": 50, "Available": 12,
        "Image": "LotImages/Lot9E.png",
        "ID" : 9
    },
    "Lot6": {
        "Total": 40, "Available": 5,
        "Image": "LotImages/Lot6.png",
        "ID" : 6
    },
    "LotJBC": {
        "Total": 36, "Available": 0,
        "Image": "LotImages/LotJBC.png",
        "ID" : 1
    }
}

lot_coords = { # hardcoded stall coords and labels; seperated into columns
    "LotJBC": [
        [(241, 101, 1), (241, 141, 2), (241, 181, 3), (241, 221, 4), (241, 261, 5), (241, 301, 6), (241, 341, 7), (241, 381, 8), (241, 421, 9)],
        [(470, 101, 10), (470, 141, 11), (470, 181, 12), (470, 221, 13), (470, 263, 14), (470, 303, 15), (470, 344, 16), (470, 384, 17), (470, 424, 18)],
        [(562, 101, 19), (562, 141, 20), (562, 181, 21), (562, 221, 22), (562, 263, 23), (562, 303, 24), (562, 344, 25), (562, 384, 26), (562, 424, 27)],
        [(780, 89, 28), (780, 131, 29), (780, 172, 30), (780, 213, 31), (780, 253, 32), (780, 295, 33), (780, 337, 34), (780, 379, 35), (780, 421, 36)]
    ]
}

demo_packets = [
    [0b00000110, 1, 0b10110011, 0b01010110, 0b11110000, 0b00001111, 0b10110000],
    [0b00000110, 1, 0b10111111, 0b01111110, 0b11111101, 0b01101111, 0b10101010],
    [0b00000110, 1, 0b10110011, 0b01010110, 0b11111111, 0b10000111, 0b01010101],
]

lot_camera_bits = {lot: "0" * stats["Total"] for lot, stats in parking_data.items()}

def bytes_to_bitstring(b: bytes) -> str:
    return "".join(f"{byte:08b}" for byte in b)


def fetch_latest_status():
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute("SELECT name, lotStatus FROM parkingLots")
        rows = cur.fetchall()
        conn.close()

        id_to_lot = {str(v["ID"]): k for k, v in parking_data.items()}

        for db_id, status_bytes in rows:
            lot_name = id_to_lot.get(db_id)
            if lot_name and isinstance(status_bytes, (bytes, bytearray)):
                bit_str = bytes_to_bitstring(status_bytes)
                lot_camera_bits[lot_name] = bit_str[:parking_data[lot_name]["Total"]]
                parking_data[lot_name]["Available"] = bit_str.count("0")

        return True
    
    except Exception as e:
        print(f"DB fetch error: {e}")
        return False

def draw_stalls(draw, lot_name, scale):
    bits = lot_camera_bits.get(lot_name, "")
    if lot_name not in lot_coords:
        return

    coords_ordered = [spot for col in reversed(lot_coords[lot_name]) for spot in col]

    for (x, y, stall_num) in coords_ordered:
        xs = int(x * scale)
        ys = int(y * scale)
        r = 6

        if stall_num <= len(bits):
            color = "red" if bits[stall_num - 1] == "1" else "green"
        else:
            color = "gray"

        draw.ellipse((xs - r, ys - r, xs + r, ys + r), fill=color, outline="black")

def show_lot_image(lot_name):
    image_path = parking_data[lot_name]["Image"]
    try:
        img = Image.open(image_path)
        orig_w, orig_h = img.size

        disp_w, disp_h = 500, 700
        scale = min(disp_w / orig_w, disp_h / orig_h)
        new_w, new_h = int(orig_w * scale), int(orig_h * scale)
        img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        draw = ImageDraw.Draw(img_resized)

        # calls helper
        draw_stalls(draw, lot_name, scale)

        bits = lot_camera_bits.get(lot_name, "")

        if bits:
            free_count = bits.count("0")
            parking_data[lot_name]["Available"] = free_count
            if tree:
                tree.set(lot_name, "Available", free_count)

        if img_label:
            tk_img = ImageTk.PhotoImage(img_resized)
            img_label.config(image=tk_img)
            img_label.image = tk_img

    except Exception as e:
        if img_label:
            img_label.config(text=f"Error loading image:\n{e}")

# main with tkinkter popup and demo simulations
def main():
    global root, tree, img_label
    root = tk.Tk()
    root.title("WuPark Prototype")

    frame = tk.Frame(root)
    frame.pack(padx=10, pady=10)

    columns = ("Lot Name", "Total Spots", "Available")
    
    tree = ttk.Treeview(frame, columns=columns, show="headings", height=10)

    for col in columns:
        tree.heading(col, text=col)
    for lot, stats in parking_data.items():
        tree.insert("", "end", iid=lot,
                    values=(lot, stats["Total"], stats["Available"]))
        
    tree.grid(row=0, column=0, padx=10, sticky="n")

    
    img_label = tk.Label(frame)
    img_label.grid(row=0, column=1, padx=10, sticky="n")

    def on_item_click(event):
        selected = tree.focus()
        if selected:
            show_lot_image(selected)

    tree.bind("<ButtonRelease-1>", on_item_click)

    # Show first lot
    first_lot = list(parking_data.keys())[0]
    show_lot_image(first_lot)

    def simulate_updates():
        fetch_latest_status()
        selected = tree.focus() or first_lot
        show_lot_image(selected)
        root.after(3000, simulate_updates)
    
    root.after(1000, simulate_updates)

    root.mainloop()

# for demo purposes
if __name__ == "__main__":
    main()