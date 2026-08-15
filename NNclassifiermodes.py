import glob, os, numpy as np
from PIL import Image

# ---------------------------------------------------------------- config
REF_DIR   = r"C:/Users/admin/Desktop/pokeicons"           # folder of 112x112 sprite PNGs
SHOTS_DIR = r"C:/Users/admin/Desktop/Screenshots"
SIZE      = 64
RED       = (133, 2, 52)          # <-- put YOUR eyedropped value here
BOX = lambda d: (1866, 155 + 126 * d, 1978, 267 + 126 * d)

# choose one:
#   "cosine"          -> mean-center + L2-normalize, dot product   (what you have now)
#   "euclid_norm"     -> normalized but NOT centered, euclidean distance
#   "euclid_raw"      -> NO centering, NO normalizing, euclidean distance (the naive version)
MODE = "euclid_raw"

# ---------------------------------------------------------------- vectorization
def vec(img):
    img = img.convert("RGBA")
    bg = Image.new("RGBA", img.size, RED + (255,))
    img = Image.alpha_composite(bg, img).convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
    v = np.asarray(img, np.float32).ravel()
    if MODE == "cosine":
        v = v - v.mean()
        n = np.linalg.norm(v); v = v / n if n else v
    elif MODE == "euclid_norm":
        n = np.linalg.norm(v); v = v / n if n else v      # normalize only, no centering
    elif MODE == "euclid_raw":
        pass                                               # raw pixels, nothing done
    else:
        raise SystemExit("bad MODE")
    return v

# ---------------------------------------------------------------- build reference matrix
files  = glob.glob(REF_DIR + "/*.png")
if not files:
    raise SystemExit(f"No sprites found in {REF_DIR}")
labels = [os.path.splitext(os.path.basename(f))[0] for f in files]
M = np.stack([vec(Image.open(f)) for f in files])
print(f"MODE={MODE}  |  {len(labels)} refs at {SIZE}x{SIZE}\n")

# ---------------------------------------------------------------- scoring
def top5(crop):
    q = vec(crop)
    if MODE == "cosine":
        scores = M @ q                          # higher = better
        idx = np.argsort(-scores)[:5]
        return [(labels[i], float(scores[i])) for i in idx]
    else:
        dist = np.linalg.norm(M - q, axis=1)    # lower = better
        idx = np.argsort(dist)[:5]
        return [(labels[i], float(dist[i])) for i in idx]

# ---------------------------------------------------------------- run
latest = max(glob.glob(SHOTS_DIR + "/*.png") + glob.glob(SHOTS_DIR + "/*.jpg"),
             key=os.path.getmtime)
print(f"Screenshot: {os.path.basename(latest)}\n")
img = Image.open(latest)

arrow = "(higher=better)" if MODE == "cosine" else "(lower=better)"
for d in range(6):
    print(f"slot {d}:  {arrow}")
    for rank, (name, score) in enumerate(top5(img.crop(BOX(d))), 1):
        print(f"   {rank}. {name:<26} {score:.3f}")
    print()