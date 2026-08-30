/**
 * Static defaults and option lists for the SAAJ Partners and Consult platform.
 *
 * Anything the admin is expected to manage at runtime lives in the database
 * (see prisma/seed.ts for the default content). These constants provide
 * sensible fallbacks and the fixed vocabulary used across forms and badges.
 */

// ---------------------------------------------------------------------------
// Company defaults (overridden by SiteSetting -> "general" at runtime)
// ---------------------------------------------------------------------------

export const COMPANY_DEFAULTS = {
  name: "SAAJ Partners and Consult",
  tagline: "Delivering Innovative Solutions with Integrity, Quality and Professionalism.",
  description:
    "SAAJ Partners and Consult is a dynamic construction, consulting, and project management firm committed to delivering innovative, cost-effective, and quality solutions across the built environment.",
  phone: "09132658793",
  email: "saajpartnersconsult@gmail.com",
  address: "13, First Gate, Ikorodu, Lagos, Nigeria",
  founded: "2026",
  primaryContact: "Stephen Ajibare",
};

export const PLACEHOLDER_IMAGES = {
  hero: "/images/placeholders/hero.svg",
  about: "/images/placeholders/about.svg",
  service: "/images/placeholders/service.svg",
  project: "/images/placeholders/project.svg",
  blog: "/images/placeholders/blog.svg",
  generic: "/images/placeholders/generic.svg",
  logo: "/images/logo-mark.svg",
  logoFull: "/images/logo.svg",
};

// ---------------------------------------------------------------------------
// Default values used when a SiteSetting has not been created yet
// ---------------------------------------------------------------------------

export const DEFAULT_HOME_SETTINGS = {
  hero: {
    title: "Building Today. Creating Tomorrow.",
    subtitle:
      "SAAJ Partners and Consult is a dynamic construction, consulting, and project management firm delivering innovative, cost-effective, and quality-driven solutions across the built environment.",
    image: PLACEHOLDER_IMAGES.hero,
    primaryCtaLabel: "Request a Quote",
    secondaryCtaLabel: "Our Services",
  },
  intro: {
    title: "Integrated Solutions Across the Built Environment",
    content:
      "We provide integrated services in Design, Procurement, Construction, General Contracting, Quantity Surveying, Design & Build, Project Management, and Consultancy. Our approach combines technical expertise, professional management, and a strong commitment to quality, integrity, and client satisfaction. We transform ideas into practical solutions and projects into lasting value.",
    image: PLACEHOLDER_IMAGES.about,
    ctaLabel: "About Us",
  },
  whyChooseUs: {
    title: "Why Choose Us",
    heading: "A Partner You Can Build On",
    items: [
      {
        title: "Integrated Project Solutions",
        description:
          "Every discipline needed for a successful project — design through delivery — under one coordinated team.",
        icon: "layers",
      },
      {
        title: "Cost & Value Focus",
        description:
          "Quantity surveying-led cost management that protects your budget while maximising long-term value.",
        icon: "piggy-bank",
      },
      {
        title: "Design-to-Build Approach",
        description:
          "Design and construction aligned from day one for efficiency, speed and certainty of outcome.",
        icon: "ruler",
      },
      {
        title: "Professional Project Management",
        description:
          "Planning, monitoring and control that keep projects on time, on budget and to quality.",
        icon: "clipboard-check",
      },
      {
        title: "Client-Centred Service",
        description:
          "Clear communication, honest advice and a delivery culture built around your objectives.",
        icon: "users",
      },
      {
        title: "Quality & Integrity",
        description:
          "We do things properly the first time — with materials, workmanship and conduct you can trust.",
        icon: "shield-check",
      },
      {
        title: "Practical Industry Expertise",
        description:
          "Hands-on built-environment experience applied pragmatically to real-world project problems.",
        icon: "hard-hat",
      },
    ],
  },
  stats: {
    title: "Our Track Record",
    heading: "Delivering Results With Discipline",
    items: [
      { label: "Projects Completed", value: 0, suffix: "+" },
      { label: "Clients Served", value: 0, suffix: "+" },
      { label: "Services Delivered", value: 8 },
      { label: "Years of Experience", value: 0, suffix: "+" },
    ],
  },
  process: {
    title: "How We Deliver",
    heading: "A Proven Project Delivery Process",
    steps: [
      {
        title: "Consultation",
        description:
          "We listen first — understanding your vision, requirements, site constraints and budget before anything else.",
      },
      {
        title: "Planning & Design",
        description:
          "Feasibility, brief development and design options shaped to your objectives and regulatory environment.",
      },
      {
        title: "Cost Estimation",
        description:
          "Accurate measurement and estimation so you know the true cost before you commit.",
      },
      {
        title: "Procurement",
        description:
          "Strategic sourcing of materials, equipment, labour and subcontractors — right quality, right price, right time.",
      },
      {
        title: "Construction",
        description:
          "Professional execution with rigorous attention to quality, safety, efficiency and durability.",
      },
      {
        title: "Project Delivery",
        description:
          "Handover, commissioning and aftercare — delivering a completed asset that performs as promised.",
      },
    ],
  },
  cta: {
    title: "Have a Project in Mind?",
    content:
      "Tell us about your project. We'll help you plan it properly, price it honestly and deliver it to a standard you can be proud of.",
    primaryLabel: "Request a Quote",
    secondaryLabel: "Book a Consultation",
    tertiaryLabel: "Contact Us",
  },
};

