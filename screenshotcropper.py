from PIL import Image
import glob, os

print(glob.glob(r"C:/Users/admin/Desktop/Screenshots/*"))
latest = max(glob.glob(r"C:/Users/admin/Desktop/Screenshots/*.jpg"), key=os.path.getmtime)
img = Image.open(latest)


boxes = [(1866, 155+126*d, 1978, 267+126*d) for d in range(6)]
out = r"C:/Users/admin/Desktop/crops"
os.makedirs(out, exist_ok=True)
for i, box in enumerate(boxes):
    img.crop(box).save(f"{out}/crop_{i}.png")