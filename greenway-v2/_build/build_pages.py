#!/usr/bin/env python3
"""Generate every non-service page."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shell as S

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def write(slug, html):
    p = os.path.join(OUT, slug + ".html")
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("  %-24s %6.1f KB" % (slug + ".html", os.path.getsize(p) / 1024))


def ld(obj):
    return ('<script type="application/ld+json">%s</script>'
            % json.dumps(obj, ensure_ascii=False, separators=(",", ":")))


def crumbs(*pairs):
    return ld({"@context": "https://schema.org", "@type": "BreadcrumbList",
               "itemListElement": [
                   {"@type": "ListItem", "position": i + 1, "name": n,
                    "item": S.SITE + u} for i, (n, u) in enumerate(pairs)]})


# =========================================================== services hub
items = "\n".join(
    f'''      <a href="{s}.html">
        <h2>{n}</h2>
        <p>{b}</p>
        <span class="door__more">Read more &nbsp;&rarr;</span>
      </a>''' for s, n, b in S.SERVICES)

html = S.head(
    "Services | Property Maintenance Limerick &amp; Kerry | Greenway",
    "Ten property maintenance services across Limerick and Kerry - maintenance, "
    "grounds, drainage, tarmacadam, line marking, power washing, decorating, "
    "carpentry, windows and commercial cleaning.",
    "services",
    extra=crumbs(("Home", "/"), ("Services", "/services.html")) + "\n" + ld({
        "@context": "https://schema.org", "@type": "ItemList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1,
             "name": n.replace("&amp;", "&"),
             "url": f"{S.SITE}/{s}.html"} for i, (s, n, _) in enumerate(S.SERVICES)]}))
html += S.NAV
html += S.pagehead("Everything a building needs.",
                   "Ten trades under one number, across Limerick and Kerry. "
                   "Most jobs need more than one of them - which is the whole point.",
                   "Services")
html += f'''
  <section class="section">
    <div class="shell">
      <div class="svc-index" data-reveal>
{items}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="shell shell--narrow">
      <p class="eyebrow" data-reveal>Why one contractor</p>
      <h2 class="display" data-reveal style="margin-top:1.1rem;max-width:18ch;">The gaps between trades are where jobs go wrong.</h2>
      <div class="prose" data-reveal style="margin-top:1.6rem;">
        <p>A leak damages a ceiling. The ceiling needs a plasterer, then a decorator.
          The decorator cannot start until the plaster is dry, and the plasterer will
          not come until the leak is fixed. Run that yourself and it is three phone
          calls, two no-shows and a fortnight.</p>
        <p>We scope all of it, sequence all of it, and put it on one quote. You get
          one number to ring and one person accountable for the result.</p>
      </div>
      <p data-reveal style="margin-top:2rem;">
        <a class="btn btn--gold" href="contact.html">Request a quote</a>
      </p>
    </div>
  </section>
'''
html += S.areas_block()
html += S.cta()
html += "\n</main>\n" + S.footer()
write("services", html)


# =============================================================== projects
# Only six distinct photographs exist: transition-interior is the same shot as
# photo-kitchen, transition-tarmac the same as photo-tarmac, transition-grounds
# the same as photo-grounds - each pair is one image cropped two ways. Mixing
# the pairs meant the kitchen shot appeared four times across these nine cases.
# Nine cases against six photographs means three must repeat; this ordering
# caps every one at two uses and never places a repeat next to itself.
CASES = [
    ("Commercial", "Office refurbishment - Limerick City",
     "Full internal refurbishment of a 3,000 sq ft office space including new "
     "flooring, painting, electrical upgrades and partition walls.",
     "photo-office"),
    ("Surfacing", "Tarmac and white lining - business park",
     "Complete resurfacing of a business park car park with new tarmac and "
     "professional white lining for parking bays.", "photo-tarmac"),
    ("Residential", "Full property renovation - Ardagh",
     "Complete renovation of a 4-bedroom residential property including kitchen, "
     "bathrooms, flooring and external redecoration.", "photo-kitchen"),
    ("Cleaning", "Commercial deep clean - industrial unit",
     "Full industrial deep clean of a 10,000 sq ft warehouse including pressure "
     "washing, floor scrubbing and sanitisation.", "photo-cleaning"),
    ("Drainage", "Drainage and gully clearing - Co. Limerick",
     "Emergency storm drain clearing and a surface water management system "
     "installed for a commercial property at risk of flooding.", "photo-drainage"),
    ("Grounds", "Grounds maintenance contract - business park",
     "Ongoing monthly grounds maintenance including grass cutting, hedge trimming "
     "and seasonal planting for a local business park.", "photo-grounds"),
    ("Commercial", "Plumbing fit-out - commercial unit",
     "Full plumbing installation for a new commercial unit including pipework, "
     "fixtures and water management systems.", "photo-office"),
    ("Residential", "Bathroom suite renovation - Tipperary",
     "Full bathroom renovation including new suite, tiling, plumbing and "
     "electrical work.", "photo-kitchen"),
    ("Roofing", "Roof repair and insulation - Limerick",
     "Full roof repair and re-slating on a commercial property, including new "
     "insulation and guttering replacement.", "photo-tarmac"),
]

cases = "\n".join(f'''
      <article class="case" data-reveal>
        <div class="case__media">
          <picture>
            <source type="image/webp" srcset="media/{p}-800.webp 800w, media/{p}-1200.webp 1200w" sizes="(max-width:860px) 100vw, 60vw">
            <img src="media/{p}-800.jpg" alt="" width="1200" height="675" loading="lazy" decoding="async">
          </picture>
        </div>
        <div>
          <p class="case__cat">{cat}</p>
          <h2 class="case__title">{t}</h2>
          <p style="max-width:56ch;color:var(--warm-600);">{d}</p>
        </div>
      </article>''' for cat, t, d, p in CASES)

html = S.head("Our Work | Property Maintenance Projects, Limerick | Greenway",
              "A selection of completed property maintenance, refurbishment, "
              "surfacing, drainage and grounds projects across Limerick and beyond.",
              "projects",
              extra=crumbs(("Home", "/"), ("Work", "/projects.html")))
html += S.NAV
html += S.pagehead("Work.",
                   "Commercial, residential and industrial property across Limerick "
                   "and beyond. A selection, not a catalogue.",
                   "Work")
html += f'''
  <section class="section">
    <div class="shell">
      <div class="notice" data-reveal style="max-width:68ch;margin-bottom:clamp(2.5rem,6vw,4rem);">
        <strong>About the photography.</strong>
        Every project described here is one Greenway completed. The images are
        illustrative of the type of work - they are not photographs of these
        specific jobs. They will be replaced as site photography is supplied.
      </div>
{cases}
    </div>
  </section>
'''
html += S.cta("Something similar in mind?",
              "Tell us what the property needs. Free site visit, itemised quote.")
html += "\n</main>\n" + S.footer()
write("projects", html)


# ================================================================== about
html = S.head("About Greenway | Property Maintenance, Ardagh, Co. Limerick",
              "Greenway Property Services - complete property maintenance and "
              "facilities management from Ardagh, Co. Limerick, across Limerick "
              "and Kerry. One call, every trade.",
              "about",
              extra=crumbs(("Home", "/"), ("About", "/about.html")))
html += S.NAV
html += S.pagehead("One call, every trade.",
                   "Greenway exists because nobody wants to be the project manager "
                   "of their own building.",
                   "About")
html += f'''
  <section class="section">
    <div class="shell">
      <div class="split--wide" style="display:grid;">
        <div class="rich">
          <h2 data-reveal>What we actually do</h2>
          <p data-reveal>Greenway Property Maintenance &amp; Facilities Management was
            founded to take the stress out of property maintenance for landlords,
            businesses and homeowners. We are based at the Old Creamery Enterprise
            Centre in Ardagh, Co. Limerick, and we work across the county and into
            Kerry.</p>
          <p data-reveal>The approach is deliberately simple: one call, every trade,
            every job. We coordinate the tradespeople, manage the timeline and
            communicate clearly - so you are not the one chasing anybody. From a
            leaking tap to a full office refurbishment, it comes through one number.</p>

          <h2 data-reveal>Why that matters more than it sounds</h2>
          <p data-reveal>Most property problems are not single-trade problems. They
            look like one until somebody opens something up. The value in a single
            contractor is not convenience - it is that the sequencing, the handovers
            and the responsibility for the finished result all sit in one place.</p>
          <p data-reveal>It also means we can tell you when a job is smaller than you
            feared, because we are not selling you one trade's worth of work.</p>

          <h2 data-reveal>How we quote</h2>
          <p data-reveal>Site visits, assessments and written quotes are free and carry
            no obligation. Quotes are itemised, so you can see what each element costs
            and decide what to do now and what can wait. There is no minimum job size.</p>
        </div>
        <aside data-reveal>
          <div class="panel panel--accent">
            <p class="panel__label">The essentials</p>
            <ul class="checks">
              <li>Based at the Old Creamery Enterprise Centre, Ardagh, Co. Limerick</li>
              <li>Working across Limerick and Kerry</li>
              <li>Fully insured</li>
              <li>Free site visits, assessments and itemised quotes</li>
              <li>No minimum job size</li>
              <li>24/7 emergency call-outs</li>
            </ul>
          </div>
          <div class="panel" style="margin-top:1rem;">
            <p class="panel__label">Contact</p>
            <dl class="contact-rows">
              <div class="contact-row"><dt>Phone</dt>
                <dd><a href="tel:{S.PHONE_TEL}">{S.PHONE_TXT}</a></dd></div>
              <div class="contact-row"><dt>Email</dt>
                <dd><a href="mailto:greenwaybusinessparkardagh@gmail.com">greenwaybusinessparkardagh@gmail.com</a></dd></div>
              <div class="contact-row"><dt>Address</dt>
                <dd>{S.ADDRESS}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="shell">
      <p class="eyebrow" data-reveal>What we hold ourselves to</p>
      <h2 class="display" data-reveal style="margin-top:1.1rem;max-width:16ch;">Five things, and we mean them.</h2>
      <div class="steps" data-reveal style="margin-top:2.4rem;">
        <div class="step"><div><h3>Quality first</h3>
          <p>Every job, large or small, completed to the same standard. We stand behind the work.</p></div></div>
        <div class="step"><div><h3>Reliability</h3>
          <p>We show up when we said we would, finish when we said we would, and tell you when something changes.</p></div></div>
        <div class="step"><div><h3>Fair, transparent pricing</h3>
          <p>Itemised quotes. No hidden costs. If something needs to change mid-job, you hear it before it happens.</p></div></div>
        <div class="step"><div><h3>Accountability</h3>
          <p>We take ownership of the whole project. If something is not right, we come back and fix it.</p></div></div>
        <div class="step"><div><h3>Local</h3>
          <p>Limerick-based, working in the communities we live in. That is a reason to do the job properly.</p></div></div>
      </div>
    </div>
  </section>

  <section class="section section--warm">
    <div class="shell shell--narrow">
      <p class="eyebrow" data-reveal>The team</p>
      <h2 class="display" data-reveal style="margin-top:1.1rem;">Who you deal with.</h2>
      <div class="prose" data-reveal style="margin-top:1.6rem;">
        <p><strong>Damian</strong> - Founder and Operations Manager. Scopes the work,
          prices it and stays the point of contact through the job.</p>
        <p>Behind that is a network of qualified tradespeople covering every
          discipline, coordinated so they arrive in the right order.</p>
      </div>
    </div>
  </section>
'''
html += S.areas_block()
html += S.cta()
html += "\n</main>\n" + S.footer()
write("about", html)


# =============================================================== contact
opts = "\n".join(f'                  <option>{n.replace("&amp;", "&")}</option>'
                 for _, n, _ in S.SERVICES)
html = S.head("Contact Greenway | Free Quote, Limerick &amp; Kerry | 083 030 1799",
              "Request a free, no-obligation quote for property maintenance in "
              "Limerick or Kerry. Call 083 030 1799 or send the form - 24/7 "
              "emergency call-outs.",
              "contact",
              extra=crumbs(("Home", "/"), ("Contact", "/contact.html")))
html += S.NAV
html += S.pagehead("Tell us what needs doing.",
                   "You do not have to diagnose it. Describe the problem and we will "
                   "come and look - free, and with no obligation either way.",
                   "Contact")
html += f'''
  <section class="section">
    <div class="shell">
      <div class="split--wide" style="display:grid;">
        <div data-reveal>
          <form id="quoteForm" novalidate>
            <div class="field">
              <label for="name">Your name</label>
              <input id="name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="split">
              <div class="field">
                <label for="phone">Phone</label>
                <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
              </div>
              <div class="field">
                <label for="email">Email</label>
                <input id="email" name="email" type="email" autocomplete="email" required>
              </div>
            </div>
            <div class="split">
              <div class="field">
                <label for="service">What do you need?</label>
                <select id="service" name="service">
                  <option value="">Not sure / more than one</option>
{opts}
                </select>
              </div>
              <div class="field">
                <label for="town">Town or area</label>
                <input id="town" name="town" type="text" autocomplete="address-level2">
              </div>
            </div>
            <div class="field">
              <label for="message">What is the job?</label>
              <span class="hint">A sentence is enough. What it is, where it is, and how urgent.</span>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button class="btn btn--ink" type="submit">Send it</button>
            <div class="form-error" id="formError" tabindex="-1" role="alert">
              That did not send. Please call {S.PHONE_TXT} - we would rather hear from
              you directly than lose the message.
            </div>
            <p class="form-note">Goes straight to the Greenway inbox. We do not pass
              your details to anyone else. Urgent? Call - it is always faster.</p>
          </form>
        </div>

        <aside data-reveal>
          <div class="panel panel--accent">
            <p class="panel__label">Faster than a form</p>
            <p style="font-family:var(--font-display);font-size:1.7rem;line-height:1.2;margin-bottom:.9rem;">
              <a href="tel:{S.PHONE_TEL}">{S.PHONE_TXT}</a></p>
            <p style="font-size:var(--t-small);color:var(--warm-600);">
              For anything urgent - escaping water, storm damage, a property that is
              unsafe or unlettable - call. Emergency call-outs are available 24/7.</p>
          </div>
          <div class="panel" style="margin-top:1rem;">
            <p class="panel__label">Where we are</p>
            <dl class="contact-rows">
              <div class="contact-row"><dt>Email</dt>
                <dd><a href="mailto:greenwaybusinessparkardagh@gmail.com">greenwaybusinessparkardagh@gmail.com</a></dd></div>
              <div class="contact-row"><dt>Address</dt><dd>{S.ADDRESS}</dd></div>
              <div class="contact-row"><dt>Covering</dt><dd>Limerick and Kerry</dd></div>
            </dl>
          </div>
          <div class="panel" style="margin-top:1rem;">
            <p class="panel__label">What happens next</p>
            <ul class="checks">
              <li>We come and look, at no cost</li>
              <li>You get an itemised written quote</li>
              <li>You decide. There is no follow-up pressure</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>
'''
html += S.areas_block(dark=True)
html += "\n</main>\n" + S.footer().replace(
    '<script src="js/motion.js" defer></script>',
    '<script src="js/motion.js" defer></script>\n<script src="js/form.js" defer></script>')
write("contact", html)


# =========================================================== testimonials
QUOTES = [
    ("Professional service from start to finish. The team were reliable, efficient "
     "and the quality of work was excellent. They refurbished our entire office "
     "without any disruption to our business.",
     "Business park manager", "Commercial - office refurbishment"),
    ("Quick response, great communication and excellent workmanship. I called them "
     "on a Monday and they were on site by Wednesday. The end-of-tenancy clean was "
     "immaculate - my new tenants were delighted.",
     "Landlord", "Residential - end-of-tenancy clean"),
    ("Saved us so much time by organising every trade required. We had plumbing, "
     "electrical, painting and flooring all done through one call.",
     "Commercial property owner", "Commercial - full fit-out"),
    ("We have been using Greenway for our monthly grounds maintenance for over two "
     "years now. The grounds always look pristine and they never miss a visit.",
     "Estate manager", "Commercial - grounds maintenance contract"),
    ("Had a serious drainage problem at our warehouse that was causing flooding. "
     "Greenway diagnosed the issue quickly, gave us a fair quote, and had it sorted "
     "within a week.",
     "Warehouse manager", "Commercial - drainage and storm water"),
    ("Greenway completely renovated our bathroom and kitchen. The quality of the "
     "finish is outstanding. They were tidy, polite and completed the job ahead of "
     "schedule.",
     "Homeowner", "Residential - kitchen and bathroom renovation"),
    ("I manage a portfolio of rental properties and Greenway are my go-to for "
     "everything. Having one number to call for all repairs and maintenance saves me "
     "hours every month.",
     "Property portfolio manager", "Residential - ongoing maintenance"),
    ("Our new windows have made such a difference - warmer, quieter and much more "
     "secure. The fitters were skilled and efficient. The whole job was done in one "
     "day with zero mess left behind.",
     "Residential customer", "Residential - window fitting"),
]
qs = "\n".join(f'''
        <figure class="quote" data-reveal>
          <blockquote>{q}</blockquote>
          <figcaption>{who}<br>{what}</figcaption>
        </figure>''' for q, who, what in QUOTES)

html = S.head("Client Reviews | Greenway Property Services, Limerick",
              "What landlords, business owners and homeowners across Limerick say "
              "about working with Greenway Property Services.",
              "testimonials",
              extra=crumbs(("Home", "/"), ("Reviews", "/testimonials.html")))
html += S.NAV
html += S.pagehead("In their words.",
                   "Feedback from the landlords, business owners and homeowners who "
                   "have used Greenway.",
                   "Reviews")
html += f'''
  <section class="section">
    <div class="shell">
      <div class="split" style="row-gap:clamp(2.5rem,6vw,4rem);column-gap:clamp(2.5rem,6vw,5rem);">
{qs}
      </div>
      <div class="notice" data-reveal style="margin-top:clamp(3rem,7vw,5rem);max-width:68ch;">
        <strong>About these reviews</strong>
        These are shown as submitted to Greenway and are published without full
        attribution at the reviewers' preference. They are not verified third-party
        reviews. Independent reviews will appear on the Greenway Google Business
        Profile as clients leave them.
      </div>
    </div>
  </section>
'''
html += S.cta("Add your own.",
              "Free site visit, free assessment, itemised quote. No obligation either way.")
html += "\n</main>\n" + S.footer()
write("testimonials", html)


# =============================================================== thank-you
html = S.head("Thank you | Greenway Property Services",
              "Your message has been sent to Greenway Property Services.",
              "thank-you")
html += S.NAV
html += f'''
<main id="main">
  <section class="section section--deep" style="min-height:70vh;display:grid;place-items:center;">
    <div class="shell shell--narrow" style="text-align:center;">
      <p class="eyebrow">Message sent</p>
      <h1 class="display" style="margin:1.1rem auto 0;max-width:14ch;">Got it. We will be in touch.</h1>
      <p class="lead" style="margin:1.4rem auto 0;">We read every enquiry and come back
        to you with a time for a free site visit. If it is urgent, calling is faster.</p>
      <div style="margin-top:2.4rem;display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap;">
        <a class="btn btn--gold" href="tel:{S.PHONE_TEL}">Call {S.PHONE_TXT}</a>
        <a class="btn btn--ghost" href="/">Back to the site</a>
      </div>
    </div>
  </section>
</main>
'''
html += S.pixel_lead()
html += S.footer()
write("thank-you", html)


# ============================================================ legal pages
def legal(slug, title, desc, heading, lede, body):
    h = S.head(title, desc, slug, extra=crumbs(("Home", "/"), (heading, "/%s.html" % slug)))
    h += S.NAV
    h += S.pagehead(heading, lede, heading)
    h += f'''
  <section class="section">
    <div class="shell">
      <div class="notice" data-reveal style="max-width:68ch;margin-bottom:2.5rem;">
        <strong>Awaiting legal review.</strong>
        This page sets out Greenway's actual current practice in plain language. It
        has not been drafted or reviewed by a solicitor and should be replaced with
        reviewed wording before it is relied on.
      </div>
      <div class="rich">
{body}
      </div>
    </div>
  </section>
'''
    h += "\n</main>\n" + S.footer()
    write(slug, h)


legal("privacy", "Privacy Policy | Greenway Property Services",
      "How Greenway Property Services collects, uses and stores the information you "
      "send through this website.",
      "Privacy", "What we collect, why, and what we do not do with it.",
      f'''        <h2>What this covers</h2>
        <p>This policy covers greenwaypropertyservices.ie, operated by Greenway
          Property Maintenance &amp; Facilities Management, {S.ADDRESS}.</p>

        <h2>What we collect</h2>
        <p>Only what you type into the quote form: your name, phone number, email
          address, the town or area, the service you selected and your description of
          the job. There is no account, no login and no newsletter.</p>

        <h2>Why we collect it</h2>
        <p>To respond to your enquiry, arrange a site visit and produce a quote. That
          is the only purpose. We do not sell, rent or pass your details to third
          parties for marketing.</p>

        <h2>How it reaches us</h2>
        <p>Form submissions are delivered to our email inbox by FormSubmit, a
          third-party form delivery service, and are stored in that inbox. The site
          is hosted by Vercel, whose servers keep standard access logs.</p>

        <h2>Advertising and analytics</h2>
        <p>Where advertising measurement tools are active on this site, they are named
          here. At the time of writing no advertising pixel is installed and no
          analytics cookies are set by this site.</p>

        <h2>How long we keep it</h2>
        <p>Enquiries stay in our email records so we have a history of work on your
          property. Ask us to delete yours and we will.</p>

        <h2>Your rights</h2>
        <p>Under the GDPR and the Irish Data Protection Act 2018 you can ask for a
          copy of the personal data we hold about you, ask us to correct it, or ask us
          to erase it. Email
          <a href="mailto:greenwaybusinessparkardagh@gmail.com">greenwaybusinessparkardagh@gmail.com</a>
          or call <a href="tel:{S.PHONE_TEL}">{S.PHONE_TXT}</a>. You also have the
          right to complain to the Irish Data Protection Commission at dataprotection.ie.</p>''')

legal("terms", "Terms &amp; Conditions | Greenway Property Services",
      "Terms of use for the Greenway Property Services website, and how our quotes "
      "and work are agreed.",
      "Terms", "How this website and our quotes work.",
      f'''        <h2>This website</h2>
        <p>greenwaypropertyservices.ie is operated by Greenway Property Maintenance
          &amp; Facilities Management, {S.ADDRESS}. The content is provided for
          information about our services.</p>

        <h2>Nothing here is a quote</h2>
        <p>Descriptions of services on this site are general. No page on this website
          constitutes a quotation, an offer or a commitment to a price or a timescale.
          Prices depend on the property, and we do not publish figures precisely
          because a figure without a site visit is a guess.</p>

        <h2>Quotes</h2>
        <p>Site visits, assessments and written quotes are free and carry no
          obligation. A written quote is the only binding statement of price we give.
          Where work reveals something that could not be seen at the survey, we will
          tell you before doing anything that changes the price.</p>

        <h2>Enquiries</h2>
        <p>Sending the form does not create a contract. Work begins only when a
          written quote has been accepted.</p>

        <h2>Images</h2>
        <p>Some photography on this site is illustrative and is marked as such where
          it does not depict Greenway's own completed work.</p>

        <h2>Liability</h2>
        <p>We take reasonable care to keep this site accurate, but it is provided as
          is. Nothing in these terms limits or excludes liability where the law does
          not permit it, and nothing here affects your statutory rights as a consumer
          under Irish law.</p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of Ireland.</p>

        <h2>Contact</h2>
        <p><a href="tel:{S.PHONE_TEL}">{S.PHONE_TXT}</a> &nbsp;&middot;&nbsp;
          <a href="mailto:greenwaybusinessparkardagh@gmail.com">greenwaybusinessparkardagh@gmail.com</a></p>''')
