// FIELDFINDER — Alameda + San Francisco County Data
// BASE SCORING (stored in needScore):
//   Score = (SVI × 0.5) + (BaseballFields/18 × 0.25) + (B&GC/18 × 0.25) × 10
//
// ADJUSTED SCORING WITH ORG COVERAGE (use getAdjustedNeighborhood or getAllAdjustedNeighborhoods):
//   Base Score = (SVI × 0.5) + (BaseballFields/18 × 0.25) + (B&GC/18 × 0.25) × 10  [same as original]
//   Org Coverage Reduction = sum of nearby program impacts, capped at 1.5 points
//   Adjusted Score = Base Score - Org Coverage Reduction (0–1.5 points)
//   → Areas with NO nearby orgs keep full score (high need)
//   → Areas with good org coverage get modest reduction (still ~4+ if base is 5+)
//   → RBI/Little League programs have highest impact; Parks & Rec / Nonprofit lower
//   → Free programs have 100% impact; low-cost 80%; paid 50%
//   → Distance decay: programs closer to neighborhood center have more impact
//
// Free lunch % is a secondary economic-need proxy (% students on free/reduced lunch).
// SVI = CDC Social Vulnerability Index (0–1, higher = more vulnerable).
// =============================================================

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  county: string;
  zipCodes: string[];
  lat: number;
  lng: number;
  needScore: number;            // RBI Readiness × 10 (0–10)
  sviScore: number;             // CDC SVI 0–1
  freeLunchPct: number;         // % students on free/reduced lunch (0–1)
  baseballFieldCount: number;   // confirmed or estimated fields in ZIP
  bgcCount: number;             // Boys & Girls Club locations in ZIP
  population: number;           // total ZIP population (census)
  strongInfrastructure: boolean;
  strongOrg: boolean;
  milestoNearestAffiliate: number | null;
  nearestAffiliateName: string | null;
  hasConfirmedField: boolean;
  gapStatus: 'gap' | 'covered';
  fields: Field[];
  suggestedAnchor: OrgAnchor | null;
  fieldNote: string | null;
}

export interface Field {
  id: string;
  name: string;
  lat: number;
  lng: number;
  condition: 'ready' | 'investment-needed' | 'gap';
  conditionNotes: string;
  confirmedByOSM: boolean;
  confirmedByGoogle: boolean;
  isRecCenter: boolean;
  hours?: string;
}

export interface OrgAnchor {
  name: string;
  type: 'rec-center' | 'school' | 'bgc';
  distanceMiles: number;
  phone?: string;
  hasGym: boolean;
}

export interface Program {
  id: string;
  name: string;
  orgType: 'rbi' | 'little-league' | 'parks-rec' | 'nonprofit';
  lat: number;
  lng: number;
  city: string;
  address: string;
  ageMin: number;
  ageMax: number;
  cost: 'free' | 'low-cost' | 'paid';
  equipmentProvided: boolean;
  season: string;
  registrationOpen: boolean;
  registrationWindow: string;
  phone?: string;
  website?: string;
  email?: string;
  status: 'confirmed-active' | 'listed';
  coverageRadiusMiles: number;
  description: string;
  notes?: string;
  descriptionIsPlaceholder: boolean;
  registrationWindowIsPlaceholder: boolean;
}

// ── NEIGHBORHOODS ──────────────────────────────────────────────
// One entry per ZIP code from the Excel source data.
// Scores computed from: SVI (50%), Baseball Field density (25%), B&GC density (25%).
// Sorted by needScore descending.