export const DEFAULT_ABOUT_SETTINGS = {
  overview: {
    title: "About SAAJ Partners and Consult",
    content:
      "SAAJ Partners and Consult is a dynamic construction, consulting, and project management firm committed to delivering innovative, cost-effective, and quality solutions across the built environment.\n\nWe provide integrated services in Design, Procurement, Construction, General Contracting, Quantity Surveying, Design & Build, Project Management, and Consultancy. Our approach combines technical expertise, professional management, and a strong commitment to quality, integrity, and client satisfaction.\n\nAt SAAJ Partners and Consult, we transform ideas into practical solutions and projects into lasting value.",
    image: PLACEHOLDER_IMAGES.about,
  },
  mission:
    "To deliver innovative, cost-effective, and quality-driven construction and consultancy solutions through professional expertise, integrity, technology, and a commitment to client satisfaction.",
  vision:
    "To become a leading and trusted construction, project management, and consultancy firm in Nigeria, recognized for excellence, reliability, innovation, and sustainable project delivery.",
  values: [
    { title: "Integrity", description: "We are honest, transparent and accountable in everything we do." },
    { title: "Quality", description: "We hold our work to the highest professional and technical standards." },
    { title: "Professionalism", description: "We act with competence, discipline and respect for all stakeholders." },
    { title: "Client Focus", description: "Your objectives shape our approach — we succeed when you do." },
    { title: "Innovation", description: "We adopt modern methods and technology to deliver better outcomes." },
    { title: "Reliability", description: "We do what we say, on time and to specification." },
    { title: "Accountability", description: "We take ownership of outcomes, budgets and deadlines." },
  ],
  differentiators: [
    "Integrated, end-to-end project capability",
    "Quantity surveying and cost leadership at the core of every project",
    "Design and construction aligned under one coordinated team",
    "Practical, hands-on built-environment expertise",
    "Client-centred communication and honest advice",
    "Quality, integrity and reliability as non-negotiable standards",
  ],
  approach:
    "Our approach is simple: understand the problem, plan rigorously, price honestly, and execute professionally. By integrating design, cost and delivery under one team, we remove friction, control risk and keep every stakeholder aligned from first consultation to final handover.",
};

export const DEFAULT_SEO_SETTINGS = {
  titleTemplate: "%s | SAAJ Partners and Consult",
  defaultTitle: "SAAJ Partners and Consult — Construction, Consulting & Project Management, Lagos, Nigeria",
  defaultDescription:
    "SAAJ Partners and Consult is a Lagos-based construction and consultancy firm delivering design, procurement, construction, general contracting, quantity surveying, design & build, project management and consultancy services.",
  keywords: [
    "construction company Nigeria",
    "construction consultancy",
    "construction company Lagos",
    "quantity surveying",
    "project management",
    "design and build",
    "general contracting",
    "construction management",
    "cost management",
    "building solutions",
    "infrastructure",
    "procurement",
    "consultancy",
    "project delivery",
  ],
  ogImage: PLACEHOLDER_IMAGES.hero,
};

export const DEFAULT_SOCIAL_SETTINGS = {
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  youtube: "",
};

// ---------------------------------------------------------------------------
// Vocabulary / option lists
// ---------------------------------------------------------------------------

export const SERVICE_CATEGORIES = [
  { slug: "design", title: "Design" },
  { slug: "procurement", title: "Procurement" },
  { slug: "construction", title: "Construction" },
  { slug: "general-contracting", title: "General Contracting" },
  { slug: "quantity-surveying", title: "Quantity Surveying" },
  { slug: "design-build", title: "Design & Build" },
  { slug: "consultancy", title: "Consultancy" },
  { slug: "project-management", title: "Project Management" },
] as const;

export const PROJECT_CATEGORIES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Renovation",
  "Other",
] as const;

export const PROJECT_STATUSES = [
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "planning", label: "Planning" },
] as const;

export const APPOINTMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "completed", label: "Completed" },
] as const;

export const QUOTE_STATUSES = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
] as const;

export const APPOINTMENT_TIMES = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
] as const;

export const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Renovation",
  "Other",
] as const;

export const ESTIMATED_BUDGETS = [
  "Below ₦10 million",
  "₦10M – ₦50M",
  "₦50M – ₦100M",
  "₦100M – ₦250M",
  "₦250M – ₦500M",
  "Above ₦500M",
  "Not sure yet",
] as const;

export const DEFAULT_SERVICE_OPTIONS = SERVICE_CATEGORIES.map((s) => s.title);

// ---------------------------------------------------------------------------
// Status badge styling helpers
// ---------------------------------------------------------------------------

export const STATUS_BADGE_RECORDS: Record<string, { label: string; className: string }> = {
  // content publish states
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  unpublished: { label: "Draft", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
  // appointments
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  rejected: { label: "Rejected", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
  rescheduled: { label: "Rescheduled", className: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  completed: { label: "Completed", className: "bg-indigo-50 text-indigo-700 ring-indigo-600/20" },
  // quote requests
  new: { label: "New", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  reviewing: { label: "Reviewing", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  contacted: { label: "Contacted", className: "bg-violet-50 text-violet-700 ring-violet-600/20" },
  quoted: { label: "Quoted", className: "bg-cyan-50 text-cyan-700 ring-cyan-600/20" },
  // messages
  read: { label: "Read", className: "bg-slate-100 text-slate-600 ring-slate-500/20" },
  unread: { label: "Unread", className: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  replied: { label: "Replied", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  // projects
  ongoing: { label: "Ongoing", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  planning: { label: "Planning", className: "bg-sky-50 text-sky-700 ring-sky-600/20" },
};

export function statusBadge(status: string, fallbackLabel?: string) {
  return (
    STATUS_BADGE_RECORDS[status] ?? {
      label: fallbackLabel ?? status,
      className: "bg-slate-100 text-slate-600 ring-slate-500/20",
    }
  );
}