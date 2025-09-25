import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk, ImageDraw

# Placeholder data with image paths
parking_data = {
    "Lot9E": {
        "Total": 50, "Available": 12,
        "Image": "LotImages/Lot9E.png",
    },
    "Lot6": {
        "Total": 40, "Available": 5,
        "Image": "LotImages/Lot6.png",
    },
    "LotJBC": {
        "Total": 36, "Available": 0,
        "Image": "LotImages/LotJBC.png",
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

lot_camera_bits = { 
    "LotJBC": "101100110101011011110000000011111010"  # hardcoded chunk of json sent from pi
}

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

        bits = lot_camera_bits.get(lot_name, "")

        if bits:
            available_count = sum(1 for b in bits if b == "0")
            tree.set(lot_name, "Available", available_count)

        # calls helper
        draw_stalls(draw, lot_name, scale)


        tk_img = ImageTk.PhotoImage(img_resized)

        img_label.config(image=tk_img)
        img_label.image = tk_img 

    except Exception as e:
        img_label.config(text=f"Error loading image:\n{e}")


root = tk.Tk()
root.title("WuPark Prototype")

frame = tk.Frame(root)
frame.pack(padx=10, pady=10)

columns = ("Lot Name", "Total Spots", "Available")  # add a handicapped feature later
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

# This shows the first lot image automatically when you open the window
first_lot = list(parking_data.keys())[0]
show_lot_image(first_lot)

root.mainloop()
