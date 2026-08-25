"""
Shared page shell for greenwaypropertyservices.ie

Every page is generated from this one template so nav, footer, head, pixel and
conversion wiring can never drift between pages.
"""

PHONE_TEL = "+353830301799"
PHONE_TXT = "083 030 1799"
SITE = "https://greenwaypropertyservices.ie"
ADDRESS = "The Old Creamery Enterprise Centre, Farran, Ardagh, Co. Limerick"

# ---------------------------------------------------------------------------
# Meta pixel
# ---------------------------------------------------------------------------
# Greenway does not yet have its own pixel: the only dataset on ad account
# 1141438160884116 belongs to oneclickgo.ie, and Meta allows one dataset per
# ad account. Set PIXEL_ID once a dedicated Greenway pixel exists and rerun
# the build - the loader below is already wired, including the Lead event on
# /thank-you.html. Until then it is inert and fires nothing.
PIXEL_ID = ""   # e.g. "1234567890"

SERVICES = [
    ("property-maintenance-limerick", "Property maintenance",
     "Planned and reactive maintenance for landlords, businesses and homeowners."),
    ("grounds-maintenance-limerick", "Grounds &amp; grass cutting",
     "Grass, hedges, weed control and seasonal clean-ups, one-off or on contract."),
    ("drain-cleaning-limerick", "Drainage &amp; gullies",
     "Blockages cleared, gullies maintained, surface water managed properly."),
    ("tarmacadam-limerick", "Tarmacadam &amp; surfacing",
     "Driveways, car parks and roadways, built from the base course up."),
    ("white-lining-car-park-markings-limerick", "White lining &amp; car parks",
     "Bay markings, accessible bays, arrows and road markings."),
    ("power-washing-limerick", "Power washing",
     "Driveways, patios, forecourts and building exteriors brought back."),
    ("painting-decorating-limerick", "Painting &amp; decorating",
     "Interior and exterior, with the preparation that makes it last."),
    ("carpentry-limerick", "Carpentry &amp; joinery",
     "Doors, flooring, built-in storage and second-fix work."),
    ("window-fitting-limerick", "Windows &amp; doors",
     "Installation, replacement, glazing, locks and draught proofing."),
    ("commercial-cleaning-limerick", "Commercial cleaning",
     "Deep cleans, end-of-tenancy and industrial cleaning."),
]

TOWNS = ["Limerick City", "Ardagh", "Adare", "Newcastle West", "Rathkeale", "Askeaton",
         "Croom", "Kilmallock", "Abbeyfeale", "Foynes", "Patrickswell", "Castleconnell",
         "Caherconlish", "Bruff", "Dromcollogher", "Pallaskenry", "Glin", "Shanagolden",
         "Athea", "Annacotty", "Murroe", "Cappamore",
         "Tralee", "Killarney", "Listowel", "Castleisland", "Abbeydorney", "Tarbert"]


def _pixel_head():
    if not PIXEL_ID:
        return ("<!-- Meta pixel: awaiting a dedicated Greenway dataset. "
                "Set PIXEL_ID in _build/site.py and rebuild. -->")
    return f"""<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','{PIXEL_ID}');fbq('track','PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={PIXEL_ID}&ev=PageView&noscript=1"></noscript>"""


def pixel_lead():
    """Lead event - only emitted on the thank-you page."""
    if not PIXEL_ID:
        return ("<!-- Lead event fires here once PIXEL_ID is set. -->")
    return ("<script>if(typeof fbq==='function'){fbq('track','Lead');}</script>")


def head(title, desc, slug, preload_poster=None, extra=""):
    canonical = SITE + "/" + ("" if slug == "index" else slug + ".html")
    noindex = '\n<meta name="robots" content="noindex, follow">' if slug == "thank-you" else ""
    preload = ""
    if preload_poster:
        preload = (f'<link rel="preload" as="image" href="media/{preload_poster}-800.webp"\n'
                   f'      imagesrcset="media/{preload_poster}-800.webp 800w, '
                   f'media/{preload_poster}-1200.webp 1200w"\n'
                   f'      imagesizes="100vw" fetchpriority="high">')
    return f"""<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">{noindex}
<meta name="geo.region" content="IE-LK">
<meta name="geo.placename" content="Ardagh, Co. Limerick">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Greenway Property Services">
<meta property="og:locale" content="en_IE">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}/media/hero-loop-1600.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="font" type="font/woff2" href="fonts/inter.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="fonts/instrumentserif.woff2" crossorigin>
{preload}
<link rel="stylesheet" href="css/app.css">
<link rel="icon" href="images/logo-mark.png">
<meta name="theme-color" content="#0B1B33">
{_pixel_head()}
{extra}
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>
"""


NAV = """
<header class="nav on-dark" data-nav>
  <div class="shell nav__inner">
    <a class="nav__brand" href="/" aria-label="Greenway Property Services - home">
      <picture><source srcset="images/logo-mark.webp" type="image/webp"><img src="images/logo-mark.png" width="239" height="96" alt="Greenway Property Services" style="height:40px;width:auto;"></picture>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="residential.html">Residential</a>
      <a href="commercial.html">Commercial</a>
      <a href="projects.html">Work</a>
      <a href="about.html">About</a>
    </nav>
    <div class="nav__actions">
      <a class="nav__phone" href="tel:PHONE_TEL">PHONE_TXT</a>
      <a class="btn btn--gold" href="contact.html">Request a quote</a>
      <button class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="menu">
        <span></span><span class="visually-hidden">Menu</span>
      </button>
    </div>
  </div>
</header>

<div class="menu on-dark" id="menu" data-menu hidden>
  <a href="residential.html">Residential</a>
  <a href="commercial.html">Commercial</a>
  <a href="services.html">Services</a>
  <a href="projects.html">Work</a>
  <a href="about.html">About</a>
  <a href="contact.html">Contact</a>
  <a href="tel:PHONE_TEL">PHONE_TXT</a>
</div>
""".replace("PHONE_TEL", PHONE_TEL).replace("PHONE_TXT", PHONE_TXT)


