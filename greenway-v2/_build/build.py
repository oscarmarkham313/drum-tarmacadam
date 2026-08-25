#!/usr/bin/env python3
"""
Build the whole site. Run this, not the individual scripts.

    python _build/build.py

Order matters:
  1. build_services  - the ten service pages from services_data.py
  2. build_pages     - every other page
  3. prune_missing_media - strip <source> tags for videos not on disk
  4. build_css       - minify css/app.css to the css/app.min.css that ships

Edit css/app.css, never css/app.min.css - the latter is overwritten here.
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
STEPS = ["build_services.py", "build_pages.py",
         "prune_missing_media.py", "build_css.py"]

env = dict(os.environ, PYTHONIOENCODING="utf-8")
for step in STEPS:
    print("\n== %s" % step)
    r = subprocess.run([sys.executable, os.path.join(HERE, step)], env=env)
    if r.returncode:
        sys.exit("build failed at %s" % step)

print("\nbuild complete")
