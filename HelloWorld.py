import tkinter as tk

root = tk.Tk()
root.title("Hello World App")

label = tk.Label(root, text="Hello, World!", font=("Arial", 24))
label.pack(padx=100, pady=100)

root.mainloop()