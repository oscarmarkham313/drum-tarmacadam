#!/usr/bin/env python3
"""
Build the whole site. Run this, not the individual scripts.

    python _build/build.py

Order matters:
  1. build_services  - the ten service pages from services_data.py
  2. build_pages     - every other page
  3. prune_missing_media - strip <source> tags for videos not on disk
  4. inline_css      - swap the stylesheet link for an inline block

inline_css MUST run last: it rewrites finished HTML, so anything that
regenerates a page afterwards would put the render-blocking link back.
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
STEPS = ["build_services.py", "build_pages.py",
         "prune_missing_media.py", "inline_css.py"]

env = dict(os.environ, PYTHONIOENCODING="utf-8")
for step in STEPS:
    print("\n== %s" % step)
    r = subprocess.run([sys.executable, os.path.join(HERE, step)], env=env)
    if r.returncode:
        sys.exit("build failed at %s" % step)

print("\nbuild complete")
