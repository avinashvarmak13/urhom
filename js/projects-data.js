/* ============================================================
   URHOM — Projects page data
   The single source for everything the Projects page renders.
   Presentation lives in js/projects.js; nothing below is hard-coded
   into markup.

   ⚠ UNVERIFIED PLACEHOLDERS — replace before publishing.
   Project names, cities, floor areas, completion years, the four
   headline statistics and the testimonials are sample content taken
   from the design reference. None of it has been confirmed as real
   client work. The `verified` flag below is false for exactly that
   reason; js/projects.js reads it and will keep the "sample content"
   notice visible until it is set to true.
   ============================================================ */
window.URHOM = window.URHOM || {};

window.URHOM.projects = {

  verified: false,

  /* ---- hero carousel ------------------------------------- */
  hero: [
    { img:'assets/projects/hero-residence', type:'Private Residence', city:'Visakhapatnam',
      line:'A warm, contemporary home designed around natural textures.',
      alt:'A sunlit living room with a cream sectional sofa, round timber table and a slatted wood wall.' },
    { img:'assets/projects/hero-workspace', type:'Corporate Workspace', city:'Hyderabad',
      line:'A calm, daylit floor plate built for focus and for teams.',
      alt:'A boardroom with a long timber table, tan leather chairs and a city view through full-height glazing.' },
    { img:'assets/projects/hero-dining',    type:'Fine Dining Interior', city:'Visakhapatnam',
      line:'Warm brass, low light and a room arranged around the table.',
      alt:'A warmly lit restaurant with banquette seating, globe pendants and a backlit bar.' },
    { img:'assets/projects/hero-retail',    type:'Lifestyle Store',   city:'Hyderabad',
      line:'A retail floor that lets the product do the talking.',
      alt:'A home decor showroom with open shelving, styled ceramics and warm track lighting.' }
  ],

  /* ---- hero capability notes ----------------------------- */
  capabilities: [
    { t:'End-to-end',  s:'Interior Solutions',
      icon:'<path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 21v-6h5v6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' },
    { t:'Premium',     s:'Materials & Finishes',
      icon:'<path d="m12 3 3 5.2h6L18 13l1.4 6L12 16l-7.4 3L6 13 3 8.2h6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' },
    { t:'Expert Design', s:'Consultation',
      icon:'<path d="M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-1.5v-6H20M4 17v-4h3.5v6H6a2 2 0 0 1-2-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' }
  ],

  /* ---- category strip ------------------------------------ */
  categories: [
    { id:'all',           title:'All Projects',  sub:'View all projects',        img:'assets/card-furniture',
      alt:'A cream sectional sofa in a sunlit living room with a timber slat wall.' },
    { id:'residential',   title:'Residential',   sub:'Homes & Villas',           img:'assets/project-home',
      alt:'A residential living room with a low sofa, coffee table and garden view.' },
    { id:'apartments',    title:'Apartments',    sub:'Modern Living',            img:'assets/project-apartment',
      alt:'A compact apartment interior with a dining nook beside tall windows.' },
    { id:'commercial',    title:'Commercial',    sub:'Workspaces & Offices',     img:'assets/project-office',
      alt:'An open-plan office with desks and glazed partitions.' },
    { id:'retail',        title:'Retail',        sub:'Showrooms & Stores',       img:'assets/project-retail',
      alt:'A retail showroom floor with display shelving and warm lighting.' },
    { id:'hospitality',   title:'Hospitality',   sub:'Hotels & Restaurants',     img:'assets/love-dining',
      alt:'A restaurant dining room with pendant lights over a long timber table.' },
    { id:'institutional', title:'Institutional', sub:'Schools & Healthcare',     img:'assets/love-office',
      alt:'A bright shared workroom with long tables and soft daylight.' }
  ],

  /* ---- featured projects ---------------------------------
     `shape` only drives the card's aspect ratio in the masonry. */
  items: [
    { id:'seaside-villa',       name:'Seaside Villa',          city:'Visakhapatnam',
      cat:'residential', catLabel:'Residential', area:'4,200 sq.ft', year:2024, shape:'tall',
      img:'assets/card-furniture',
      alt:'A double-height living room with a cream sectional, round timber table and full-height glazing onto trees.',
      blurb:'A coastal home arranged around light and long views, with natural timber and a restrained, warm palette throughout.' },
    { id:'urban-apartment',     name:'Urban Apartment',        city:'Visakhapatnam',
      cat:'apartments', catLabel:'Residential', area:'1,800 sq.ft', year:2023, shape:'wide',
      img:'assets/project-apartment',
      alt:'A bedroom with an upholstered headboard, bedside lamps and sheer curtains.',
      blurb:'Compact city living planned for storage first, then softened with layered textiles and quiet lighting.' },
    { id:'corporate-workspace', name:'Corporate Workspace',    city:'Hyderabad',
      cat:'commercial', catLabel:'Commercial', area:'12,000 sq.ft', year:2024, shape:'wide',
      img:'assets/love-office',
      alt:'An open-plan workspace with long shared desks, task seating and glazed meeting rooms.',
      blurb:'A floor plate split between focus and collaboration, finished in materials chosen to wear well.' },
    { id:'skyline-apartment',   name:'Skyline Apartment',      city:'Hyderabad',
      cat:'apartments', catLabel:'Residential', area:'2,800 sq.ft', year:2024, shape:'wide',
      img:'assets/love-dining',
      alt:'A dining area with a round table, pendant cluster and open shelving behind.',
      blurb:'An open plan held together by one continuous timber line running from kitchen to dining.' },
    { id:'lifestyle-store',     name:'Lifestyle Store',        city:'Hyderabad',
      cat:'retail', catLabel:'Retail', area:'3,500 sq.ft', year:2024, shape:'tall',
      img:'assets/project-retail',
      alt:'A retail interior with hanging rails, display plinths and warm track lighting.',
      blurb:'A shop floor laid out as a walk, with sightlines that keep the product in view from the door.' },
    { id:'luxury-apartment',    name:'Luxury Apartment',       city:'Vijayawada',
      cat:'residential', catLabel:'Residential', area:'3,600 sq.ft', year:2024, shape:'tall',
      img:'assets/project-home',
      alt:'A living room with a deep sofa, textured rug and tall windows onto a terrace.',
      blurb:'Generous rooms kept calm: fewer pieces, better materials, and light allowed to do the work.' },
    { id:'tech-office',         name:'Tech Office',            city:'Bengaluru',
      cat:'commercial', catLabel:'Commercial', area:'8,000 sq.ft', year:2024, shape:'wide',
      img:'assets/project-office',
      alt:'A long office bench desk under pendant lighting with planting along the window line.',
      blurb:'Built for a team that moves: modular desking, acoustic softening and a lot of daylight.' },
    { id:'fine-dining',         name:'Fine Dining Restaurant', city:'Visakhapatnam',
      cat:'hospitality', catLabel:'Hospitality', area:'5,000 sq.ft', year:2023, shape:'wide',
      img:'assets/step-curate',
      alt:'A warmly lit dining room with upholstered seating and brass detailing.',
      blurb:'Low light, warm metal and banquette seating arranged so every table feels like the good one.' },
    { id:'penthouse',           name:'Penthouse Residence',    city:'Visakhapatnam',
      cat:'residential', catLabel:'Residential', area:'4,800 sq.ft', year:2024, shape:'wide',
      img:'assets/card-decor',
      alt:'A styled console and seating area with ceramics, art and a wide window.',
      blurb:'The top floor treated as one room, with furniture used to draw the plan rather than walls.' }
  ],

  /* ---- statistics (illustrative, unverified) -------------- */
  stats: [
    { n:'250+', label:'Projects Completed',
      icon:'<path d="M3.5 10.5 12 4l8.5 6.5V20h-17Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="13" r="2.2" stroke="currentColor" stroke-width="1.5"/>' },
    { n:'15+',  label:'Cities Across India',
      icon:'<path d="M12 21s-6.4-5.8-6.4-10.5A6.4 6.4 0 0 1 18.4 10.5C18.4 15.2 12 21 12 21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="10.3" r="2.3" stroke="currentColor" stroke-width="1.5"/>' },
    { n:'1M+',  label:'Sq.ft. Transformed',
      icon:'<rect x="4" y="4" width="16" height="16" rx="1.6" stroke="currentColor" stroke-width="1.5"/><path d="M4 12h16M12 4v16" stroke="currentColor" stroke-width="1.5"/>' },
    { n:'98%',  label:'Client Satisfaction',
      icon:'<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' }
  ],

  /* ---- approach ------------------------------------------- */
  steps: [
    { n:'01', t:'Understand', s:'Your needs, space and lifestyle.',  img:'assets/step-understand', alt:'A designer and client talking over a plan in a bright room.' },
    { n:'02', t:'Design',     s:'Concepts tailored to your taste.',  img:'assets/step-curate',     alt:'Material and finish samples laid out on a table.' },
    { n:'03', t:'Source',     s:'Premium products and materials.',   img:'assets/step-guide',      alt:'Fabric and timber swatches being compared.' },
    { n:'04', t:'Execute',    s:'Expert installation and styling.',  img:'assets/step-deliver',    alt:'An installation team fitting out a finished room.' },
    { n:'05', t:'Handover',   s:"A space you'll love to live in.",   img:'assets/step-support',    alt:'A completed, styled living room ready for handover.' }
  ],

  /* ---- testimonials (sample, matching the home page) ------- */
  testimonials: [
    { q:'URHOM transformed our house into a home. The attention to detail and choice of materials were exceptional.',
      name:'Rohan M.',  place:'Visakhapatnam', avatar:'assets/avatar-rohan',  stars:5 },
    { q:'Professional, creative and hassle-free. Our office space now truly reflects our brand identity.',
      name:'Swathi K.', place:'Hyderabad',     avatar:'assets/avatar-swathi', stars:5 },
    { q:'They understood our style so well and delivered beyond expectations. Highly recommended.',
      name:'Arjun P.',  place:'Vijayawada',    avatar:'assets/avatar-arjun',  stars:5 }
  ],

  /* ---- closing banner ------------------------------------- */
  cta: { img:'assets/process-bg',
         alt:'A styled dining space with timber chairs, ceramics and soft daylight.' }
};
