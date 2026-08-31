/**
 * ALL site copy lives in this file. Edit here, never in components.
 * Case study data lives separately in config/case-studies.ts.
 */

export const site = {
  name: "Dublin Growth Digital",
  domain: "https://dublingrowthdigital.com",
  email: "dublingrowthdigital@gmail.com",
  phone: "+353871257533",
  phoneDisplay: "+353 87 125 7533",
  whatsapp:
    "https://wa.me/353871257533?text=Hi%2C%20I%27d%20like%20to%20talk%20about%20growing%20my%20business.",
  instagram: "https://www.instagram.com/dublinsocialagency/",
  facebook: "https://www.facebook.com/dublinsocialagency",
  formspree: "https://formspree.io/f/meendppv",
  whopCheckout: "https://whop.com/checkout/plan_EeyocfGbLALyC/",
  metaDescription:
    "Dublin Growth Digital gets Irish businesses more customers — web design, Google Ads, Meta ads and SEO, built and run from Dublin.",
};

export const nav = {
  links: [
    { label: "Services", href: "/services" },
    { label: "Results", href: "/results" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Book a call", href: "/contact" },
};

export const home = {
  hero: {
    // The four words. The full stop renders separately, in the accent colour.
    words: ["We", "get", "you", "customers"],
    // After the load-in, the last word rolls through these.
    rotating: ["customers", "enquiries", "bookings", "clients"],
    sub: "Web design, Google Ads, Meta ads and SEO for Irish businesses that want the phone to ring. Built and run from Dublin.",
    cta: { label: "Get your free growth audit", href: "#audit" },
    secondary: { label: "See the results", href: "/results" },
    video: {
      webm: "/hero/hero.webm",
      mp4: "/hero/hero.mp4",
      poster: "/hero/poster.jpg",
    },
  },
  proof: [
    { value: 52, suffix: "", label: "Irish businesses grown" },
    { value: 340, suffix: "%", label: "Average increase in online leads" },
    { value: 15, suffix: "x", label: "Average return on ad spend" },
    { value: 4.9, suffix: "", label: "Average client rating", decimals: 1 },
  ],
  services: {
    eyebrow: "What we do",
    heading: "Five ways in.",
    items: [
      {
        number: "01",
        name: "Web Design",
        outcome: "Sites that turn visits into enquiries — designed, written and shipped in weeks.",
        href: "/services#web-design",
      },
      {
        number: "02",
        name: "Google Ads",
        outcome: "Show up the moment someone in your area searches for what you do.",
        href: "/services#google-ads",
      },
      {
        number: "03",
        name: "Meta Ads",
        outcome: "Facebook and Instagram campaigns that put your work in front of local buyers.",
        href: "/services#meta-ads",
      },
      {
        number: "04",
        name: "SEO",
        outcome: "Page one for the searches that pay — and stay there.",
        href: "/services#seo",
      },
      {
        number: "05",
        name: "Social Media",
        outcome: "A feed that looks like the business you actually run — managed for you.",
        href: "/services#social",
      },
    ],
  },
  funnel: {
    eyebrow: "How it works",
    heading: "Traffic in. Customers out.",
    sub: "Every engagement is built on the same mechanism. We put your business in front of people already looking, filter for the ones ready to buy, and make contacting you effortless.",
    caption: "Illustrative flow — 90 days, local services client.",
    stages: [
      { label: "People who see you", tag: "Traffic", value: 38400 },
      { label: "Visit your website", tag: "Clicks", value: 2140 },
      { label: "Call or message you", tag: "Enquiries", value: 214 },
      { label: "Become customers", tag: "Booked jobs", value: 68 },
    ],
  },
  resultsPreview: {
    eyebrow: "Results",
    heading: "Numbers, not adjectives.",
    cta: { label: "All case studies", href: "/results" },
  },
  testimonials: {
    eyebrow: "Testimonials",
    heading: "In their own words.",
    items: [
      {
        quote:
          "Finally a marketing agency that speaks plain English and delivers. Our Google Ads are generating more leads than we can handle.",
        name: "Ciarán O'Brien",
        role: "Director, plumbing & heating company",
      },
      {
        quote:
          "Our bookings tripled in the first two months. The team genuinely cares about your results, not just showing up and collecting a fee.",
        name: "Siobhán Murphy",
        role: "Owner, Dublin restaurant",
      },
      {
        quote:
          "The new website they built for us is absolutely stunning. We went from embarrassed to share our URL to handing it out to everyone.",
        name: "Aoife Gallagher",
        role: "Founder, interior design studio",
      },
      {
        quote:
          "18x ROAS on our e-commerce ads. I genuinely didn't believe it was possible before we started working together.",
        name: "Róisín Byrne",
        role: "CEO, activewear brand",
      },
      {
        quote:
          "From zero online presence to page one on Google in four months. The SEO results have transformed our business completely.",
        name: "Patrick Walsh",
        role: "Partner, accountancy firm",
      },
      {
        quote:
          "Our Instagram grew by 8,000 followers in six months and we're getting direct enquiries from it every single week now.",
        name: "Niamh Dolan",
        role: "Owner, Dublin beauty salon",
      },
    ],
  },
  closing: {
    heading: "Find out what you're missing.",
    sub: "Request a free growth audit — within 24 hours we'll send you exactly where your next customers are going instead of you, and the three fastest ways to fix it. Takes 20 seconds. No call, no obligation.",
    cta: { label: "Get your free growth audit", href: "#audit" },
  },
};

export const services = {
  hero: {
    title: "What we do, properly.",
    sub: "One channel done well beats five done half. These are the five we do well.",
  },
  items: [
    {
      id: "web-design",
      number: "01",
      name: "Web Design",
      outcome:
        "Your website is your best salesperson or your biggest leak. We design and build fast, focused sites with one job: turning visits into enquiries.",
      deliverables: [
        "Custom design — no templates, no page builders",
        "Copywriting included",
        "Lead capture built into every page",
        "On-page SEO and analytics from day one",
        "Fully responsive, fast on mobile",
        "Live in 14 days",
      ],
    },
    {
      id: "google-ads",
      number: "02",
      name: "Google Ads",
      outcome:
        "The highest-intent traffic there is — people typing exactly what you sell. We build tight local campaigns that pay for themselves or get switched off.",
      deliverables: [
        "Keyword and competitor research",
        "Campaign build and conversion tracking",
        "Landing pages that match the ad",
        "Weekly optimisation",
        "Plain-English monthly reporting",
      ],
    },
    {
      id: "meta-ads",
      number: "03",
      name: "Meta Ads",
      outcome:
        "Facebook and Instagram put your work in front of local people before they search. Creative, targeting and management, handled end to end.",
      deliverables: [
        "Audience research and strategy",
        "Ad copy and creative production",
        "Pixel and conversion tracking",
        "A/B testing throughout",
        "Weekly performance reports",
      ],
    },
    {
      id: "seo",
      number: "04",
      name: "SEO",
      outcome:
        "Rankings compound. We get you onto page one for the searches that bring customers — then keep you there while competitors pay for every click.",
      deliverables: [
        "Technical audit and fixes",
        "Local SEO and Google Business Profile",
        "Content targeting buying-intent searches",
        "Authority building",
        "Monthly ranking and traffic reports",
      ],
    },
    {
      id: "social",
      number: "05",
      name: "Social Media",
      outcome:
        "A dead feed costs you jobs — people check before they call. We keep your social presence active, professional and generating enquiries.",
      deliverables: [
        "Content planning and creation",
        "Posting and community management",
        "Monthly growth reporting",
      ],
    },
  ],
};

export const results = {
  hero: {
    title: "Every result, on the record.",
    sub: "From sole traders to national brands — the numbers our work produced.",
  },
  tabs: [
    { id: "all", label: "All" },
    { id: "estate-agencies", label: "Estate agencies" },
    { id: "trades", label: "Trades" },
    { id: "service-businesses", label: "Service businesses" },
  ],
  /* Shown above the case studies when a niche tab is selected. */
  nicheIntros: {
    "estate-agencies": {
      heading: "How we work with estate agents",
      points: [
        "Vendor opportunities, not buyer lists — campaigns built around valuations and instructions.",
        "Creative matched to your patch and your positioning, from rural one-office firms to premium city agencies.",
        "Reporting your negotiators can actually use: enquiries, response times and appointments — never impressions.",
      ],
    },
    trades: {
      heading: "How we work with trades businesses",
      points: [
        "We learn the jobs you actually want, then build the campaign around those jobs and your coverage area — not every possible enquiry.",
        "Your work presented properly: ads that reflect the standard of what you do, never cheap or generic.",
        "Plain English throughout — we talk about enquiries and booked work, not jargon and click reports.",
      ],
    },
    "service-businesses": {
      heading: "How we work with service businesses",
      points: [
        "Broad services turned into clear propositions — prospects understand who you help and why to call before they enquire.",
        "Trust-first for regulated businesses: professional campaigns with no exaggerated promises.",
        "Fewer, better conversations — qualification built into the enquiry journey so your team quotes genuine work.",
      ],
    },
  },
};

export const about = {
  hero: {
    title: "Small agency. Straight answers.",
    sub: "Dublin Growth Digital exists because most Irish SMEs are paying too much for marketing that reports impressions instead of customers.",
  },
  stance: [
    "We're a Dublin agency that works exclusively with Irish businesses. We build websites and run campaigns whose only job is to make your phone ring — and we report in booked jobs and enquiries, never in reach.",
    "You deal directly with the person doing the work. No account managers, no handovers, no deck-first culture. If something isn't working, you'll hear it from us before you've noticed it yourself.",
  ],
  principles: {
    eyebrow: "How we work",
    items: [
      { n: "01", text: "Enquiries over impressions. If it doesn't ring the phone, it doesn't count." },
      { n: "02", text: "One channel done properly beats five done half." },
      { n: "03", text: "You own everything we build — site, accounts, data. Leave any time." },
      { n: "04", text: "Plain numbers, weekly. You'll never wonder what you're paying for." },
      { n: "05", text: "Dublin-based, Ireland-wide. We know the market because we're in it." },
    ],
  },
  closing: {
    heading: "See if we fit.",
    cta: { label: "Book a call", href: "/contact" },
  },
};

export const contact = {
  hero: {
    title: "Talk to us.",
    sub: "Tell us what you do and what you're after. We reply within one working day — usually faster.",
  },
  form: {
    name: "Your name",
    business: "Business name",
    email: "Email",
    phone: "Phone (optional)",
    message: "What are you looking to achieve?",
    submit: "Send message",
    sending: "Sending…",
    success: "Got it. We'll come back to you within one working day.",
    error: "Something went wrong — email us directly instead.",
  },
  direct: {
    heading: "Or go direct",
    lines: [
      { label: "WhatsApp", value: "Message us now", hrefKey: "whatsapp" as const },
      { label: "Email", value: "dublingrowthdigital@gmail.com", hrefKey: "email" as const },
      { label: "Phone", value: "+353 87 125 7533", hrefKey: "phone" as const },
    ],
  },
};

export const leadModal = {
  // Posts to the existing Formspree form. If you create a dedicated form
  // for the modal in the Formspree dashboard, swap the id here.
  endpoint: "https://formspree.io/f/meendppv",
  heading: "Your free growth audit.",
  body: "Tell us who you are and we'll find where your next customers are going instead of you — your Google position, who's outranking you, the ads running in your patch — and send it with the three fastest fixes. With you within 24 hours. No call, no cost, no catch.",
  fields: {
    business: "Business name",
    trade: "Business type",
    county: "County",
    email: "Email",
  },
  trades: [
    "Roofing",
    "Driveways & paving",
    "Landscaping & gardens",
    "Other trades",
    "Estate or letting agency",
    "Beauty, hair & wellness",
    "Gym, fitness or clinic",
    "Restaurant or café",
    "Professional services",
    "Other",
  ],
  counties: [
    "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway",
    "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick",
    "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly",
    "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath",
    "Wexford", "Wicklow",
  ],
  submit: "Send my free audit",
  sending: "Sending…",
  smallPrint:
    "No spam, no sales calls. One email with your audit — that's it unless you reply.",
  confirmHeading: "Got it.",
  confirmBody: "Your free audit will be with you within 24 hours.",
  errors: {
    business: "Enter your business name",
    trade: "Pick your business type",
    county: "Pick your county",
    email: "Enter a valid email",
    submit: "Something went wrong — email us instead at",
  },
};

export const footer = {
  line: "Dublin Growth Digital — web design, ads and SEO for Irish businesses.",
  legal: [{ label: "Terms", href: "/terms" }],
};