export const neighborhoods: Neighborhood[] = [
  // ── TIER 1: Score ≥ 4.0 ────────────────────────────────────

  {
    id: 'hegenberger-coliseum',
    name: 'Hegenberger / Coliseum Area',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94621'],
    lat: 37.7422,
    lng: -122.2069,
    needScore: 6.70,
    sviScore: 0.645,
    freeLunchPct: 0.936,
    baseballFieldCount: 11,
    bgcCount: 14,
    population: 36121,
    strongInfrastructure: true,
    strongOrg: true,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'covered',
    fields: [
      {
        id: 'mcconnell-field',
        name: 'McConnell Field',
        lat: 37.7415,
        lng: -122.2050,
        condition: 'investment-needed',
        conditionNotes: 'Playable diamond confirmed. Unsafe environment flagged in community reviews — adult loitering deters family use. Safety investment needed alongside any program launch.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
      {
        id: 'rickey-henderson-field',
        name: 'Rickey Henderson Field',
        lat: 37.7430,
        lng: -122.2085,
        condition: 'investment-needed',
        conditionNotes: 'Named field, playable condition. Same environmental safety concerns as McConnell. High infrastructure density in this ZIP — 11 confirmed fields total.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
    ],
    suggestedAnchor: null,
    fieldNote: '11 confirmed fields, 14 B&GC locations, 93.6% free lunch — top-ranked ZIP. Infrastructure is ready; the barrier is safety. Community reviews consistently flag loitering that keeps families away. Any deployment needs a community-safety partnership alongside the program.',
  },

  {
    id: 'alameda-island',
    name: 'Alameda',
    city: 'Alameda',
    county: 'Alameda County',
    zipCodes: ['94501'],
    lat: 37.7788,
    lng: -122.2752,
    needScore: 4.95,
    sviScore: 0.268,
    freeLunchPct: 0.389,
    baseballFieldCount: 12,
    bgcCount: 14,
    population: 65435,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '12 fields and 14 B&GC locations — deep infrastructure despite moderate economic need (38.9% free lunch). Island geography helps with retention; youth don\'t travel far. No baseball-specific org confirmed — high-efficiency deployment candidate.',
  },

  {
    id: 'fruitvale',
    name: 'Fruitvale / Jingletown',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94601'],
    lat: 37.7758,
    lng: -122.2194,
    needScore: 4.94,
    sviScore: 0.460,
    freeLunchPct: 0.871,
    baseballFieldCount: 1,
    bgcCount: 18,
    population: 53712,
    strongInfrastructure: false,
    strongOrg: true,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'covered',
    fields: [
      {
        id: 'brookdale-park',
        name: 'Brookdale Park',
        lat: 37.7762,
        lng: -122.2200,
        condition: 'investment-needed',
        conditionNotes: 'Park is clean, well-maintained, and highly active. However, across 221 Google reviews, zero mention of baseball. Soccer and basketball dominate. Confirm whether a baseball diamond physically exists before flagging as a gap or deploying equipment.',
        confirmedByOSM: false,
        confirmedByGoogle: false,
        isRecCenter: false,
        hours: 'Dawn to dusk',
      },
    ],
    suggestedAnchor: null,
    fieldNote: 'Highest B&GC count in the dataset (18 locations) and 87.1% free lunch — strong need and org depth. Critical caveat: across 221 Brookdale Park reviews, zero mention baseball. Soccer dominates. Confirm a diamond physically exists and gauge community interest before committing.',
  },

  {
    id: 'excelsior',
    name: 'Excelsior / Outer Mission',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94112'],
    lat: 37.7213,
    lng: -122.4404,
    needScore: 4.88,
    sviScore: 0.199,
    freeLunchPct: 0.621,
    baseballFieldCount: 18,
    bgcCount: 10,
    population: 78961,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Most field-rich SF ZIP (18 confirmed diamonds), 62.1% free lunch, 78k residents. No org flag — no league is using this infrastructure. A program could activate multiple fields here with zero capital investment.',
  },

  {
    id: 'bayview-hp',
    name: 'Bayview-Hunters Point',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94124'],
    lat: 37.7289,
    lng: -122.3819,
    needScore: 4.53,
    sviScore: 0.433,
    freeLunchPct: 0.843,
    baseballFieldCount: 9,
    bgcCount: 8,
    population: 39179,
    strongInfrastructure: true,
    strongOrg: true,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'covered',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '9 confirmed fields, strong org presence, 84.3% free lunch. Existing programs are operating here. Key question: do they cover baseball specifically, and do they reach the full age range? Expansion candidate, not greenfield.',
  },

  {
    id: 'sobrante-park',
    name: 'Sobrante Park / Elmhurst',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94603'],
    lat: 37.7368,
    lng: -122.1802,
    needScore: 4.50,
    sviScore: 0.538,
    freeLunchPct: 0.954,
    baseballFieldCount: 2,
    bgcCount: 11,
    population: 34880,
    strongInfrastructure: false,
    strongOrg: true,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'covered',
    fields: [
      {
        id: 'sobrante-park-diamond',
        name: 'Sobrante Park Baseball Diamond',
        lat: 37.7305,
        lng: -122.1530,
        condition: 'investment-needed',
        conditionNotes: 'Diamond confirmed via satellite and ground-level reports. Backstop intact. Infield needs grading. Bathrooms permanently closed — a chronic municipal maintenance deficit. No lights. Playable but not deployment-ready without rehabilitation.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
        hours: 'Dawn to dusk',
      },
    ],
    suggestedAnchor: {
      name: 'Ira Jinkins Community Center',
      type: 'rec-center',
      distanceMiles: 0.8,
      phone: '(510) 238-7275',
      hasGym: true,
    },
    fieldNote: 'Highest free-lunch rate in the dataset (95.4%). Diamond confirmed but infield needs grading and bathrooms are permanently closed — needs capital. Ira Jinkins Community Center (0.8 mi) is the org anchor; no baseball program identified yet. Infrastructure and org depth are there; needs a funder and an affiliate to activate.',
  },

  {
    id: 'visitacion-valley',
    name: 'Visitacion Valley',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94134'],
    lat: 37.7204,
    lng: -122.4128,
    needScore: 4.44,
    sviScore: 0.221,
    freeLunchPct: 0.735,
    baseballFieldCount: 16,
    bgcCount: 8,
    population: 42494,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '16 confirmed fields — most of any SF ZIP — with zero org presence. 73.5% free lunch. Clearest "show up and launch" opportunity in SF: no field investment needed, just an organization.',
  },

  // ── TIER 2: Score 2.5–4.0 ───────────────────────────────────

  {
    id: 'eastmont',
    name: 'Eastmont / Millsmont / Maxwell Park',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94605'],
    lat: 37.7596,
    lng: -122.1539,
    needScore: 3.46,
    sviScore: 0.304,
    freeLunchPct: 0.830,
    baseballFieldCount: 0,
    bgcCount: 14,
    population: 43656,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [
      {
        id: 'arroyo-viejo-rec',
        name: 'Arroyo Viejo Recreation Center',
        lat: 37.7600,
        lng: -122.1545,
        condition: 'investment-needed',
        conditionNotes: 'General sports fields confirmed. No dedicated baseball diamond identified. Rec center has active after-school and summer programming. Staff-managed, well-organized. Baseball could be introduced to the existing program mix without additional capital investment if a suitable field surface exists.',
        confirmedByOSM: false,
        confirmedByGoogle: true,
        isRecCenter: true,
        hours: 'Varies by program schedule',
      },
    ],
    suggestedAnchor: {
      name: 'Arroyo Viejo Recreation Center',
      type: 'rec-center',
      distanceMiles: 0.1,
      phone: '(510) 482-7580',
      hasGym: true,
    },
    fieldNote: 'Arroyo Viejo Rec Center is active, staffed, and running after-school programs — org infrastructure exists. No confirmed baseball diamond. 83.0% free lunch, 14 B&GC locations. The blocker is field identification, not organization.',
  },

  {
    id: 'downtown-hayward',
    name: 'Downtown Hayward / Cherryland',
    city: 'Hayward',
    county: 'Alameda County',
    zipCodes: ['94541'],
    lat: 37.6762,
    lng: -122.0881,
    needScore: 3.30,
    sviScore: 0.298,
    freeLunchPct: 0.793,
    baseballFieldCount: 2,
    bgcCount: 11,
    population: 69017,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [
      {
        id: 'centennial-park-diamonds',
        name: 'Centennial Park (2 Baseball Diamonds)',
        lat: 37.6770,
        lng: -122.0900,
        condition: 'ready',
        conditionNotes: 'Two confirmed baseball diamonds. Active family use. Basketball courts, large grass area. Clean and well-maintained per community reviews.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
        hours: 'Dawn to dusk',
      },
      {
        id: 'cannery-park-field',
        name: 'Cannery Park Baseball Field',
        lat: 37.6755,
        lng: -122.0870,
        condition: 'ready',
        conditionNotes: 'Confirmed baseball field with bleachers and functioning restrooms. Clean per reviews. Active use.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
    ],
    suggestedAnchor: null,
    fieldNote: 'Strongest deployment candidate in Hayward. Centennial Park has two ready diamonds, Cannery Park has a field with bleachers and working restrooms — zero org presence across all reviews. 79.3% free lunch. No capital needed; this ZIP just needs an organization to show up.',
  },

  {
    id: 'castro-valley',
    name: 'Castro Valley',
    city: 'Castro Valley',
    county: 'Alameda County',
    zipCodes: ['94546'],
    lat: 37.7428,
    lng: -122.1054,
    needScore: 3.19,
    sviScore: 0.249,
    freeLunchPct: 0.400,
    baseballFieldCount: 5,
    bgcCount: 9,
    population: 45899,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '5 fields, 9 B&GC locations, 40.0% free lunch. Solid infrastructure but lower economic need than Oakland and Hayward ZIPs. Secondary target — verify field conditions before committing.',
  },

  {
    id: 'north-san-leandro',
    name: 'North San Leandro',
    city: 'San Leandro',
    county: 'Alameda County',
    zipCodes: ['94577'],
    lat: 37.7128,
    lng: -122.1642,
    needScore: 3.19,
    sviScore: 0.222,
    freeLunchPct: 0.739,
    baseballFieldCount: 7,
    bgcCount: 8,
    population: 48108,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [
      {
        id: 'sl-ball-park',
        name: 'San Leandro Ball Park',
        lat: 37.7120,
        lng: -122.1630,
        condition: 'ready',
        conditionNotes: 'San Leandro Little League (SLLL) confirmed active here. Has lights for night games. A known, functioning league home — families view asset.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
    ],
    suggestedAnchor: null,
    fieldNote: 'San Leandro Little League is active at San Leandro Ball Park (lights, confirmed). Partially covered. 7 fields, 8 B&GC locations, 73.9% free lunch. Question is whether SLLL reaches lower-income pockets — if not, a supplemental program could fill the gap.',
  },

  {
    id: 'dublin',
    name: 'Dublin',
    city: 'Dublin',
    county: 'Alameda County',
    zipCodes: ['94568'],
    lat: 37.7144,
    lng: -121.8942,
    needScore: 3.07,
    sviScore: 0.281,
    freeLunchPct: 0.149,
    baseballFieldCount: 0,
    bgcCount: 12,
    population: 73177,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Score driven by B&GC density (12 locations), not need — 14.9% free lunch. No confirmed fields. Better as a delivery partner for neighboring high-need ZIPs than a primary deployment site.',
  },

  {
    id: 'redwood-heights',
    name: 'Redwood Heights / Laurel',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94619'],
    lat: 37.7923,
    lng: -122.1696,
    needScore: 2.88,
    sviScore: 0.270,
    freeLunchPct: 0.631,
    baseballFieldCount: 3,
    bgcCount: 8,
    population: 23752,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '3 fields, 8 B&GC locations, 63.1% free lunch. No org activation. Moderate priority — higher need than suburban ZIPs, lower urgency than top-tier Oakland.',
  },

  {
    id: 'san-antonio',
    name: 'San Antonio / Garfield',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94606'],
    lat: 37.7897,
    lng: -122.2484,
    needScore: 2.77,
    sviScore: 0.277,
    freeLunchPct: 0.864,
    baseballFieldCount: 3,
    bgcCount: 7,
    population: 39018,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [
      {
        id: 'garfield-park-diamond',
        name: 'Garfield Park Baseball Field',
        lat: 37.7910,
        lng: -122.2490,
        condition: 'gap',
        conditionNotes: 'Confirmed baseball diamond — appears in zero Google reviews. No operating hours listed, no organizational presence, no community footprint online. Exactly the type of invisible infrastructure FieldFinder is designed to surface.',
        confirmedByOSM: true,
        confirmedByGoogle: false,
        isRecCenter: false,
      },
      {
        id: 'san-antonio-park',
        name: 'San Antonio Park',
        lat: 37.7895,
        lng: -122.2500,
        condition: 'gap',
        conditionNotes: 'Most active community space in the ZIP — soccer, basketball, boxing daily. Zero baseball signal across all reviews. High foot traffic but no baseball culture present.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
    ],
    suggestedAnchor: {
      name: 'San Antonio Recreation Center',
      type: 'rec-center',
      distanceMiles: 0.3,
      hasGym: true,
    },
    fieldNote: 'Garfield Park has a confirmed diamond with zero Google reviews — no org, no community footprint. San Antonio Park is active daily (soccer, basketball) but zero baseball signal. 86.4% free lunch. Classic invisible field: infrastructure confirmed, activation is zero.',
  },

  {
    id: 'san-lorenzo',
    name: 'San Lorenzo',
    city: 'San Lorenzo',
    county: 'Alameda County',
    zipCodes: ['94580'],
    lat: 37.6811,
    lng: -122.1296,
    needScore: 2.76,
    sviScore: 0.218,
    freeLunchPct: 0.742,
    baseballFieldCount: 2,
    bgcCount: 10,
    population: 29504,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '2 fields, 10 B&GC locations, 74.2% free lunch. Org capacity present. Field conditions unverified — site visit needed before deployment.',
  },

  {
    id: 'montclair',
    name: 'Montclair / Piedmont Ave',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94611'],
    lat: 37.8328,
    lng: -122.2215,
    needScore: 2.72,
    sviScore: 0.155,
    freeLunchPct: 0.303,
    baseballFieldCount: 3,
    bgcCount: 11,
    population: 39350,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Higher-income Oakland hills ZIP (30.3% free lunch). High B&GC density (11) drives the score, not economic need. Not a deployment priority — better as an org partner to support higher-need ZIPs.',
  },

  {
    id: 'castro-sf',
    name: 'Castro / Noe Valley',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94114'],
    lat: 37.7574,
    lng: -122.4426,
    needScore: 2.66,
    sviScore: 0.087,
    freeLunchPct: 0.547,
    baseballFieldCount: 8,
    bgcCount: 8,
    population: 34976,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '8 fields, 8 B&GC locations, but very low SVI (0.087). Free lunch rate may reflect school demographics rather than community-wide poverty. Low deployment priority versus East Bay targets.',
  },

  {
    id: 'south-hayward',
    name: 'South Hayward',
    city: 'Hayward',
    county: 'Alameda County',
    zipCodes: ['94544'],
    lat: 37.6366,
    lng: -122.0624,
    needScore: 2.60,
    sviScore: 0.299,
    freeLunchPct: 0.768,
    baseballFieldCount: 0,
    bgcCount: 8,
    population: 80214,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [
      {
        id: 'sorensdale-park',
        name: 'Sorensdale Park (3 Fields)',
        lat: 37.6370,
        lng: -122.0630,
        condition: 'ready',
        conditionNotes: 'Three confirmed baseball/softball fields. Active youth use — one reviewer specifically notes their son plays baseball here. Snack bar and game days suggest possible existing org presence. Verify before treating as a gap.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
      {
        id: 'ruus-park',
        name: 'Ruus Park',
        lat: 37.6355,
        lng: -122.0615,
        condition: 'investment-needed',
        conditionNotes: 'Basic but clean. Sports fields present. Less active than Sorensdale. Backstop condition unconfirmed.',
        confirmedByOSM: false,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
    ],
    suggestedAnchor: null,
    fieldNote: 'Sorensdale Park has 3 active baseball/softball fields — one reviewer confirms youth baseball use. Snack bar and game days suggest an org may already be operating; verify before treating as a gap. 76.8% free lunch, largest ZIP by population (80k). If confirmed covered, focus on Palma Ceia Park restoration for sub-area expansion.',
  },

  {
    id: 'mission-sf',
    name: 'The Mission',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94110'],
    lat: 37.7464,
    lng: -122.4145,
    needScore: 2.50,
    sviScore: 0.166,
    freeLunchPct: 0.730,
    baseballFieldCount: 3,
    bgcCount: 9,
    population: 69299,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '3 fields, 9 B&GC locations, 73.0% free lunch, 69k residents. Predominantly Latino community with baseball tradition. No org confirmed — investigate which parks hold the fields and whether any program is already active.',
  },

  // ── TIER 3: Score 1.5–2.5 ───────────────────────────────────

  {
    id: 'western-addition',
    name: 'Western Addition / Fillmore',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94115'],
    lat: 37.7847,
    lng: -122.4393,
    needScore: 2.37,
    sviScore: 0.113,
    freeLunchPct: 0.580,
    baseballFieldCount: 5,
    bgcCount: 8,
    population: 34388,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '5 fields, 8 B&GC locations, 58.0% free lunch. Mixed-income area with pockets of need. Moderate priority.',
  },

  {
    id: 'west-portal-sf',
    name: 'West Portal / Forest Hill',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94116'],
    lat: 37.7443,
    lng: -122.4834,
    needScore: 2.34,
    sviScore: 0.162,
    freeLunchPct: 0.464,
    baseballFieldCount: 5,
    bgcCount: 6,
    population: 44210,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '5 fields, 6 B&GC locations, 46.4% free lunch. Lower priority than East Bay ZIPs at similar scores.',
  },

  {
    id: 'hayward-harder',
    name: 'South Hayward / Harder Acres',
    city: 'Hayward',
    county: 'Alameda County',
    zipCodes: ['94545'],
    lat: 37.6301,
    lng: -122.1261,
    needScore: 2.26,
    sviScore: 0.202,
    freeLunchPct: 0.685,
    baseballFieldCount: 0,
    bgcCount: 9,
    population: 33248,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'No confirmed fields, but 9 B&GC locations and 68.5% free lunch. Org capacity present — needs field identification before launch.',
  },

  {
    id: 'pleasanton',
    name: 'Pleasanton',
    city: 'Pleasanton',
    county: 'Alameda County',
    zipCodes: ['94566'],
    lat: 37.6574,
    lng: -121.8648,
    needScore: 2.22,
    sviScore: 0.225,
    freeLunchPct: 0.110,
    baseballFieldCount: 0,
    bgcCount: 8,
    population: 44530,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Affluent suburb (11.0% free lunch). Score reflects B&GC density, not need. Not an RBI deployment priority.',
  },

  {
    id: 'north-beach-sf',
    name: 'North Beach / Chinatown',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94133'],
    lat: 37.8125,
    lng: -122.4154,
    needScore: 2.22,
    sviScore: 0.167,
    freeLunchPct: 0.597,
    baseballFieldCount: 4,
    bgcCount: 6,
    population: 26369,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '4 fields, 6 B&GC locations, 59.7% free lunch. Chinatown half has real need; North Beach half is higher-income. Mixed profile — investigate field locations before committing.',
  },

  {
    id: 'maxwell-park',
    name: 'Maxwell Park / Laurel',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94602'],
    lat: 37.8065,
    lng: -122.2025,
    needScore: 2.21,
    sviScore: 0.193,
    freeLunchPct: 0.666,
    baseballFieldCount: 5,
    bgcCount: 4,
    population: 30209,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '5 fields, 66.6% free lunch. Low B&GC density (4) compared to other Oakland ZIPs. Field conditions unverified — site visit recommended.',
  },

  {
    id: 'inner-richmond-sf',
    name: 'Inner Richmond',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94121'],
    lat: 37.7828,
    lng: -122.502,
    needScore: 2.18,
    sviScore: 0.185,
    freeLunchPct: 0.402,
    baseballFieldCount: 4,
    bgcCount: 5,
    population: 42241,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '4 fields, 5 B&GC locations, 40.2% free lunch. Moderate-income SF ZIP. Lower priority relative to higher-need East Bay targets.',
  },

  {
    id: 'outer-sunset-sf',
    name: 'Outer Sunset',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94122'],
    lat: 37.7653,
    lng: -122.4766,
    needScore: 2.12,
    sviScore: 0.147,
    freeLunchPct: 0.422,
    baseballFieldCount: 3,
    bgcCount: 7,
    population: 56360,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '3 fields, 7 B&GC locations, 42.2% free lunch. Large SF ZIP with moderate need. B&GC density provides good organizational foundation.',
  },

  {
    id: 'washington-manor',
    name: 'Washington Manor',
    city: 'San Leandro',
    county: 'Alameda County',
    zipCodes: ['94579'],
    lat: 37.6867,
    lng: -122.1556,
    needScore: 2.08,
    sviScore: 0.165,
    freeLunchPct: 0.711,
    baseballFieldCount: 5,
    bgcCount: 4,
    population: 21159,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '5 fields, 71.1% free lunch, low B&GC count (4). SLLL covers neighboring 94577 — verify whether coverage extends here. Washington Manor Park field confirmed in good condition.',
  },

  {
    id: 'pleasanton-ne',
    name: 'Pleasanton (Northeast)',
    city: 'Pleasanton',
    county: 'Alameda County',
    zipCodes: ['94588'],
    lat: 37.7166,
    lng: -121.8735,
    needScore: 2.07,
    sviScore: 0.248,
    freeLunchPct: 0.094,
    baseballFieldCount: 0,
    bgcCount: 6,
    population: 37931,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Affluent Pleasanton ZIP (9.4% free lunch). Not an RBI deployment priority.',
  },

  {
    id: 'glen-park-sf',
    name: 'Glen Park / Diamond Heights',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94131'],
    lat: 37.75,
    lng: -122.4487,
    needScore: 2.05,
    sviScore: 0.133,
    freeLunchPct: 0.451,
    baseballFieldCount: 5,
    bgcCount: 5,
    population: 29545,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '5 fields and 5 B&GC locations. Moderate-income SF ZIP with 45.1% free lunch. Low SVI. Lower deployment priority.',
  },

  {
    id: 'east-san-leandro',
    name: 'East San Leandro',
    city: 'San Leandro',
    county: 'Alameda County',
    zipCodes: ['94578'],
    lat: 37.7061,
    lng: -122.1252,
    needScore: 1.98,
    sviScore: 0.312,
    freeLunchPct: 0.846,
    baseballFieldCount: 0,
    bgcCount: 3,
    population: 40801,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '84.6% free lunch and real economic need, but zero confirmed fields and only 3 B&GC locations. Thin infrastructure blocks deployment. Identify whether any recreational space exists first.',
  },

  {
    id: 'emeryville',
    name: 'Emeryville / North Oakland',
    city: 'Emeryville',
    county: 'Alameda County',
    zipCodes: ['94608'],
    lat: 37.8369,
    lng: -122.2922,
    needScore: 1.97,
    sviScore: 0.144,
    freeLunchPct: 0.810,
    baseballFieldCount: 4,
    bgcCount: 5,
    population: 33021,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '81.0% free lunch despite low SVI — economic need is higher than the score suggests. 4 fields, 5 B&GC locations. Worth investigating.',
  },

  {
    id: 'elmwood-berkeley',
    name: 'Elmwood / Rockridge',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94705'],
    lat: 37.8601,
    lng: -122.2347,
    needScore: 1.92,
    sviScore: 0.134,
    freeLunchPct: 0.288,
    baseballFieldCount: 5,
    bgcCount: 4,
    population: 12623,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Higher-income Berkeley neighborhood (28.8% free lunch, low SVI). 5 fields but does not match the underserved youth profile.',
  },

  {
    id: 'union-city',
    name: 'Union City / Alvarado',
    city: 'Union City',
    county: 'Alameda County',
    zipCodes: ['94587'],
    lat: 37.6014,
    lng: -122.0516,
    needScore: 1.90,
    sviScore: 0.185,
    freeLunchPct: 0.488,
    baseballFieldCount: 4,
    bgcCount: 3,
    population: 70034,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [
      {
        id: 'town-estates-park',
        name: 'Town Estates Park (4 Fields)',
        lat: 37.6020,
        lng: -122.0525,
        condition: 'ready',
        conditionNotes: 'Four confirmed baseball fields with active family use. "Perfect park for families. Four baseball fields, playground for kids, picnic tables with grills." No league name appears in any review despite field density.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      },
    ],
    suggestedAnchor: null,
    fieldNote: 'Town Estates Park has 4 confirmed, actively used baseball fields — no org name in any review. 48.8% free lunch, large Latino community. Verify whether a league is already operating; if not, this is a ready deployment site.',
  },

  {
    id: 'castro-valley-east',
    name: 'Castro Valley (East)',
    city: 'Castro Valley',
    county: 'Alameda County',
    zipCodes: ['94552'],
    lat: 37.6591,
    lng: -121.9769,
    needScore: 1.86,
    sviScore: 0.178,
    freeLunchPct: 0.313,
    baseballFieldCount: 3,
    bgcCount: 4,
    population: 14880,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Small-population ZIP (14,880) with 3 fields, low B&GC density. 31.3% free lunch. Lower priority for RBI deployment.',
  },

  {
    id: 'alameda-bay-farm',
    name: 'Alameda (Bay Farm Island)',
    city: 'Alameda',
    county: 'Alameda County',
    zipCodes: ['94502'],
    lat: 37.7403,
    lng: -122.2399,
    needScore: 1.76,
    sviScore: 0.186,
    freeLunchPct: 0.203,
    baseballFieldCount: 4,
    bgcCount: 2,
    population: 13948,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Newer residential area of Alameda with 4 fields but low B&GC presence (2) and 20.3% free lunch. Low economic need. Not an RBI deployment priority.',
  },

  {
    id: 'lake-merced-sf',
    name: 'Lake Merced / City College',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94132'],
    lat: 37.7224,
    lng: -122.6112,
    needScore: 1.75,
    sviScore: 0.155,
    freeLunchPct: 0.543,
    baseballFieldCount: 4,
    bgcCount: 3,
    population: 28074,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '4 fields, 54.3% free lunch. City College of SF proximity is a potential org partner.',
  },

  {
    id: 'west-berkeley',
    name: 'West Berkeley',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94702'],
    lat: 37.8636,
    lng: -122.2853,
    needScore: 1.73,
    sviScore: 0.263,
    freeLunchPct: 0.319,
    baseballFieldCount: 0,
    bgcCount: 3,
    population: 16413,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'No confirmed fields, 3 B&GC locations. Not viable without field identification.',
  },

  {
    id: 'berkeley-marina',
    name: 'Berkeley Marina / West Berkeley',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94710'],
    lat: 37.8749,
    lng: -122.3102,
    needScore: 1.73,
    sviScore: 0.180,
    freeLunchPct: 0.338,
    baseballFieldCount: 5,
    bgcCount: 1,
    population: 11208,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '5 fields but only 1 B&GC location. Small population (11k). Org capacity too thin for deployment.',
  },

  {
    id: 'temescal',
    name: 'Temescal / North Oakland',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94609'],
    lat: 37.8342,
    lng: -122.2648,
    needScore: 1.68,
    sviScore: 0.170,
    freeLunchPct: 0.602,
    baseballFieldCount: 3,
    bgcCount: 3,
    population: 25479,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '3 fields, 60.2% free lunch, moderate-need North Oakland ZIP. B&GC count is low (3). Bushrod Park in this area is home to North Oakland Little League (NOLL) — verify coverage before treating as a gap.',
  },

  {
    id: 'central-berkeley',
    name: 'Central Berkeley',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94703'],
    lat: 37.864,
    lng: -122.2746,
    needScore: 1.66,
    sviScore: 0.166,
    freeLunchPct: 0.321,
    baseballFieldCount: 4,
    bgcCount: 2,
    population: 21482,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '4 fields, low B&GC density (2), 32.1% free lunch. Mixed-income Berkeley neighborhood. Lower priority for RBI deployment.',
  },

  {
    id: 'richmond-district-sf',
    name: 'Richmond District',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94118'],
    lat: 37.7762,
    lng: -122.4651,
    needScore: 1.65,
    sviScore: 0.136,
    freeLunchPct: 0.387,
    baseballFieldCount: 3,
    bgcCount: 4,
    population: 40753,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '3 fields, 4 B&GC locations, 38.7% free lunch. Moderate-income SF inner neighborhood. Lower deployment priority.',
  },

  {
    id: 'marina-sf',
    name: 'Marina / Cow Hollow',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94123'],
    lat: 37.8054,
    lng: -122.4377,
    needScore: 1.58,
    sviScore: 0.095,
    freeLunchPct: 0.391,
    baseballFieldCount: 4,
    bgcCount: 4,
    population: 28442,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '4 fields, 4 B&GC locations, very low SVI (0.095), 39.1% free lunch. High-income SF neighborhood. Not an RBI deployment priority.',
  },

  {
    id: 'rockridge',
    name: 'Rockridge',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94618'],
    lat: 37.8452,
    lng: -122.2333,
    needScore: 1.46,
    sviScore: 0.153,
    freeLunchPct: 0.426,
    baseballFieldCount: 1,
    bgcCount: 4,
    population: 17004,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Higher-income Oakland neighborhood. 1 field, 4 B&GC locations, 42.6% free lunch. Low SVI. Not an RBI deployment priority.',
  },

  {
    id: 'west-portal-st-francis',
    name: 'West Portal / St. Francis Wood',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94127'],
    lat: 37.735,
    lng: -122.456,
    needScore: 1.44,
    sviScore: 0.148,
    freeLunchPct: 0.416,
    baseballFieldCount: 1,
    bgcCount: 4,
    population: 18546,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Moderate-income SF ZIP with limited infrastructure. 41.6% free lunch. Lower priority.',
  },

  {
    id: 'hayward-highlands',
    name: 'Hayward Highlands',
    city: 'Hayward',
    county: 'Alameda County',
    zipCodes: ['94542'],
    lat: 37.6579,
    lng: -122.0332,
    needScore: 1.37,
    sviScore: 0.163,
    freeLunchPct: 0.461,
    baseballFieldCount: 2,
    bgcCount: 2,
    population: 15507,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Small-population Hayward hillside ZIP. 2 fields, thin B&GC presence, 46.1% free lunch. Not a priority deployment site.',
  },

  {
    id: 'grand-lake',
    name: 'Grand Lake / Lakeshore',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94610'],
    lat: 37.8131,
    lng: -122.2391,
    needScore: 1.32,
    sviScore: 0.153,
    freeLunchPct: 0.655,
    baseballFieldCount: 0,
    bgcCount: 4,
    population: 29677,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '65.5% free lunch but zero confirmed baseball fields and low B&GC count (4). Economic need is real but infrastructure is absent. Identify available field space before considering deployment.',
  },

  // ── TIER 4: Score < 1.5 ─────────────────────────────────────

  {
    id: 'soma-sf',
    name: 'SoMa',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94103'],
    lat: 37.7742,
    lng: -122.4094,
    needScore: 1.24,
    sviScore: 0.136,
    freeLunchPct: 0.779,
    baseballFieldCount: 2,
    bgcCount: 2,
    population: 41329,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '77.9% free lunch reflects significant economic need in the SoMa corridor, but only 2 fields and 2 B&GC locations limit deployment viability. Infrastructure gap outweighs economic need signal.',
  },

  {
    id: 'civic-center-sf',
    name: 'Civic Center / Tenderloin',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94102'],
    lat: 37.7797,
    lng: -122.419,
    needScore: 1.23,
    sviScore: 0.162,
    freeLunchPct: 0.741,
    baseballFieldCount: 2,
    bgcCount: 1,
    population: 43458,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Very high economic need (74.1% free lunch) but minimal infrastructure (2 fields, 1 B&GC). High density, urban core. Not suitable for traditional baseball program deployment without significant capital investment in field development.',
  },

  {
    id: 'dogpatch-sf',
    name: 'Dogpatch / Potrero Hill',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94107'],
    lat: 37.7657,
    lng: -122.3929,
    needScore: 1.17,
    sviScore: 0.095,
    freeLunchPct: 0.346,
    baseballFieldCount: 1,
    bgcCount: 4,
    population: 36015,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Low SVI, 34.6% free lunch, 1 field. Not an RBI deployment priority.',
  },

  {
    id: 'chinatown-sf',
    name: 'Chinatown / Union Square',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94108'],
    lat: 37.7916,
    lng: -122.4078,
    needScore: 1.14,
    sviScore: 0.173,
    freeLunchPct: 0.843,
    baseballFieldCount: 0,
    bgcCount: 2,
    population: 13707,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '84.3% free lunch in a dense urban core with zero confirmed baseball fields. High economic need but no viable field infrastructure for deployment.',
  },

  {
    id: 'uptown-oakland',
    name: 'Uptown Oakland / Downtown',
    city: 'Oakland',
    county: 'Alameda County',
    zipCodes: ['94612'],
    lat: 37.8103,
    lng: -122.2652,
    needScore: 1.08,
    sviScore: 0.133,
    freeLunchPct: 0.648,
    baseballFieldCount: 0,
    bgcCount: 3,
    population: 23807,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: '64.8% free lunch in a dense urban Oakland ZIP with zero confirmed fields. Economic need is real but field infrastructure is absent. Not a viable deployment site.',
  },

  {
    id: 'haight-sf',
    name: 'Haight-Ashbury',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94117'],
    lat: 37.7672,
    lng: -122.4447,
    needScore: 0.99,
    sviScore: 0.087,
    freeLunchPct: 0.371,
    baseballFieldCount: 0,
    bgcCount: 4,
    population: 40929,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Low SVI, 37.1% free lunch, no confirmed fields. Not an RBI deployment priority.',
  },

  {
    id: 'south-berkeley',
    name: 'South Berkeley / Southside',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94704'],
    lat: 37.8675,
    lng: -122.2534,
    needScore: 0.86,
    sviScore: 0.089,
    freeLunchPct: 0.291,
    baseballFieldCount: 1,
    bgcCount: 2,
    population: 31404,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'UC Berkeley adjacent. Very low SVI, low free lunch. Not an RBI deployment priority.',
  },

  {
    id: 'north-berkeley',
    name: 'North Berkeley',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94707'],
    lat: 37.8991,
    lng: -122.2766,
    needScore: 0.83,
    sviScore: 0.138,
    freeLunchPct: 0.279,
    baseballFieldCount: 0,
    bgcCount: 1,
    population: 12307,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Affluent North Berkeley. No fields, 1 B&GC location, 27.9% free lunch. Not an RBI deployment priority.',
  },

  {
    id: 'financial-district-sf',
    name: 'Financial District / Embarcadero',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94111'],
    lat: 37.7965,
    lng: -122.3951,
    needScore: 0.80,
    sviScore: 0.132,
    freeLunchPct: 0.826,
    baseballFieldCount: 0,
    bgcCount: 1,
    population: 5462,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Primarily commercial ZIP. Very small residential population (5,462). 82.6% free lunch may reflect transient population or shelter residents. No viable baseball infrastructure.',
  },

  {
    id: 'nob-hill-sf',
    name: 'Nob Hill / Polk Gulch',
    city: 'San Francisco',
    county: 'San Francisco County',
    zipCodes: ['94109'],
    lat: 37.7991,
    lng: -122.4211,
    needScore: 0.80,
    sviScore: 0.076,
    freeLunchPct: 0.671,
    baseballFieldCount: 0,
    bgcCount: 3,
    population: 56431,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Dense SF neighborhood with zero fields and very low SVI (0.076). Not viable for deployment.',
  },

  {
    id: 'berkeley-hills',
    name: 'Berkeley Hills',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94708'],
    lat: 37.9003,
    lng: -122.2603,
    needScore: 0.74,
    sviScore: 0.121,
    freeLunchPct: 0.286,
    baseballFieldCount: 0,
    bgcCount: 1,
    population: 11393,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: false,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Affluent hillside ZIP. No fields, minimal B&GC presence. Not an RBI deployment priority.',
  },

  {
    id: 'north-berkeley-east',
    name: 'North Berkeley (Ohlone Way)',
    city: 'Berkeley',
    county: 'Alameda County',
    zipCodes: ['94709'],
    lat: 37.8796,
    lng: -122.2665,
    needScore: 0.71,
    sviScore: 0.087,
    freeLunchPct: 0.292,
    baseballFieldCount: 1,
    bgcCount: 1,
    population: 12218,
    strongInfrastructure: false,
    strongOrg: false,
    milestoNearestAffiliate: null,
    nearestAffiliateName: null,
    hasConfirmedField: true,
    gapStatus: 'gap',
    fields: [],
    suggestedAnchor: null,
    fieldNote: 'Lowest-scoring ZIP in the dataset. Affluent North Berkeley residential. 1 field, 1 B&GC. Not an RBI deployment priority.',
  },
];

// ── PROGRAMS (Families View) ───────────────────────────────────

export const programs: Program[] = [
  {
    id: 'giants-community-fund-rbi',
    name: 'Giants Community Fund RBI',
    orgType: 'rbi',
    lat: 37.7786,
    lng: -122.3897,
    city: 'San Francisco',
    address: '24 Willie Mays Plaza, San Francisco, CA 94107',
    ageMin: 5,
    ageMax: 18,
    cost: 'free',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(415) 972-2000',
    website: 'https://www.giantscommunity.com',
    status: 'confirmed-active',
    coverageRadiusMiles: 2,
    description: 'The Giants Community Fund RBI program is headquartered at Oracle Park, home of the San Francisco Giants. This program provides youth baseball and softball opportunities across the Bay Area, with a focus on underserved communities.',
    notes: 'Located at Oracle Park — the official headquarters for the Giants Community Fund.',
    descriptionIsPlaceholder: true,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'oakland-babe-ruth-rbi',
    name: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    orgType: 'rbi',
    lat: 37.7620,
    lng: -122.1937,
    city: 'Oakland',
    address: '1390 66th Avenue, Oakland, CA 94621',
    ageMin: 4,
    ageMax: 18,
    cost: 'free',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    website: 'https://mlb.com/rbi',
    status: 'confirmed-active',
    coverageRadiusMiles: 2,
    description: 'Oakland Babe Ruth/Cal Ripken Nike RBI operates out of Carter-Gilmore/Greenman Field in East Oakland. This program serves youth ages 4–18 with a focus on providing baseball access to underserved Oakland communities.',
    notes: 'Home field: Carter-Gilmore/Greenman Field at 1390 66th Avenue, Oakland, CA 94621. Mailing: PO Box 27549, Oakland, CA 94602.',
    descriptionIsPlaceholder: true,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'bay-area-ballplayers',
    name: 'Bay Area Ballplayers',
    orgType: 'nonprofit',
    lat: 37.8352,
    lng: -122.1265,
    city: 'Moraga',
    address: '1460 Moraga Road, Suite H, Moraga, CA 94556',
    ageMin: 6,
    ageMax: 18,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Year-round',
    registrationOpen: true,
    registrationWindow: 'Rolling enrollment — contact for details',
    phone: '(925) 247-5164',
    website: 'https://www.bayareaballplayers.com',
    status: 'confirmed-active',
    coverageRadiusMiles: 6,
    description: 'Bay Area Ballplayers is a nonprofit based in Moraga providing year-round baseball and softball training, development, and league play for youth across the East Bay. Programs emphasize skill development and community.',
    notes: 'Located in Moraga, serving youth across Contra Costa and Alameda Counties.',
    descriptionIsPlaceholder: true,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'loyal-to-my-soil',
    name: 'Loyal To My Soil',
    orgType: 'nonprofit',
    lat: 37.8050,
    lng: -121.9700,
    city: 'Danville',
    address: '150 Oakgate Drive, Danville, CA 94506',
    ageMin: 5,
    ageMax: 18,
    cost: 'free',
    equipmentProvided: true,
    season: 'Year-round',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    website: 'https://loyaltomysoil.org',
    status: 'confirmed-active',
    coverageRadiusMiles: 8,
    description: 'Loyal To My Soil is a community-based organization in Danville dedicated to providing youth baseball access and mentorship. The program serves youth across the Tri-Valley area with a focus on character development through sport.',
    notes: 'Serving the Tri-Valley area including Danville, San Ramon, and surrounding communities.',
    descriptionIsPlaceholder: true,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'bushrod-park-little-league',
    name: 'Bushrod Park Little League (NOLL/SOLL)',
    orgType: 'little-league',
    lat: 37.844527,
    lng: -122.265089,
    city: 'Oakland',
    address: '560 59th St, Oakland, CA 94609',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 238-7275',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Bushrod Park is home to the North Oakland Little League (NOLL) and South Oakland Little League (SOLL), providing organized youth baseball in the heart of North Oakland. The park features dedicated baseball fields actively used for league play and youth development.',
    notes: 'Known NOLL/SOLL Little League home field. Already organized and actively served.',
    descriptionIsPlaceholder: true,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'east-bay-ball-summer-camp',
    name: 'East Bay BALL Summer Camp',
    orgType: 'parks-rec',
    lat: 37.8418,
    lng: -122.2329,
    city: 'Oakland',
    address: '6686 Chabot Rd, Oakland, CA 94618',
    ageMin: 6,
    ageMax: 12,
    cost: 'paid',
    equipmentProvided: true,
    season: 'Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 519-4665',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'East Bay BALL Summer Camp runs out of Chabot Elementary School in the Rockridge area of Oakland. The camp serves youth ages 6–12 with a focus on improving baseball skills and increasing enjoyment of the game. Monday–Friday, 9am–4pm per session.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'future-star-baseball',
    name: 'Future Star Baseball',
    orgType: 'parks-rec',
    lat: 37.7903,
    lng: -122.1681,
    city: 'Oakland',
    address: '12000 Campus Dr, Oakland, CA 94619',
    ageMin: 6,
    ageMax: 18,
    cost: 'paid',
    equipmentProvided: true,
    season: 'Year-round',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 710-0987',
    website: 'https://futurestarbaseball.com',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Future Star Baseball is a training academy in the Oakland hills offering after-school baseball classes, private lessons, and batting cage sessions for youth ages 6–18. Located at 12000 Campus Drive, open weekdays 3:30–9:30pm and weekends 9am–5pm.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'albany-little-league',
    name: 'Albany Little League',
    orgType: 'little-league',
    lat: 37.8877,
    lng: -122.2981,
    city: 'Albany',
    address: '900 Buchanan St, Albany, CA 94706',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 981-5161',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Albany Little League serves families across Albany and surrounding areas with spring and summer league play at Ocean View Field on Buchanan Street. A community-run Little League chartered program with divisions for all ages.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'lil-rugrats-baseball',
    name: 'LilRugrats Baseball',
    orgType: 'nonprofit',
    lat: 37.8636,
    lng: -122.2853,
    city: 'Berkeley',
    address: 'West Berkeley, CA 94702',
    ageMin: 3,
    ageMax: 6,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Year-round',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 705-2865',
    status: 'listed',
    coverageRadiusMiles: 2,
    description: 'LilRugrats Baseball is a nonprofit youth baseball organization in West Berkeley serving young children with introductory baseball programming. Focused on the youngest age groups (3–6) in the 94702 ZIP code.',
    descriptionIsPlaceholder: true,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'james-kenney-community-center',
    name: 'James Kenney Community Center',
    orgType: 'parks-rec',
    lat: 37.8672,
    lng: -122.2966,
    city: 'Berkeley',
    address: '1720 8th St, Berkeley, CA 94710',
    ageMin: 5,
    ageMax: 16,
    cost: 'free',
    equipmentProvided: false,
    season: 'Year-round',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 981-6650',
    status: 'confirmed-active',
    coverageRadiusMiles: 2,
    description: 'James Kenney Community Center is a City of Berkeley recreation facility at 1720 8th Street in West Berkeley. The park includes a softball field, outdoor basketball courts, and active youth programming run through the Berkeley Parks & Recreation department.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'mt-eden-little-league',
    name: 'Mt. Eden Little League',
    orgType: 'little-league',
    lat: 37.6308,
    lng: -122.1073,
    city: 'Hayward',
    address: '2121 Depot Rd, Hayward, CA 94545',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 783-2211',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Mt. Eden Little League is a chartered Little League program serving the southern Hayward community from its home fields on Depot Road. The league serves youth ages 4–16 with spring and summer season play.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'tennyson-american-little-league',
    name: 'Tennyson American Little League',
    orgType: 'little-league',
    lat: 37.6366,
    lng: -122.0608,
    city: 'Hayward',
    address: '26691 Jane Ave, Hayward, CA 94544',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 881-5584',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Tennyson American Little League operates out of Sorensdale Park on Jane Avenue in South Hayward, serving youth ages 4–16. The league uses Sorensdale Park\'s baseball and softball fields for spring and summer season play.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'san-leandro-little-league',
    name: 'San Leandro Little League',
    orgType: 'little-league',
    lat: 37.7098,
    lng: -122.1654,
    city: 'San Leandro',
    address: 'Teagarden St & Aladdin Ave, San Leandro, CA 94577',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 577-3462',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'San Leandro Little League plays at San Leandro Ball Park at Teagarden Street and Aladdin Avenue — a pro-sized lighted facility with grandstands and restrooms. A well-established program serving the 94577 ZIP with spring and summer league play.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'floresta-baseball-league',
    name: 'Floresta Baseball League',
    orgType: 'little-league',
    lat: 37.6889,
    lng: -122.1591,
    city: 'San Leandro',
    address: 'Washington Manor Park, San Leandro, CA 94579',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    phone: '(510) 352-7281',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Floresta Baseball League is a community baseball league serving the Washington Manor area of San Leandro (94579). The league uses Washington Manor Park and nearby San Leandro school fields for spring and summer season play for youth ages 4–16.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'san-lorenzo-little-league',
    name: 'San Lorenzo Little League',
    orgType: 'little-league',
    lat: 37.6821,
    lng: -122.1253,
    city: 'San Lorenzo',
    address: '1062 Grant Ave, San Lorenzo, CA 94580',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'San Lorenzo Little League operates a five-field complex at Mervin Morris Park on Grant Avenue, at the heart of San Lorenzo Village. The league serves youth ages 4–16 from San Lorenzo, San Leandro, and Ashland communities.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'fremont-centerville-little-league',
    name: 'Fremont Centerville Little League',
    orgType: 'little-league',
    lat: 37.5576,
    lng: -121.9924,
    city: 'Fremont',
    address: '40432 Torenia Cir, Fremont, CA 94538',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Fremont Centerville Little League is a nationally sanctioned Little League program serving over 500 families in central and north Fremont and Newark. Based in the Centerville neighborhood (94538), the league fields teams across all Little League age divisions.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
  {
    id: 'warm-springs-little-league',
    name: 'Warm Springs Little League',
    orgType: 'little-league',
    lat: 37.5061,
    lng: -121.9255,
    city: 'Fremont',
    address: '47370 Warm Springs Blvd, Fremont, CA 94539',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer',
    registrationOpen: true,
    registrationWindow: 'Contact for current registration details',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Warm Springs Little League is a 501(c)(3) nonprofit serving the Warm Springs district of Fremont since 1990. Fields and a clubhouse are located at Warm Springs Elementary School on Warm Springs Boulevard, with additional Juniors fields at Warm Springs Community Park.',
    descriptionIsPlaceholder: false,
    registrationWindowIsPlaceholder: true,
  },
];

// ── ORGANIZATIONAL COVERAGE SCORING ────────────────────────────
// FORMULA (with org presence):
//   Base Score = (SVI × 0.50) + (BaseballFields/18 × 0.25) + (B&GC/18 × 0.25) × 10
//   Adjusted Score = Base Score - Org Coverage Reduction
//
// Org Types (from best to least impactful):
//   - RBI: 2.0 weight (ideal, free, comprehensive)
//   - Little League: 1.5 weight (traditional, structured)
//   - Parks & Rec: 0.8 weight (limited focus on baseball)
//   - Nonprofit: 0.6 weight (variable coverage)
//
// Cost Multipliers:
//   - Free: 1.0 (full reduction impact)
//   - Low-cost: 0.8 (80% reduction impact)
//   - Paid: 0.5 (50% reduction impact)
//
// Distance Decay: Programs closer to neighborhood have more impact (0.5 to 1.0 multiplier).
// Cap: Total org reduction capped at 1.5 points max. Areas with no orgs keep full score.

export interface OrgCoverage {
  programId: string;
  programName: string;
  orgType: Program['orgType'];
  cost: Program['cost'];
  distanceMiles: number;
  coverageImpact: number;
}

export interface AdjustedNeighborhood extends Neighborhood {
  adjustedNeedScore: number;
  orgCoverageReduction: number;
  nearbyPrograms: OrgCoverage[];
}

/**
 * Haversine distance calculator (miles between two lat/lng points)
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth radius in miles
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find programs serving a neighborhood within max distance.
 * Returns ordered list of org coverage impacts.
 */
export function findNearbyPrograms(
  neighborhood: Neighborhood,
  programs: Program[],
  maxDistanceMiles: number = 5
): OrgCoverage[] {
  const orgTypeWeights: Record<Program['orgType'], number> = {
    rbi: 2.0,
    'little-league': 1.5,
    'parks-rec': 0.8,
    nonprofit: 0.6,
  };

  const costMultipliers: Record<Program['cost'], number> = {
    free: 1.0,
    'low-cost': 0.8,
    paid: 0.5,
  };

  return programs
    .map((program) => {
      const distance = haversineDistance(
        neighborhood.lat,
        neighborhood.lng,
        program.lat,
        program.lng
      );

      if (distance > maxDistanceMiles) return null;

      // Distance decay: closer programs have more impact (0.5 to 1.0 multiplier)
      const distanceFactor = Math.max(0.5, 1 - distance / maxDistanceMiles);

      const coverageImpact =
        orgTypeWeights[program.orgType] * costMultipliers[program.cost] * distanceFactor;

      return {
        programId: program.id,
        programName: program.name,
        orgType: program.orgType,
        cost: program.cost,
        distanceMiles: parseFloat(distance.toFixed(2)),
        coverageImpact: parseFloat(coverageImpact.toFixed(3)),
      };
    })
    .filter((coverage): coverage is OrgCoverage => coverage !== null)
    .sort((a, b) => b.coverageImpact - a.coverageImpact);
}

/**
 * Calculate total org coverage reduction for a neighborhood.
 * Capped at 1.5 points max to preserve meaningful score differentiation.
 * Areas with no nearby orgs keep their full base score.
 */
export function calculateOrgCoverageReduction(
  neighborhood: Neighborhood,
  programs: Program[]
): number {
  const coverages = findNearbyPrograms(neighborhood, programs);
  const totalImpact = coverages.reduce((sum, cov) => sum + cov.coverageImpact, 0);
  return Math.min(1.5, totalImpact);
}

/**
 * Calculate adjusted need score with org coverage factored in.
 * Uses original weights (SVI 50%, Fields 25%, B&GC 25%) for base score,
 * then subtracts org coverage reduction (0–1.5 points).
 */
export function calculateAdjustedNeedScore(
  sviScore: number,
  baseballFieldCount: number,
  bgcCount: number,
  orgCoverageReduction: number
): number {
  const sviComponent = sviScore * 0.5;
  const fieldComponent = (baseballFieldCount / 18) * 0.25;
  const bgcComponent = (bgcCount / 18) * 0.25;

  const baseScore = (sviComponent + fieldComponent + bgcComponent) * 10;
  const adjustedScore = baseScore - orgCoverageReduction;

  return Math.max(0, adjustedScore);
}

/**
 * Get an enhanced neighborhood view with adjusted scores and org coverage.
 * Pass all neighborhoods and all programs to calculate coverage for each.
 */
export function getAdjustedNeighborhood(
  neighborhood: Neighborhood,
  programs: Program[]
): AdjustedNeighborhood {
  const nearbyPrograms = findNearbyPrograms(neighborhood, programs);
  const orgCoverageReduction = calculateOrgCoverageReduction(neighborhood, programs);
  const adjustedNeedScore = calculateAdjustedNeedScore(
    neighborhood.sviScore,
    neighborhood.baseballFieldCount,
    neighborhood.bgcCount,
    orgCoverageReduction
  );

  return {
    ...neighborhood,
    strongOrg: nearbyPrograms.length > 0,
    adjustedNeedScore,
    orgCoverageReduction,
    nearbyPrograms,
  };
}

/**
 * Get all neighborhoods with adjusted scores.
 */
export function getAllAdjustedNeighborhoods(programs: Program[]): AdjustedNeighborhood[] {
  return neighborhoods.map((n) => getAdjustedNeighborhood(n, programs));
}

// ── HELPER FUNCTIONS ───────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 7.0) return '#0D2B18';
  if (score >= 5.5) return '#0F3020';
  if (score >= 4.0) return '#123525';
  if (score >= 2.5) return '#163A2A';
  return '#1A4A2E';
}

export function getScoreOpacity(score: number): number {
  if (score >= 7.0) return 0.82;
  if (score >= 5.5) return 0.65;
  if (score >= 4.0) return 0.48;
  if (score >= 2.5) return 0.32;
  return 0.18;
}

export function formatIncome(income: number): string {
  return '$' + income.toLocaleString();
}

export function getProgramTypeLabel(type: Program['orgType']): string {
  const labels: Record<Program['orgType'], string> = {
    'rbi': 'RBI Affiliate',
    'little-league': 'Little League',
    'parks-rec': 'Parks & Rec',
    'nonprofit': 'Nonprofit',
  };
  return labels[type];
}

export function getCostLabel(cost: Program['cost']): string {
  const labels: Record<Program['cost'], string> = {
    'free': 'Free',
    'low-cost': 'Low-cost',
    'paid': 'Paid',
  };
  return labels[cost];
}

export function getConditionLabel(condition: Field['condition']): string {
  const labels: Record<Field['condition'], string> = {
    'ready': 'Ready to Deploy',
    'investment-needed': 'Investment Needed',
    'gap': 'No Field Confirmed',
  };
  return labels[condition];
}

export function findNeighborhoodMatches(query: string, limit = 5): Neighborhood[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const numericQuery = q.replace(/\D/g, '');
  const scored = neighborhoods
    .map((n) => {
      const name = n.name.toLowerCase();
      const city = n.city.toLowerCase();
      const exactZip = numericQuery.length === 5 && n.zipCodes.includes(numericQuery);
      const partialZip = numericQuery.length >= 2 && n.zipCodes.some((zip) => zip.startsWith(numericQuery));
      const nameStarts = name.startsWith(q);
      const nameIncludes = name.includes(q);
      const cityStarts = city.startsWith(q);
      const cityIncludes = city.includes(q);

      if (exactZip) return { neighborhood: n, score: 100 };
      if (nameStarts) return { neighborhood: n, score: 90 };
      if (partialZip) return { neighborhood: n, score: 80 };
      if (cityStarts) return { neighborhood: n, score: 70 };
      if (nameIncludes) return { neighborhood: n, score: 60 };
      if (cityIncludes) return { neighborhood: n, score: 50 };
      return null;
    })
    .filter((match): match is { neighborhood: Neighborhood; score: number } => match !== null)
    .sort((a, b) => b.score - a.score || b.neighborhood.needScore - a.neighborhood.needScore);

  return scored.slice(0, limit).map((match) => match.neighborhood);
}

export function findBestNeighborhoodMatch(query: string): Neighborhood | null {
  return findNeighborhoodMatches(query, 1)[0] ?? null;
}

// Sort neighborhoods by need score descending
export const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b.needScore - a.needScore);