def footer():
    svc = "\n".join(
        f'          <a href="{s}.html">{n}</a>' for s, n, _ in SERVICES[:6])
    return f"""
<footer class="footer on-dark">
  <div class="shell">
    <div class="footer__grid">
      <div>
        <picture><source srcset="images/logo-mark.webp" type="image/webp"><img src="images/logo-mark.png" width="239" height="96" alt="Greenway Property Services" style="height:44px;width:auto;" loading="lazy"></picture>
        <p style="margin-top:1.2rem;max-width:32ch;">Complete property maintenance and
          facilities management across Limerick and Kerry.</p>
      </div>
      <div>
        <h2>Site</h2>
        <div class="footer__links">
          <a href="residential.html">Residential</a>
          <a href="commercial.html">Commercial</a>
          <a href="services.html">Services</a>
          <a href="projects.html">Work</a>
          <a href="testimonials.html">Reviews</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
      <div>
        <h2>Services</h2>
        <div class="footer__links">
{svc}
          <a href="services.html">All services</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <span>&copy; 2026 Greenway Property Services</span>
      <span>{ADDRESS}</span>
      <span><a href="privacy.html">Privacy</a> &nbsp;&middot;&nbsp; <a href="terms.html">Terms</a></span>
    </div>
  </div>
</footer>

<div class="sticky-call" data-sticky-call>
  <a class="btn btn--gold" href="tel:{PHONE_TEL}">Call {PHONE_TXT}</a>
</div>

<div class="dev-flag">Preview &middot; placeholder media</div>

<script src="js/motion.js" defer></script>
</body>
</html>
"""


def pagehead(title, lede, crumb_label, poster=None):
    """Standard inner-page header. Uses a poster band when one is given."""
    crumb = (f'<p class="crumb"><a href="/">Home</a> &nbsp;/&nbsp; {crumb_label}</p>')
    if not poster:
        return f"""
<main id="main">
  <section class="pagehead">
    <div class="shell">
      {crumb}
      <h1 class="pagehead__title">{title}</h1>
      <p class="pagehead__lede">{lede}</p>
    </div>
  </section>
  <span data-nav-sentinel aria-hidden="true"></span>
"""
    return f"""
<main id="main">
  <section class="pagehead media on-dark" data-hero>
    <picture class="media__poster">
      <source type="image/webp" srcset="media/{poster}-800.webp 800w, media/{poster}-1200.webp 1200w" sizes="100vw">
      <img src="media/{poster}-1200.jpg" srcset="media/{poster}-800.jpg 800w, media/{poster}-1200.jpg 1200w"
           sizes="100vw" alt="" width="1200" height="675" fetchpriority="high" decoding="async">
    </picture>
    <div class="media__scrim"></div>
    <div class="shell" style="position:relative;z-index:2;">
      {crumb}
      <h1 class="pagehead__title">{title}</h1>
      <p class="pagehead__lede">{lede}</p>
    </div>
  </section>
  <span data-nav-sentinel aria-hidden="true"></span>
"""


def cta(heading="Tell us what needs doing.",
        sub="Free site visit, free assessment, itemised quote. No obligation either way."):
    """Closing block - deliberately separates the urgent caller from the planner."""
    return f"""
  <section class="section section--deep">
    <div class="shell shell--narrow" style="text-align:center;">
      <h2 class="display" data-reveal style="margin-inline:auto;max-width:16ch;">{heading}</h2>
      <p class="lead" data-reveal style="margin:1.4rem auto 0;">{sub}</p>
      <div data-reveal style="margin-top:2.4rem;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap;">
        <a class="btn btn--gold" href="contact.html">Request a quote</a>
        <a class="btn btn--ghost" href="tel:{PHONE_TEL}">Call {PHONE_TXT}</a>
      </div>
      <p data-reveal style="margin-top:1.4rem;font-size:.85rem;color:rgba(255,255,255,.5);">
        Something urgent? Call - 24/7 emergency call-outs.
      </p>
    </div>
  </section>
"""


def areas_block(dark=False):
    towns = " &nbsp;&middot;&nbsp; ".join(TOWNS)
    cls = " section--dark" if dark else ""
    return f"""
  <section class="section{cls}">
    <div class="shell shell--narrow">
      <p class="eyebrow" data-reveal>Where we work</p>
      <h2 class="display" data-reveal style="margin-top:1.1rem;">Limerick and Kerry.</h2>
      <p class="lead" data-reveal style="margin-top:1.2rem;">Based at the Old Creamery
        Enterprise Centre in Ardagh, Co. Limerick, working across the county and into Kerry.</p>
      <p class="area-list" data-reveal style="margin-top:1.6rem;">{towns}</p>
    </div>
  </section>
"""
