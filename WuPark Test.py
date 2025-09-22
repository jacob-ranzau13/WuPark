import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk

# Placeholder data
parking_data = {
    "Lot A": {"Total": 50, "Available": 12, "Handicapped": 2},
    "Lot B": {"Total": 30, "Available": 5, "Handicapped": 1},
    "Lot C": {"Total": 20, "Available": 0, "Handicapped": 0},
}

def show_lot_image(lot_name, LotImages):
    win = tk.Toplevel(root)
    win.title(f"{lot_name} - Parking Lot View")

    try:
        img = Image.open(LotImages)
        img = img.resize((400, 300), Image.ANTIALIAS)
        tk_img = ImageTk.PhotoImage(img)

        label = tk.Label(win, image=tk_img)
        label.image = tk_img  # keep reference
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


root.mainloop()