#!/usr/bin/env python3
"""
Re-crop the hero photograph.

The shipped hero was 58% sky with the horizon at 52% of the frame, so the top
half of the tallest, most valuable element on the site was empty grey cloud and
the premises itself was squeezed into the bottom third behind the scrim.

This crops from the 1560x1170 original with the horizon pushed up to ~30%, so
the yard, the building and the van fill the frame. Sky is kept as a band, not
as the subject.
"""
import os
import numpy as np
from PIL import Image

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

SRC = "images/building.jpg"
OUT = "hero-loop"
RATIO = 16 / 9
HORIZON_AT = 0.30          # where the horizon should sit in the finished frame
WIDTHS = (800, 1200, 1600)

im = Image.open(SRC).convert("RGB")
w, h = im.size

# Find the horizon in the source: first row where sky-like pixels drop below 40%.
a = np.asarray(im, float)
mx, mn = a.max(2), a.min(2)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
sky = (a[..., 2] >= a[..., 0]) & (mx > 70) & (sat < 0.45)
rows = sky.mean(1)
horizon = next((y for y in range(h) if rows[y] < .4), h // 2)
print("  source %dx%d, horizon at y=%d (%.0f%% down)" % (w, h, horizon, horizon / h * 100))

# Tallest 16:9 crop the source allows.
crop_h = min(h, int(w / RATIO))
crop_w = int(crop_h * RATIO)

# Place the crop so the horizon lands at HORIZON_AT, clamped to the image.
top = int(horizon - crop_h * HORIZON_AT)
top = max(0, min(top, h - crop_h))
left = (w - crop_w) // 2
im = im.crop((left, top, left + crop_w, top + crop_h))
print("  crop %dx%d at (%d,%d) -> horizon now %.0f%% down"
      % (crop_w, crop_h, left, top, (horizon - top) / crop_h * 100))

total = 0
for width in WIDTHS:
    r = im.resize((width, int(width / RATIO)), Image.LANCZOS)
    # The 800w WebP is the LCP on mobile; keep it under 35 KB.
    for ext, kw in (("webp", dict(quality=70 if width == 800 else (62 if width == 1200 else 56), method=6)),
                    ("jpg", dict(quality=70, optimize=True, progressive=True))):
        p = "media/%s-%d.%s" % (OUT, width, ext)
        r.save(p, **kw)
        total += os.path.getsize(p)
        print("  %-30s %6.1f KB" % (os.path.basename(p), os.path.getsize(p) / 1024))
print("  %.0f KB total" % (total / 1024))

# Confirm the result.
a = np.asarray(Image.open("media/%s-1600.jpg" % OUT).convert("RGB"), float)
mx, mn = a.max(2), a.min(2)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
sky = (a[..., 2] >= a[..., 0]) & (mx > 70) & (sat < 0.45)
print("  finished frame: %.0f%% sky (was 58%%)" % (sky.mean() * 100))
