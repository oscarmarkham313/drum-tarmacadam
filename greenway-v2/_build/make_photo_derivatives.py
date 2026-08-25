#!/usr/bin/env python3
"""
Build responsive derivatives of the client-supplied photographs.

The originals in images/ are 130-280 KB single-size files. Nothing on the site
should ship a 280 KB image to a 390px phone, so each one is emitted at 800w and
1200w in WebP and JPEG. Originals are left untouched.
"""
import os
from PIL import Image

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

PHOTOS = {
    "office-refurbishment-fitout":     "photo-office",
    "property-renovation-kitchen":     "photo-kitchen",
    "tarmac-white-lining-car-park":    "photo-tarmac",
    "drainage-gully-cleaning":         "photo-drainage",
    "garden-maintenance-grass-hedge":  "photo-grounds",
    "commercial-cleaning-floor-scrub": "photo-cleaning",
}

WIDTHS = (800, 1200)
RATIO = 16 / 9

total = 0
for src_name, out_name in PHOTOS.items():
    src = "images/%s.jpg" % src_name
    im = Image.open(src).convert("RGB")

    # Centre-crop to 16:9 so every card is the same shape and nothing shifts.
    w, h = im.size
    if w / h > RATIO:
        new_w = int(h * RATIO)
        im = im.crop(((w - new_w) // 2, 0, (w - new_w) // 2 + new_w, h))
    else:
        new_h = int(w / RATIO)
        im = im.crop((0, (h - new_h) // 2, w, (h - new_h) // 2 + new_h))

    for width in WIDTHS:
        r = im.resize((width, int(width / RATIO)), Image.LANCZOS)
        for ext, kw in (("webp", dict(quality=72, method=6)),
                        ("jpg", dict(quality=76, optimize=True, progressive=True))):
            p = "media/%s-%d.%s" % (out_name, width, ext)
            r.save(p, **kw)
            total += os.path.getsize(p)
            print("  %-32s %6.1f KB" % (os.path.basename(p), os.path.getsize(p) / 1024))

print("  %d files, %.0f KB total" % (len(PHOTOS) * len(WIDTHS) * 2, total / 1024))
