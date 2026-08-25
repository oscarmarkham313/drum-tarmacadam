#!/usr/bin/env python3
"""
Inline the stylesheet into every page.

css/app.css was the only render-blocking request on the site: the browser had
to parse the HTML, discover the link, open a request and wait for 8.9 KB before
it could paint anything. At 8.2 KB gzipped the whole sheet fits inside the
initial congestion window alongside the HTML, so inlining it puts the entire
render-critical payload in the first round trip and removes the request.

Inlining everything rather than extracting a "critical" subset is deliberate:
a subset means the rest arrives later, and any rule that belongs above the fold
but was missed produces a visible flash — including the hero entrance, which
would flash visible, then hidden, then animate. There is no such failure mode
here.

The source file keeps its comments and formatting; only the inlined copy is
minified. Re-running replaces the existing block, so this is idempotent and
safe to run on every build.
"""
import glob
import io
import os
import re

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

LINK = re.compile(r'[ \t]*<link rel="stylesheet" href="css/app\.css">\n?')
BLOCK = re.compile(r'[ \t]*<style id="app-css">.*?</style>\n?', re.S)


def minify(css):
    """
    Deliberately conservative. It strips comments and collapses whitespace, and
    does NOT touch ':' or ',' or spaces between selectors — removing a space in
    '.a .b' would silently change it to '.a.b', and '@media (x)' breaks without
    its space. The win here is mostly the comments, which are a third of the
    file.
    """
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};])\s*', r'\1', css)
    css = re.sub(r';}', '}', css)
    return css.strip()


raw = io.open("css/app.css", encoding="utf-8").read()

# url() paths in the stylesheet are relative to css/, one level down. Inlined
# into a page at the site root, "../fonts/inter.woff2" would resolve above the
# root and every @font-face would silently fail. Strip the one level.
rebased, hits = re.subn(r"""url\(\s*(['"]?)\.\./""", r"url(\g<1>", raw)
print("  rebased %d url() path(s) out of css/" % hits)

small = minify(rebased)
print("  css %.1f KB -> %.1f KB inlined (%.0f%% smaller)"
      % (len(raw) / 1024, len(small) / 1024, (1 - len(small) / len(raw)) * 100))

style = '<style id="app-css">%s</style>\n' % small

n = 0
for page in sorted(glob.glob("*.html")):
    t = io.open(page, encoding="utf-8").read()
    if BLOCK.search(t):
        out = BLOCK.sub(lambda _: style, t, count=1)
    elif LINK.search(t):
        out = LINK.sub(lambda _: style, t, count=1)
    else:
        continue
    if out != t:
        io.open(page, "w", encoding="utf-8", newline="\n").write(out)
        n += 1

print("  %d pages inlined" % n)

# Nothing should still be requesting the stylesheet.
left = [p for p in glob.glob("*.html")
        if 'href="css/app.css"' in io.open(p, encoding="utf-8").read()]
print("  pages still linking app.css: %s" % (left or "none"))

bad = [p for p in glob.glob("*.html")
       if "url(../" in io.open(p, encoding="utf-8").read()
       or "url('../" in io.open(p, encoding="utf-8").read()]
print("  pages with unrebased url() paths: %s" % (bad or "none"))
