import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk, ImageDraw

# Placeholder data with image paths
parking_data = {
    "Lot9E": {
        "Total": 50,
        "Available": 12,
        "Handicapped": 2,
        "Image": "LotImages/Lot9E.png",
        "Spots": [
            {"coords": [50, 50, 100, 100], "available": True},
            {"coords": [120, 50, 170, 100], "available": False}
        ]
    },
    "Lot6": {
        "Total": 30,
        "Available": 5,
        "Handicapped": 1,
        "Image": "LotImages/Lot6.png",
        "Spots": [
            {"coords": [30, 30, 80, 80], "available": False},
            {"coords": [100, 30, 150, 80], "available": True}
        ]
    },
    "LotJBC": {
        "Total": 20,
        "Available": 0,
        "Handicapped": 0,
        "Image": "LotImages/LotJBC.png",
        "Spots": [
            {"coords": [20, 20, 70, 70], "available": False},
            {"coords": [90, 20, 140, 70], "available": False}
        ]
    },
}


def show_lot_image(lot_name):
    lot_info = parking_data[lot_name]
    try:
        img = Image.open(lot_info["Image"])
        draw = ImageDraw.Draw(img)

        # Draw red/green boxes for spots
        for spot in lot_info["Spots"]:
            color = "green" if spot["available"] else "red"
            draw.rectangle(spot["coords"], outline=color, width=3)

        # Auto-resize to fit the image frame
        max_width = 400
        max_height = 300
        orig_width, orig_height = img.size
        scale = min(max_width / orig_width, max_height / orig_height)
        new_size = (int(orig_width * scale), int(orig_height * scale))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

        tk_img = ImageTk.PhotoImage(img)

        # Update the label
        img_label.configure(image=tk_img)
        img_label.image = tk_img

    except Exception as e:
        print(f"Error loading image: {e}")


root = tk.Tk()
root.title("WuPark Prototype")

frame = tk.Frame(root)
frame.pack(padx=10, pady=10)

columns = ("Lot Name", "Total Spots", "Available", "Handicapped")
tree = ttk.Treeview(frame, columns=columns, show="headings", height=10)

for col in columns:
    tree.heading(col, text=col)

for lot, stats in parking_data.items():
    tree.insert("", "end", iid=lot,
                values=(lot, stats["Total"], stats["Available"], stats["Handicapped"]))

tree.grid(row=0, column=0, padx=10, sticky="n")

img_label = tk.Label(frame)
img_label.grid(row=0, column=1, padx=10, sticky="n")

def on_item_click(event):
    selected = tree.focus()
    if selected:
        show_lot_image(selected)

tree.bind("<ButtonRelease-1>", on_item_click)

# Show first lot by default
first_lot = list(parking_data.keys())[0]
show_lot_image(first_lot)

root.mainloop()
