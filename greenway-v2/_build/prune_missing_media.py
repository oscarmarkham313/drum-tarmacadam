#!/usr/bin/env python3
"""
Remove <source data-src="..."> entries whose file is not on disk.

The brief is explicit: do not fake the videos. Until the four clips are
supplied, shipping the <source> tags would mean every visitor's browser fires a
404 for each one. So the tags are stripped and replaced by a comment naming the
missing file - drop the file into media/ and rerun this to restore it.
"""
import glob, io, os, re

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

PAT = re.compile(r'[ \t]*<source[^>]*data-src="(?P<f>[^"]+)"[^>]*>\n?')
missing, touched = set(), 0

for page in sorted(glob.glob("*.html")):
    t = io.open(page, encoding="utf-8").read()

    def sub(m):
        f = m.group("f")
        if os.path.exists(f):
            return m.group(0)
        missing.add(f)
        return "      <!-- awaiting %s -->\n" % f

    out = PAT.sub(sub, t)
    if out != t:
        io.open(page, "w", encoding="utf-8", newline="\n").write(out)
        touched += 1

print("  pages rewritten: %d" % touched)
for f in sorted(missing):
    print("  MISSING: %s" % f)
