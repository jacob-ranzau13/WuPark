import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk

# Placeholder data with image paths
parking_data = {
    "Lot A": {"Total": 50, "Available": 12, "Handicapped": 2, "Image": "LotImages/student-parking-WSU.jpg"},
    "Lot B": {"Total": 30, "Available": 5, "Handicapped": 1, "Image": "LotImages/student-parking-WSU.jpg"},
    "Lot C": {"Total": 20, "Available": 0, "Handicapped": 0, "Image": "LotImages/student-parking-WSU.jpg"},
}

def show_lot_image(lot_name, image_path):
    win = tk.Toplevel(root)
    win.title(f"{lot_name} - Parking Lot View")

    try:
        img = Image.open(image_path)
        img = img.resize((400, 300), Image.LANCZOS)  # use LANCZOS instead of deprecated ANTIALIAS
        tk_img = ImageTk.PhotoImage(img)

        label = tk.Label(win, image=tk_img)
        label.image = tk_img  # prevent garbage collection
        label.pack()
    except Exception as e:
        tk.Label(win, text=f"Error loading image:\n{e}").pack()


root = tk.Tk()
root.title("WuPark Prototype")

columns = ("Total Spots", "Available", "Handicapped")
tree = ttk.Treeview(root, columns=columns, show="headings")

for col in columns:
    tree.heading(col, text=col)

for lot, stats in parking_data.items():
    tree.insert("", "end", iid=lot,
                values=(stats["Total"], stats["Available"], stats["Handicapped"]))

tree.pack(padx=10, pady=10)

# Add double-click event to show image
def on_item_double_click(event):
    selected_item = tree.selection()[0]  # get selected lot
    lot_name = selected_item
    image_path = parking_data[lot_name]["Image"]
    show_lot_image(lot_name, image_path)

tree.bind("<Double-1>", on_item_double_click)

root.mainloop()
