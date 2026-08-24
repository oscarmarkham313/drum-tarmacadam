/**
 * Case studies — edit freely, components render whatever is here.
 * niche: "estate-agencies" | "trades" | "service-businesses" | "other"
 * "other" appears under the All tab only.
 */

export type Niche = "estate-agencies" | "trades" | "service-businesses" | "other";

export interface CaseStudy {
  client: string;
  sector: string;
  niche: Niche;
  stats: { value: string; label: string }[];
  note: string;
  featured?: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    client: "Dublin Property Agency",
    sector: "Property",
    niche: "estate-agencies",
    stats: [
      { value: "€2.1M", label: "Enquiry value generated" },
      { value: "240+", label: "Qualified enquiries" },
    ],
    note: "Google Ads and landing pages built around valuation requests and vendor leads.",
    featured: true,
  },
  {
    client: "Dublin Plumbing Company",
    sector: "Trade services",
    niche: "trades",
    stats: [
      { value: "+290%", label: "Qualified leads per month" },
      { value: "#1", label: "Google ranking, emergency callouts" },
    ],
    note: "Local SEO and paid search rebuilt around emergency and installation searches.",
    featured: true,
  },
  {
    client: "Walsh & Associates Accountants",
    sector: "Professional services",
    niche: "service-businesses",
    stats: [
      { value: "#1", label: "On Google in 4 months" },
      { value: "+180%", label: "Organic traffic" },
    ],
    note: "From zero presence to page one for the firm's highest-value services.",
  },
  {
    client: "Leinster Fitness Studio",
    sector: "Health & fitness",
    niche: "service-businesses",
    stats: [
      { value: "+580", label: "New members in 90 days" },
      { value: "€12", label: "Cost per lead" },
    ],
    note: "Meta campaigns with offer-led creative, landing pages and tracking end to end.",
  },
  {
    client: "Dublin Restaurant Group",
    sector: "Hospitality",
    niche: "service-businesses",
    stats: [
      { value: "+420%", label: "Online bookings" },
      { value: "3.2x", label: "Revenue growth" },
    ],
    note: "New site with integrated booking plus always-on local social campaigns.",
  },
  {
    client: "Dublin Beauty Salon",
    sector: "Beauty & wellness",
    niche: "service-businesses",
    stats: [
      { value: "+8,200", label: "Instagram followers" },
      { value: "Fully", label: "Booked out" },
    ],
    note: "Managed social plus paid amplification until the diary stayed full.",
  },
  {
    client: "Dublin Training Academy",
    sector: "Education",
    niche: "service-businesses",
    stats: [
      { value: "+670%", label: "Course enrolments" },
      { value: "€48k", label: "Revenue in first term" },
    ],
    note: "Google Ads on course-intent searches with enrolment-focused landing pages.",
  },
  {
    client: "Irish Fashion Brand",
    sector: "E-commerce",
    niche: "other",
    stats: [
      { value: "18x", label: "Return on ad spend" },
      { value: "€180k", label: "Revenue in 6 months" },
    ],
    note: "Full-funnel Meta ads: prospecting, retargeting and creative testing.",
  },
  {
    client: "Irish Gift Shop",
    sector: "Retail",
    niche: "other",
    stats: [
      { value: "+340%", label: "Online sales" },
      { value: "8.2x", label: "Return on ad spend" },
    ],
    note: "Google Shopping and seasonal Meta campaigns for a bricks-and-clicks retailer.",
  },
];
