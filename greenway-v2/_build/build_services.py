#!/usr/bin/env python3
"""Generate the ten service pages in the new design system."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shell as S
from services_data import SERVICES as DATA

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def unesc(s):
    return s.replace("&amp;", "&").replace("&mdash;", "-").replace("&nbsp;", " ")


def schema(d):
    faq = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": unesc(q),
                        "acceptedAnswer": {"@type": "Answer", "text": unesc(a)}}
                       for q, a in d["faq"]]
    }
    svc = {
        "@context": "https://schema.org", "@type": "Service",
        "name": unesc(d["h1"]) + " - Limerick & Kerry",
        "serviceType": unesc(d["h1"]),
        "description": unesc(d["desc"]),
        "url": f'{S.SITE}/{d["slug"]}.html',
        "areaServed": [{"@type": "AdministrativeArea", "name": "County Limerick"},
                       {"@type": "AdministrativeArea", "name": "County Kerry"}],
        "provider": {
            "@type": "LocalBusiness",
            "name": "Greenway Property Services",
            "telephone": S.PHONE_TEL,
            "url": S.SITE,
            "address": {"@type": "PostalAddress",
                        "streetAddress": "The Old Creamery Enterprise Centre, Farran",
                        "addressLocality": "Ardagh",
                        "addressRegion": "Co. Limerick",
                        "addressCountry": "IE"}},
        "hasOfferCatalog": {
            "@type": "OfferCatalog", "name": unesc(d["h1"]),
            "itemListElement": [{"@type": "Offer",
                                 "itemOffered": {"@type": "Service", "name": unesc(x)}}
                                for x in d["scope"]]}
    }
    crumb = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": S.SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Services",
             "item": S.SITE + "/services.html"},
            {"@type": "ListItem", "position": 3, "name": unesc(d["h1"]),
             "item": f'{S.SITE}/{d["slug"]}.html'}]
    }
    return "\n".join('<script type="application/ld+json">%s</script>'
                     % json.dumps(x, ensure_ascii=False, separators=(",", ":"))
                     for x in (svc, faq, crumb))


def related(slug):
    others = [s for s in S.SERVICES if s[0] != slug][:0] or \
             [s for s in S.SERVICES if s[0] != slug]
    # take the three that follow this one in the list, wrapping
    idx = [i for i, s in enumerate(S.SERVICES) if s[0] == slug][0]
    pick = [S.SERVICES[(idx + n) % len(S.SERVICES)] for n in (1, 2, 3)]
    tiles = "\n".join(
        f'''      <a class="tile" href="{s}.html" style="display:block;">
        <h3>{n}</h3>
        <p>{blurb}</p>
      </a>''' for s, n, blurb in pick)
    return f'''
  <section class="section section--warm">
    <div class="shell">
      <p class="eyebrow" data-reveal>Often needed alongside</p>
      <div class="tiles" data-reveal style="margin-top:1.6rem;">
{tiles}
      </div>
      <p data-reveal style="margin-top:1.6rem;">
        <a class="btn btn--line" href="services.html">Every service &nbsp;&rarr;</a>
      </p>
    </div>
  </section>
'''


def build(d):
    situ = "\n".join(
        f'      <h2 data-reveal>{h}</h2>\n      <p data-reveal>{p}</p>'
        for h, p in d["situation"])
    signs = "\n".join(f'          <li>{x}</li>' for x in d["signs"])
    steps = "\n".join(
        f'''        <div class="step" data-reveal>
          <div><h3>{h}</h3><p>{p}</p></div>
        </div>''' for h, p in d["method"])
    factors = "\n".join(
        f'''        <div class="factor" data-reveal>
          <h3>{h}</h3><p>{p}</p>
        </div>''' for h, p in d["price_factors"])
    scope = "\n".join(f'          <li>{x}</li>' for x in d["scope"])
    faq = "\n".join(
        f'''        <details>
          <summary>{q}</summary>
          <div><p>{a}</p></div>
        </details>''' for q, a in d["faq"])

    html = S.head(d["title"], d["desc"], d["slug"],
                  preload_poster=d["poster"], extra=schema(d))
    html += S.NAV
    html += S.pagehead(d["h1"], d["lede"], "Services", poster=d["poster"])

    html += f'''
  <section class="section">
    <div class="shell">
      <div class="split--wide" style="display:grid;">
        <div class="rich">
{situ}
        </div>
        <aside data-reveal>
          <div class="panel panel--accent">
            <p class="panel__label">Signs you need this</p>
            <ul class="checks">
{signs}
            </ul>
          </div>
          <div class="panel" style="margin-top:1rem;">
            <p class="panel__label">What we cover</p>
            <ul class="checks">
{scope}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="shell">
      <p class="eyebrow" data-reveal>How the job runs</p>
      <h2 class="display" data-reveal style="margin-top:1.1rem;max-width:16ch;">In order, and in writing.</h2>
      <div class="steps" data-reveal style="margin-top:2.4rem;">
{steps}
      </div>
    </div>
  </section>

  <section class="section section--warm">
    <div class="shell">
      <p class="eyebrow" data-reveal>Before you get quotes</p>
      <h2 class="display" data-reveal style="margin-top:1.1rem;max-width:20ch;">What determines the price.</h2>
      <p class="lead" data-reveal style="margin-top:1.2rem;max-width:60ch;">
        We do not publish figures, because a figure without a site visit is a guess.
        These are the variables that actually move the number - worth understanding
        whoever you end up using.
      </p>
      <div class="factors" data-reveal style="margin-top:2.6rem;">
{factors}
      </div>
      <div class="panel panel--accent" data-reveal style="margin-top:2.6rem;max-width:68ch;">
        <p class="panel__label">When you don't need us</p>
        <p>{d["not_needed"]}</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell shell--narrow">
      <p class="eyebrow" data-reveal>Questions</p>
      <h2 class="display" data-reveal style="margin-top:1.1rem;">Straight answers.</h2>
      <div class="faq" data-reveal style="margin-top:2.2rem;">
{faq}
      </div>
    </div>
  </section>
'''
    html += related(d["slug"])
    html += S.areas_block()
    html += S.cta()
    html += "\n</main>\n"
    html += S.footer()
    return html


n = 0
for d in DATA:
    path = os.path.join(OUT, d["slug"] + ".html")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(build(d))
    n += 1
    print("  %-46s %6.1f KB" % (d["slug"] + ".html", os.path.getsize(path) / 1024))
print("  %d service pages built" % n)
