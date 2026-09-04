/**
 * SAAJ Partners and Consult — database seed.
 *
 * Creates the default admin account, site settings and clearly-labelled
 * demo/sample content. Nothing here is presented as a real client achievement:
 * projects, testimonials and imagery are placeholders the admin replaces from
 * the dashboard.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const P = {
  hero: "/images/placeholders/hero.svg",
  about: "/images/placeholders/about.svg",
  service: "/images/placeholders/service.svg",
  project: "/images/placeholders/project.svg",
  blog: "/images/placeholders/blog.svg",
  generic: "/images/placeholders/generic.svg",
  logo: "/images/logo-mark.svg",
  logoFull: "/images/logo.svg",
};

async function main() {
  // -------------------------------------------------------------------------
  // 1. Admin user (credentials come from environment variables)
  // -------------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@saajpartners.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "Admin@123";
  const adminName = process.env.ADMIN_SEED_NAME ?? "SAAJ Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });
  console.log(`✔ Admin user ready (${adminEmail}).`);

  // -------------------------------------------------------------------------
  // 2. Site settings
  // -------------------------------------------------------------------------
  const settings: Record<string, unknown> = {
    general: {
      companyName: "SAAJ Partners and Consult",
      tagline: "Delivering Innovative Solutions with Integrity, Quality and Professionalism.",
      description:
        "SAAJ Partners and Consult is a dynamic construction, consulting, and project management firm committed to delivering innovative, cost-effective, and quality solutions across the built environment.",
      phone: "09132658793",
      email: "saajpartnersconsult@gmail.com",
      address: "13, First Gate, Ikorodu, Lagos, Nigeria",
      founded: "2026",
      primaryContact: "Stephen Ajibare",
      logo: P.logo,
      favicon: "",
    },
    socials: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
    seo: {
      titleTemplate: "%s | SAAJ Partners and Consult",
      defaultTitle:
        "SAAJ Partners and Consult — Construction, Consulting & Project Management, Lagos, Nigeria",
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
      ogImage: P.hero,
    },
    home: {
      hero: {
        title: "Building Today. Creating Tomorrow.",
        subtitle:
          "SAAJ Partners and Consult is a dynamic construction, consulting, and project management firm delivering innovative, cost-effective, and quality-driven solutions across the built environment.",
        image: P.hero,
        videos: [],
        primaryCtaLabel: "Request a Quote",
        secondaryCtaLabel: "Our Services",
      },
      intro: {
        title: "Integrated Solutions Across the Built Environment",
        content:
          "We provide integrated services in Design, Procurement, Construction, General Contracting, Quantity Surveying, Design & Build, Project Management, and Consultancy. Our approach combines technical expertise, professional management, and a strong commitment to quality, integrity, and client satisfaction. We transform ideas into practical solutions and projects into lasting value.",
        image: P.about,
        ctaLabel: "Learn More About Us",
      },
      whyChooseUs: {
        title: "Why Choose Us",
        heading: "A Partner You Can Build On",
        items: [
          { title: "Integrated Project Solutions", icon: "layers", description: "Every discipline needed for a successful project — design through delivery — under one coordinated team." },
          { title: "Cost & Value Focus", icon: "piggy-bank", description: "Quantity surveying-led cost management that protects your budget while maximising long-term value." },
          { title: "Design-to-Build Approach", icon: "ruler", description: "Design and construction aligned from day one for efficiency, speed and certainty of outcome." },
          { title: "Professional Project Management", icon: "clipboard-check", description: "Planning, monitoring and control that keep projects on time, on budget and to quality." },
          { title: "Client-Centred Service", icon: "users", description: "Clear communication, honest advice and a delivery culture built around your objectives." },
          { title: "Quality & Integrity", icon: "shield-check", description: "We do things properly the first time — with materials, workmanship and conduct you can trust." },
          { title: "Practical Industry Expertise", icon: "hard-hat", description: "Hands-on built-environment experience applied pragmatically to real-world project problems." },
        ],
      },
      stats: {
        title: "Our Track Record",
        heading: "Delivering Results With Discipline",
        items: [
          { label: "Projects Completed", value: 3, suffix: "+" },
          { label: "Clients Served", value: 5, suffix: "+" },
          { label: "Services Delivered", value: 8 },
          { label: "Years of Experience", value: 2, suffix: "+" },
        ],
      },
      process: {
        title: "How We Deliver",
        heading: "A Proven Project Delivery Process",
        steps: [
          { title: "Consultation", description: "We listen first — understanding your vision, requirements, site constraints and budget before anything else." },
          { title: "Planning & Design", description: "Feasibility, brief development and design options shaped to your objectives and regulatory environment." },
          { title: "Cost Estimation", description: "Accurate measurement and estimation so you know the true cost before you commit." },
          { title: "Procurement", description: "Strategic sourcing of materials, equipment, labour and subcontractors — right quality, right price, right time." },
          { title: "Construction", description: "Professional execution with rigorous attention to quality, safety, efficiency and durability." },
          { title: "Project Delivery", description: "Handover, commissioning and aftercare — delivering a completed asset that performs as promised." },
        ],
      },
      partners: {
        title: "Our Partners",
        heading: "Trusted by the Companies We Work With",
        logos: [],
      },
      cta: {
        title: "Have a Project in Mind?",
        content: "Tell us about your project. We'll help you plan it properly, price it honestly and deliver it to a standard you can be proud of.",
        primaryLabel: "Request a Quote",
        secondaryLabel: "Book a Consultation",
        tertiaryLabel: "Contact Us",
      },
    },
    about: {
      overview: {
        title: "About SAAJ Partners and Consult",
        content:
          "SAAJ Partners and Consult is a dynamic construction, consulting, and project management firm committed to delivering innovative, cost-effective, and quality solutions across the built environment.\n\nWe provide integrated services in Design, Procurement, Construction, General Contracting, Quantity Surveying, Design & Build, Project Management, and Consultancy. Our approach combines technical expertise, professional management, and a strong commitment to quality, integrity, and client satisfaction.\n\nAt SAAJ Partners and Consult, we transform ideas into practical solutions and projects into lasting value.",
        image: P.about,
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
    },
  };

  const valueJson = (value: unknown) => value as Prisma.InputJsonValue;
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: valueJson(value) },
      create: { key, value: valueJson(value) },
    });
  }
  console.log("✔ Site settings seeded.");

  // -------------------------------------------------------------------------
  // 3. Services
  // -------------------------------------------------------------------------
  const services = [
    {
      title: "Design",
      slug: "design",
      icon: "drafting-compass",
      image: P.service,
      shortDescription: "Creative and functional design solutions tailored to project requirements, aesthetics, functionality, and budget.",
      description:
        "Every great project begins with a clear, buildable design. Our design service covers architectural and functional planning that balances aesthetics, practicality and cost.\n\nWe work closely with you to understand your lifestyle, business or operational needs, then translate them into designs that are elegant, compliant and optimised for construction.",
      benefits: ["Designs tailored to your brief, site and budget", "Buildability considered from the first sketch", "Compliance with applicable standards and regulations"],
      process: [
        { title: "Brief & Site Analysis", description: "We capture your requirements and study the site, constraints and opportunities." },
        { title: "Concept Design", description: "We develop options for your review and alignment." },
        { title: "Detailed Design", description: "We refine, coordinate and document the design for construction." },
      ],
      featured: true,
      sortOrder: 1,
    },
    {
      title: "Procurement",
      slug: "procurement",
      icon: "package-search",
      image: P.service,
      shortDescription: "Strategic sourcing and purchasing of materials, equipment, and services — ensuring quality, competitive pricing and timely delivery.",
      description:
        "Successful projects are built on reliable supply. Our procurement service sources materials, equipment, subcontractors and services with a rigorous focus on quality, price and delivery timing.\n\nWe manage supplier relationships, negotiate terms, and track orders so your project never stalls waiting on materials.",
      benefits: ["Quality-first sourcing and supplier vetting", "Competitive, transparent pricing", "Timely delivery that protects your programme"],
      process: [
        { title: "Requirement Definition", description: "We specify exactly what is needed, when and to what standard." },
        { title: "Supplier Sourcing", description: "We identify and vet capable suppliers and subcontractors." },
        { title: "Sourcing & Delivery", description: "We negotiate, order and track delivery to site." },
      ],
      featured: false,
      sortOrder: 2,
    },
    {
      title: "Construction",
      slug: "construction",
      icon: "building-2",
      image: P.service,
      shortDescription: "Professional execution of building and infrastructure projects with emphasis on quality, safety, efficiency and durability.",
      description:
        "Construction is where plans become reality — and where discipline matters most. We execute building and infrastructure projects with a relentless focus on quality, safety, efficiency and durability.\n\nOur site teams follow clear quality plans, rigorous safety procedures and realistic programmes, keeping you informed at every milestone.",
      benefits: ["Quality workmanship and materials", "Strict safety and QA procedures", "Transparent progress reporting"],
      process: [
        { title: "Mobilisation", description: "Site setup, teams, plant and quality plans prepared." },
        { title: "Execution", description: "Systematic construction following the programme and quality plan." },
        { title: "Inspection & Handover", description: "Snagging, commissioning and clean handover with as-built records." },
      ],
      featured: true,
      sortOrder: 3,
    },
    {
      title: "General Contracting",
      slug: "general-contracting",
      icon: "container",
      image: P.service,
      shortDescription: "Complete project execution and coordination — managing resources, trades, schedules, quality and costs from start to completion.",
      description:
        "We act as your single point of accountability for the whole project. Our general contracting service coordinates every trade, resource, schedule and cost line from first day to final handover.\n\nYou deal with one team that manages subcontractors, materials, quality, safety and programme — so the project runs smoothly and you are never left chasing multiple parties.",
      benefits: ["One accountable delivery partner", "Coordinated trades and resources", "Integrated cost, quality and programme control"],
      process: [
        { title: "Pre-Contract", description: "Programming, packaging, subcontractor procurement and mobilisation planning." },
        { title: "Construction Delivery", description: "Day-to-day direction, coordination and quality control." },
        { title: "Completion", description: "Defects management, handover and post-completion support." },
      ],
      featured: false,
      sortOrder: 4,
    },
    {
      title: "Quantity Surveying",
      slug: "quantity-surveying",
      icon: "calculator",
      image: P.service,
      shortDescription: "Comprehensive cost management, measurement, estimating, tendering, valuation, budgeting and financial control throughout the project lifecycle.",
      description:
        "Cost certainty is our specialty. Our quantity surveyors provide full cost management — measurement, estimating, tender preparation, valuation and financial control — from feasibility to final account.\n\nWhether you need a budget, a bill of quantities, tender documents or ongoing cost reporting, we give you the numbers and the insight to make confident decisions.",
      benefits: ["Accurate estimates and budgets", "Complete bills of quantities", "Independent valuation and cost reporting"],
      process: [
        { title: "Cost Planning", description: "Feasibility estimates and budget benchmarking." },
        { title: "Tendering", description: "Documentation, evaluation and contract advice." },
        { title: "Financial Control", description: "Valuations, variations, cash flow and final account." },
      ],
      featured: true,
      sortOrder: 5,
    },
    {
      title: "Design & Build",
      slug: "design-build",
      icon: "ruler",
      image: P.service,
      shortDescription: "An integrated approach combining design and construction under one coordinated team for efficient delivery, cost control and streamlined execution.",
      description:
        "Design & Build unites design and construction under one contract and one team. The architect/designers and builders work together from day one, removing the friction and disputes common to traditional delivery.\n\nFor clients it means a single point of responsibility, earlier cost certainty and faster, smoother delivery.",
      benefits: ["Single point of responsibility", "Reduced risk of design-construction clashes", "Faster programme and earlier cost certainty"],
      process: [
        { title: "Brief & Concept", description: "Requirements captured and design options developed with buildability in mind." },
        { title: "Design & Develop", description: "Design refined and priced as it develops — no surprises." },
        { title: "Construct & Handover", description: "The same team delivers the design it priced." },
      ],
      featured: true,
      sortOrder: 6,
    },
    {
      title: "Consultancy",
      slug: "consultancy",
      icon: "briefcase",
      image: P.service,
      shortDescription: "Professional technical and commercial advice that helps clients make informed decisions, manage risks and achieve their project objectives.",
      description:
        "Good decisions need good advice. Our consultancy service gives you independent technical and commercial guidance — feasibility, procurement strategy, cost advice, contract management and risk assessment.\n\nWe help individuals, businesses and institutions make informed choices before committing capital, and guide them through the complexities of the built environment.",
      benefits: ["Objective, independent advice", "Feasibility and risk insight", "Procurement and contract strategy"],
      process: [
        { title: "Understand", description: "We assess your objectives, constraints and risk appetite." },
        { title: "Analyse", description: "We evaluate options, costs, programmes and risks." },
        { title: "Advise", description: "We give clear, actionable recommendations you can act on." },
      ],
      featured: false,
      sortOrder: 7,
    },
    {
      title: "Project Management",
      slug: "project-management",
      icon: "clipboard-check",
      image: P.service,
      shortDescription: "Planning, coordinating, monitoring and controlling projects to ensure they are delivered on time, within budget and to the required quality standards.",
      description:
        "We keep your project moving in the right direction. Our project managers plan, coordinate, monitor and control every aspect of delivery — scope, time, cost, quality, risk and communication.\n\nYou get a clear programme, honest reporting and proactive management that turns plans into delivered projects.",
      benefits: ["Delivery on time and within budget", "Proactive risk and issue management", "Clear, honest progress reporting"],
      process: [
        { title: "Initiation & Planning", description: "Objectives, scope, programme and budget baselined." },
        { title: "Execution & Control", description: "Coordination, progress tracking and corrective action." },
        { title: "Closure", description: "Handover, commissioning, lessons learned and closeout." },
      ],
      featured: true,
      sortOrder: 8,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`✔ ${services.length} services seeded (demo).`);

  // -------------------------------------------------------------------------
  // 4. Projects (demo records — replace from the admin dashboard)
  // -------------------------------------------------------------------------
  const projects = [
    {
      name: "Lekki Continental Residence",
      slug: "lekki-continental-residence",
      location: "Lekki Phase 1, Lagos",
      category: "Residential",
      year: 2025,
      client: "Private Client",
      status: "completed",
      description:
        "A modern 4-bedroom family residence delivered through a coordinated design & build programme. The project demonstrates our integrated approach — architectural design, cost management and construction under one accountable team.",
      image: P.project,
      featured: true,
      gallery: [P.project, P.generic, P.service],
    },
    {
      name: "Victoria Island Corporate Hub",
      slug: "victoria-island-corporate-hub",
      location: "Victoria Island, Lagos",
      category: "Commercial",
      year: 2025,
      client: "Corporate Tenant",
      status: "completed",
      description:
        "A workplace fit-out and refurbishment delivered on a demanding commercial programme. Project management and quantity surveying services kept cost and schedule firmly under control.",
      image: P.project,
      featured: true,
      gallery: [P.project, P.generic, P.about],
    },
    {
      name: "Ikorodu Industrial Warehouse",
      slug: "ikorodu-industrial-warehouse",
      location: "Ikorodu Industrial Layout, Lagos",
      category: "Industrial",
      year: 2024,
      client: "Manufacturing Firm",
      status: "completed",
      description:
        "A steel-framed warehousing facility delivered with procurement-led materials management. Our general contracting capability coordinated structural steel, cladding and services packages.",
      image: P.project,
      featured: false,
      gallery: [P.project, P.service, P.generic],
    },
    {
      name: "Abeokuta Access Road Works",
      slug: "abeokuta-access-road-works",
      location: "Abeokuta, Ogun State",
      category: "Infrastructure",
      year: 2025,
      client: "Community Project",
      status: "ongoing",
      description:
        "An access road improvement project covering earthworks, drainage and pavement construction. The project showcases our civil infrastructure and site supervision capability.",
      image: P.project,
      featured: false,
      gallery: [P.project, P.blog, P.generic],
    },
    {
      name: "Ikoyi Heritage Renovation",
      slug: "ikoyi-heritage-renovation",
      location: "Ikoyi, Lagos",
      category: "Renovation",
      year: 2024,
      client: "Property Owner",
      status: "completed",
      description:
        "A sensitive renovation of an older residential property — structural assessment, reconfiguration and modern finishes delivered without disrupting the surrounding fabric.",
      image: P.project,
      featured: false,
      gallery: [P.project, P.about, P.service],
    },
    {
      name: "Ibadan Mixed-Use Development",
      slug: "ibadan-mixed-use-development",
      location: "Ibadan, Oyo State",
      category: "Commercial",
      year: 2026,
      client: "Developer Client",
      status: "planning",
      description:
        "A mixed-use commercial and residential development currently in the planning and cost-planning stage — an example of our consultancy and quantity surveying work carried out before any capital commitment.",
      image: P.project,
      featured: false,
      gallery: [P.project, P.generic, P.blog],
    },
  ];

  for (const project of projects) {
    const { gallery, ...data } = project;
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: { ...data, images: { deleteMany: {}, create: gallery.map((url, i) => ({ url, sortOrder: i + 1 })) } },
      create: { ...data, images: { create: gallery.map((url, i) => ({ url, sortOrder: i + 1 })) } },
    });
  }
  console.log(`✔ ${projects.length} projects seeded (demo).`);

  // -------------------------------------------------------------------------
  // 5. Blog categories + posts (demo content)
  // -------------------------------------------------------------------------
  const categories = [
    { name: "Construction", slug: "construction" },
    { name: "Project Management", slug: "project-management" },
    { name: "Quantity Surveying", slug: "quantity-surveying" },
    { name: "Industry Insights", slug: "industry-insights" },
  ];

  for (const category of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const blogPosts = [
    {
      title: "A Beginner's Guide to Construction Cost Management",
      slug: "beginners-guide-to-construction-cost-management",
      image: P.blog,
      excerpt: "Understanding what drives construction costs — and how professional cost management keeps them under control from day one.",
      content: `Construction projects fail financially more often than they fail physically. The difference is almost always cost management — not luck.\n\n## Why costs spiral\n\nCosts rarely spiral for one dramatic reason. They creep: an unclear brief, a scope added without pricing discipline, materials purchased late and expensively, and variations managed informally.\n\nThe remedy is discipline from the very start.\n\n## The role of early cost planning\n\nBefore you break ground, a professional quantity surveyor can prepare a feasibility estimate, benchmark your budget against similar projects, and identify where value can be protected.\n\nEarly cost planning is the single most effective way to keep a project affordable.\n\n## Controlling cost during construction\n\nDuring delivery, cost control means:\n\n- Agreed, documented variations\n- Regular valuation of work done\n- Transparent cash-flow forecasting\n- Procurement of materials at the right time\n\n## In summary\n\nGood cost management is not about cutting quality. It is about making sure every naira you invest is accounted for, challenged where necessary, and focused on delivering the project you actually approved.\n\n*This article is sample content prepared for demonstration.*`,
      author: "SAAJ Editorial",
      categorySlug: "quantity-surveying",
      tags: ["cost management", "quantity surveying", "budgeting"],
      publishedDaysAgo: 12,
    },
    {
      title: "Design & Build: What It Is and When to Use It",
      slug: "design-and-build-what-it-is-and-when-to-use-it",
      image: P.blog,
      excerpt: "One contract, one accountable team. Why the design & build route is transforming how Nigerian projects are delivered.",
      content: `Traditionally, clients employ an architect and then separately engage a contractor. Between the two, problems can fall through the cracks.\n\n## A single point of responsibility\n\nDesign & Build brings design and construction under one contract. When something goes wrong, you have one team to hold accountable — not two parties pointing at each other.\n\n## Faster, more certain delivery\n\nBecause designers and builders collaborate from the start, designs are more buildable, decisions happen faster, and pricing is locked earlier.\n\n## When is it the right choice?\n\nChoose design & build when you:\n\n- Want a fixed budget and single responsibility\n- Need to move quickly from brief to site\n- Value a collaborative, problem-solving culture\n\n## In summary\n\nDesign & build is not right for every project, but for most residential, commercial and industrial developments it delivers speed, certainty and fewer disputes.\n\n*This article is sample content prepared for demonstration.*`,
      author: "SAAJ Editorial",
      categorySlug: "construction",
      tags: ["design and build", "project delivery"],
      publishedDaysAgo: 9,
    },
    {
      title: "How to Prepare Your Site Before Construction Begins",
      slug: "how-to-prepare-your-site-before-construction-begins",
      image: P.blog,
      excerpt: "The groundwork you do before construction begins determines how smoothly — and how cheaply — the project runs.",
      content: `Site preparation is where projects are won or lost.\n\n## Define the scope clearly\n\nA written brief — drawings, specifications and a schedule of works — prevents ambiguity and disputes later.\n\n## Engage professionals early\n\nSurveyors, designers and a quantity surveyor should be involved before you commit capital, not after problems appear.\n\n## Prepare access and logistics\n\nPlan how materials, equipment and labour will reach the site. Poor logistics add cost to every single day of construction.\n\n## Secure approvals and utilities\n\nConfirm planning consents, and arrange water, power and drainage connections in advance.\n\n## In summary\n\nProfessional site preparation is the cheapest insurance a project can buy. Invest in it.\n\n*This article is sample content prepared for demonstration.*`,
      author: "SAAJ Editorial",
      categorySlug: "construction",
      tags: ["site preparation", "construction"],
      publishedDaysAgo: 6,
    },
    {
      title: "The Role of the Quantity Surveyor in Modern Projects",
      slug: "role-of-the-quantity-surveyor-in-modern-projects",
      image: P.blog,
      excerpt: "Far more than counting bricks — the modern quantity surveyor is the financial conscience of your project.",
      content: `The quantity surveyor is often the most misunderstood member of the project team.\n\n## From measurement to strategy\n\nThe traditional role — measuring quantities and preparing bills — has grown. Modern QSs advise on procurement strategy, value engineering, risk and cash flow.\n\n## Protecting the client's money\n\nAs an independent cost professional, the QS presents figures without a commercial agenda. That independence is priceless during tendering and valuing work done.\n\n## In summary\n\nA good quantity surveyor saves you money in ways you see — and in ways you never notice.\n\n*This article is sample content prepared for demonstration.*`,
      author: "SAAJ Editorial",
      categorySlug: "quantity-surveying",
      tags: ["quantity surveyor", "cost management"],
      publishedDaysAgo: 4,
    },
    {
      title: "Procurement Essentials for Construction Projects",
      slug: "procurement-essentials-for-construction-projects",
      image: P.blog,
      excerpt: "Quality, price and timing — the three rules of construction procurement, and how a structured approach delivers all three.",
      content: `Materials can make up more than half of a construction project's cost. How you buy them matters.\n\n## Quality first\n\nCheap materials that fail early are the most expensive materials you can buy. Specifying and enforcing quality protects the whole development.\n\n## Negotiate transparently\n\nCompetitive, documented sourcing keeps prices honest without straining supplier relationships.\n\n## Buy at the right time\n\nOrdering materials late halts site progress and inflates cost. A procurement schedule aligned to the programme is essential.\n\n## In summary\n\nStructured procurement protects budget, programme and quality simultaneously.\n\n*This article is sample content prepared for demonstration.*`,
      author: "SAAJ Editorial",
      categorySlug: "industry-insights",
      tags: ["procurement", "materials", "supply chain"],
      publishedDaysAgo: 2,
    },
    {
      title: "Choosing the Right Construction Partner in Nigeria",
      slug: "choosing-the-right-construction-partner-in-nigeria",
      image: P.blog,
      excerpt: "The checklist we recommend every client use before appointing a contractor or consultant in Nigeria.",
      content: `Choosing a construction partner is one of the biggest decisions you will make as a project owner.\n\n## What to check\n\n- **Track record** — verified projects, not just promises\n- **Capability** — in-house expertise across the disciplines your project needs\n- **Cost discipline** — is quantity surveying embedded in their approach?\n- **Communication** — will you actually know what is happening on site?\n\n## Ask the right questions\n\nAsk how they handle variations, how they report progress, and who your single point of contact is.\n\n## In summary\n\nChoose a partner whose interests are aligned with yours. The cheapest quotation is rarely the cheapest project.\n\n*This article is sample content prepared for demonstration.*`,
      author: "SAAJ Editorial",
      categorySlug: "industry-insights",
      tags: ["choosing a contractor", "Nigeria"],
      publishedDaysAgo: 1,
    },
  ];

  for (const post of blogPosts) {
    const { categorySlug, publishedDaysAgo, ...data } = post;
    const category = await prisma.blogCategory.findUnique({ where: { slug: categorySlug } });
    const publishedAt = new Date(Date.now() - publishedDaysAgo * 24 * 60 * 60 * 1000);
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...data, categoryId: category?.id ?? null, isPublished: true, publishedAt },
      create: { ...data, categoryId: category?.id ?? null, isPublished: true, publishedAt },
    });
  }
  console.log(`✔ ${blogPosts.length} blog posts seeded (demo).`);

  // -------------------------------------------------------------------------
  // 6. Testimonials (clearly labelled sample content)
  // -------------------------------------------------------------------------
  const testimonials = [
    {
      name: "Adaeze O.",
      role: "Homeowner",
      company: "Lekki, Lagos",
      content: "Sample testimonial — SAAJ guided us through the cost planning of our new home with patience and honesty. We always knew exactly what we were paying for.",
      rating: 5,
      isDemo: true,
      sortOrder: 1,
    },
    {
      name: "Ibrahim M.",
      role: "Facilities Manager",
      company: "Ikeja, Lagos",
      content: "Sample testimonial — their project management reports kept our board informed and our contractor accountable. Professional from start to finish.",
      rating: 5,
      isDemo: true,
      sortOrder: 2,
    },
    {
      name: "Chidi N.",
      role: "Developer",
      company: "Ibadan, Oyo State",
      content: "Sample testimonial — the quantity surveying work gave us the confidence to commit capital to a new development. Accurate numbers, clear advice.",
      rating: 4,
      isDemo: true,
      sortOrder: 3,
    },
  ];

  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({ data: testimonial });
    }
    console.log("✔ 3 sample testimonials seeded (marked as demo).");
  } else {
    console.log(`→ ${existingTestimonials} testimonials already present — skipping sample testimonials.`);
  }

  // -------------------------------------------------------------------------
  // 7. Media library entries (placeholder images only)
  // -------------------------------------------------------------------------
  const mediaEntries = [
    { filename: "logo-mark.svg", url: P.logo, mimeType: "image/svg+xml", size: 1024, alt: "SAAJ logo mark" },
    { filename: "hero.svg", url: P.hero, mimeType: "image/svg+xml", size: 2048, alt: "Hero placeholder" },
    { filename: "project.svg", url: P.project, mimeType: "image/svg+xml", size: 2048, alt: "Project placeholder" },
  ];

  for (const entry of mediaEntries) {
    await prisma.media.create({ data: entry });
  }
  console.log("✔ Media library seeded with placeholder images.");

  // -------------------------------------------------------------------------
  // 8. Activity log
  // -------------------------------------------------------------------------
  const admin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  await prisma.activityLog.create({
    data: { action: "Seeded database", detail: "Initial demo content and settings created.", adminUserId: admin?.id },
  });
  console.log("✔ Activity log seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });