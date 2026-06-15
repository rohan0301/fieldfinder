// FIELDFINDER — Alameda + San Francisco County Data
// ORIGINAL RBI Readiness scores (stored in needScore):
//   Score = (SVI × 0.5) + (BaseballFields/18 × 0.25) + (B&GC/18 × 0.25) × 10
//
// NEW ADJUSTED SCORING (use getAdjustedNeighborhood or getAllAdjustedNeighborhoods):
//   Base Score = (SVI × 0.40) + (BaseballFields/18 × 0.20) + (B&GC/18 × 0.20) × 10
//   Adjusted Score = Base Score - Org Coverage Reduction (0–3 points)
//   → Org presence lowers area's need score (better coverage = lower need)
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
    fieldNote: 'The highest-scoring ZIP in the dataset (6.70/10), driven by the strongest SVI score (0.645), second-highest baseball field count (11), and high B&GC density (14 locations). McConnell Field and Rickey Henderson Field are confirmed, playable diamonds. The primary barrier is not infrastructure — it is environment: community reviews consistently flag adult loitering and a perceived safety risk that discourages families from bringing children. At 93.6% free lunch participation, this is one of the highest-need economic corridors in the dataset. Any program deployment here should be paired with active community-safety partnerships. Infrastructure is present and waiting; the environment needs investment alongside equipment.',
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
    fieldNote: 'Second-highest scoring ZIP despite a moderate SVI (0.268), propelled by the second-highest baseball field count in the dataset (12 fields) and 14 B&GC locations — matching 94621 for organizational density. At 38.9% free lunch, Alameda has lower economic distress than the Oakland ZIPs at the top of this list, but the combination of infrastructure depth and B&GC capacity makes it a high-efficiency deployment candidate. The island geography is a program retention asset: youth are concentrated within defined boundaries, reducing travel barriers and improving participation consistency. No strong org or infrastructure signal from the Excel data suggests existing programs may not be youth-baseball-specific.',
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
    fieldNote: 'Fruitvale carries the highest B&GC count in the entire dataset (18 locations) — an extraordinary organizational infrastructure for any program launch. At 87.1% free lunch and SVI of 0.460, this is a confirmed high-need corridor. The critical open question: despite being flagged as having 1 baseball field, across 221 community reviews of Brookdale Park, zero reviews mention baseball. Soccer is culturally dominant in Fruitvale\'s predominantly Latino community. Before treating this as a baseball gap, verify physically whether a diamond exists and assess community interest. If a field can be confirmed and community appetite gauged, the B&GC depth here makes this one of the most organizationally capable ZIPs in the dataset for a fast launch.',
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
    fieldNote: 'The highest baseball field count in the entire dataset (18 confirmed fields) — more baseball infrastructure than any other ZIP. This is one of SF\'s largest and most densely populated ZIPs (78,961 residents). At 62.1% free lunch, the Excelsior and Outer Mission are working-class, predominantly Latino families — economically constrained but not at the distress levels of East Oakland. The SVI of 0.199 reflects relative stability, but free lunch data tells a more nuanced story. Zero strong org or infrastructure flag in the Excel data suggests existing league presence is absent or weak despite the field count. This is the most infrastructure-rich SF ZIP in the dataset — a program could activate multiple diamonds without any capital investment.',
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
    fieldNote: 'One of San Francisco\'s most historically underserved communities, with 9 confirmed baseball fields, strong infrastructure (flagged True), and confirmed organizational presence (flagged True). At 84.3% free lunch and SVI of 0.433, Bayview-HP is one of the highest-need ZIPs in the SF portion of the dataset. The strong org flag suggests existing youth programs are operating. The key strategic question is whether current coverage has gaps in age range, season, or geographic reach within the ZIP. If the existing org is not specifically baseball-focused or does not serve the full age range, this ZIP is a high-priority expansion candidate rather than a greenfield deployment.',
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
    fieldNote: 'The highest single-ZIP free-lunch rate in the entire dataset at 95.4% — a signal of deeply concentrated economic need. Sobrante Park has a confirmed baseball diamond (backstop intact, infield needs grading), but bathrooms have been permanently closed, signaling chronic underfunding by the city. The Ira Jinkins Community Center, 0.8 miles away, is the primary organizational anchor: it has existing youth engagement, a rec director who is known to the community, and a gym. Strong org is flagged True in the data, reflecting the Ira Jinkins presence — but no baseball-specific program has been identified. With 11 B&GC locations and strong community organizational depth, this ZIP has the infrastructure and org foundation for a program launch; it needs capital investment in the diamond and an affiliated org to activate it.',
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
    fieldNote: 'The highest baseball field count of any SF ZIP in the dataset (16 confirmed fields) with zero organizational presence flagged. At 73.5% free lunch, Visitacion Valley is one of SF\'s higher-need neighborhoods, home to large Filipino, Latino, and Black populations. The combination of 16 ready-to-use fields and no org signal is the clearest infrastructure-without-activation pattern in the SF dataset. A program here would not need to invest in fields — it would simply need to show up. The moderate SVI (0.221) reflects relative physical safety but underweights the community\'s economic vulnerability captured better by the free lunch rate.',
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
    fieldNote: 'Arroyo Viejo Recreation Center is already running after-school and summer youth programs — active, staffed, and community-embedded. No baseball org or diamond is confirmed, but the rec center\'s organizational infrastructure is ready to support a program without building from scratch. Community reviews split sharply by time of day: mornings and afternoons are family-oriented and active; evenings attract adults and the environment shifts. A structured afternoon baseball program would fit the existing use pattern. At 83.0% free lunch and 14 B&GC locations, this ZIP has both need and organizational depth. The primary barrier to deployment is finding or confirming a diamond surface — the org structure already exists.',
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
    fieldNote: 'The strongest deployment candidate in Hayward and one of the most actionable ZIPs in the full dataset. Centennial Park has two confirmed baseball diamonds actively used by families. Cannery Park has a field with bleachers and functioning restrooms. Bret Harte Park runs softball. Across all three parks, zero organizational presence appears in any community review — families are self-organizing play without a league structure. At 79.3% free lunch with a high Latino and Black population, this ZIP has both the need and the infrastructure. It requires only an organization to activate it. No capital investment in fields is needed; this is a program-launch opportunity, not an infrastructure project.',
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
    fieldNote: 'Moderate-need suburban ZIP with solid baseball infrastructure (5 confirmed fields) and B&GC density (9 locations). At 40.0% free lunch, Castro Valley sits in the mid-tier economically — lower need than Oakland and Hayward ZIPs but with meaningful infrastructure and organizational capacity. The absence of strong infrastructure or org flags in the Excel data suggests field conditions and org presence require verification before committing to deployment. Most productive as a secondary target after higher-need urban ZIPs are addressed.',
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
    fieldNote: 'San Leandro Little League (SLLL) is confirmed active at San Leandro Ball Park, with lights for night games and multigenerational participation documented in reviews ("my grandson still plays here"). This ZIP appears partially covered by existing league activity. With 7 baseball fields and 8 B&GC locations, there is infrastructure depth beyond the SLLL footprint. At 73.9% free lunch, economic need is real. The strategic question here is geographic coverage within the ZIP: does SLLL reach the lower-income pockets or concentrate on more established families? A supplemental RBI program targeting the underserved sub-areas could coexist with existing league activity.',
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
    fieldNote: 'Dublin\'s high score is driven primarily by exceptional B&GC density (12 locations — third-highest in the dataset) rather than economic need: at 14.9% free lunch, this is one of the more affluent ZIPs in the dataset. No confirmed baseball fields are logged. The B&GC infrastructure suggests strong organized youth activity, but the economic profile does not match the primary RBI target demographic of underserved youth. Dublin may be better positioned as a program delivery partner (using its organizational capacity to serve youth bused in from higher-need neighboring ZIPs) rather than a primary deployment site.',
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
    fieldNote: 'Mid-range Oakland ZIP with 3 confirmed fields, 8 B&GC locations, and 63.1% free lunch. SVI is moderate (0.270). The absence of strong org or infrastructure flags suggests existing programs have not activated these fields for youth baseball. Moderate-priority deployment candidate — higher need than the suburban East Bay ZIPs but lower urgency than the Oakland ZIPs at the top of the list.',
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
    fieldNote: 'Garfield Park has a confirmed baseball diamond that appears in zero Google reviews — no ratings, no operating hours, no organizational presence, no community footprint whatsoever. San Antonio Park is the most active community space in the ZIP, with daily soccer, basketball, and boxing activity — but zero baseball signal across all reviews. At 86.4% free lunch, this is a high-need ZIP that is either unaware of its baseball infrastructure or has given up on it. The San Antonio Recreation Center is an established community anchor with consistent staff and programming. This is one of the clearest "invisible field" cases in the dataset — confirmed infrastructure with zero activation.',
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
    fieldNote: 'Unincorporated Alameda County community with 2 confirmed fields, high B&GC density (10 locations), and 74.2% free lunch. Moderate SVI (0.218). B&GC presence suggests organizational capacity is available. Field conditions unverified — on-site assessment recommended before deployment.',
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
    fieldNote: 'Higher-income Oakland hills ZIP (30.3% free lunch, low SVI). B&GC density is high (11 locations), suggesting strong organizational infrastructure. Score is driven primarily by B&GC count rather than economic need. Lower-priority for RBI deployment focused on underserved youth; more useful as a potential B&GC partner that could send staff or support to higher-need ZIPs nearby.',
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
    fieldNote: 'High field count (8) and B&GC density (8) in an otherwise low-vulnerability SF ZIP (SVI 0.087). The 54.7% free lunch rate may reflect the mix of school populations across the ZIP rather than community-wide poverty. Lower RBI deployment priority given the very low SVI — economic indicators do not support urgent intervention here relative to East Bay targets.',
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
    fieldNote: 'Sorensdale Park has three confirmed baseball/softball fields with active youth use — one reviewer specifically notes their son plays baseball here. The presence of a snack bar and organized game days suggests an existing org may already be operating. This ZIP may already be partially served. Palma Ceia Park historically had a baseball diamond that no longer appears active — a potential restoration target. Verify existing org presence at Sorensdale before deploying a new program; if confirmed, focus deployment on Palma Ceia restoration or underserved sub-areas. At 76.8% free lunch and 80,214 population, this is the most populous ZIP in the dataset and carries significant aggregate need.',
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
    fieldNote: 'Dense SF neighborhood with 3 confirmed fields, strong B&GC presence (9 locations), and 73.0% free lunch. At 69,299 residents, one of the most populous ZIPs in SF. The Mission is predominantly Latino — a community with real baseball tradition. Moderate SVI (0.166) reflects relative physical safety but understates economic vulnerability shown in free lunch data. The B&GC infrastructure provides a strong organizational foundation. Worth investigating which specific parks carry the 3 confirmed fields and whether any org is currently active.',
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
    fieldNote: 'SF neighborhood with 5 confirmed fields and 8 B&GC locations. Low SVI (0.113) but 58.0% free lunch reflects pockets of economic need within a mixed-income area. Moderate deployment priority.',
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
    fieldNote: '5 confirmed fields and 6 B&GC locations in a moderate-income SF ZIP. 46.4% free lunch suggests meaningful economic need among a portion of the population. Lower deployment priority than East Bay ZIPs at similar scores.',
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
    fieldNote: 'Hayward ZIP with 0 confirmed baseball fields but strong B&GC presence (9 locations) and 68.5% free lunch. No strong infrastructure or org flagged. Org infrastructure exists but may need field identification before program launch.',
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
    fieldNote: 'Affluent Tri-Valley suburb (11.0% free lunch). Score reflects B&GC density more than economic need. Not an RBI deployment priority — does not match the underserved youth profile.',
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
    fieldNote: '4 fields, 6 B&GC locations, 59.7% free lunch in a dense SF neighborhood. Chinatown portion has meaningful economic need; North Beach portion is higher-income. Mixed profile — field-specific investigation recommended.',
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
    fieldNote: 'Oakland neighborhood with 5 confirmed fields and 66.6% free lunch. Moderate need and solid infrastructure count. Lower B&GC density (4) than other Oakland ZIPs. Field conditions unverified — site assessment recommended.',
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
    fieldNote: 'San Leandro ZIP with 5 confirmed fields and 71.1% free lunch. Low B&GC count (4). San Leandro Little League covers neighboring 94577; verify whether SLLL coverage extends into this ZIP. Washington Manor Park has a confirmed field with Good condition per neighborhood reviews.',
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
    fieldNote: 'Affluent Pleasanton ZIP (9.4% free lunch). Score reflects moderate SVI and B&GC presence. Does not match the underserved youth profile for RBI deployment.',
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
    fieldNote: 'Despite an 84.6% free lunch rate (high economic need) and SVI of 0.312, this ZIP scores low due to zero confirmed baseball fields and only 3 B&GC locations — thin infrastructure and organizational capacity. Economic need is real; the gap is in physical and organizational infrastructure. Identify whether any recreational space exists before considering deployment.',
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
    fieldNote: '81.0% free lunch — one of the higher economic need readings in the dataset — combined with 4 fields and 5 B&GC locations. Low SVI (0.144) reflects relative physical safety. The free lunch rate suggests greater economic distress than the SVI captures. Worth investigating given the field count and free lunch data.',
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
    fieldNote: 'Higher-income Berkeley neighborhood (28.8% free lunch, low SVI). 5 fields present. Does not match the underserved youth profile for RBI deployment.',
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
    fieldNote: 'Town Estates Park has four confirmed baseball fields — the highest single-park count in the South Alameda dataset — with active family use documented in multiple reviews. No organization name appears in any review. Four well-used fields typically implies some form of organized league; verify before treating as a gap. Moderate need area (48.8% free lunch) with a large Latino community. If unconfirmed org presence is ruled out, Town Estates Park is a strong infrastructure-ready deployment site.',
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
    fieldNote: '4 fields, 54.3% free lunch, low SVI. SF College area ZIP with moderate need. City College of SF proximity may provide organizational partnership opportunities.',
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
    fieldNote: 'No confirmed baseball fields. Moderate SVI (0.263) and 31.9% free lunch. Thin organizational infrastructure (3 B&GC). Not a viable deployment site without field identification.',
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
    fieldNote: '5 confirmed fields but only 1 B&GC location — infrastructure without organizational depth. Small population (11,208). B&GC capacity needs to grow before this is a viable deployment site.',
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
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
    description: 'Bushrod Park is home to the North Oakland Little League (NOLL) and South Oakland Little League (SOLL), providing organized youth baseball in the heart of North Oakland. The park features dedicated baseball fields actively used for league play and youth development.',
    notes: 'Known NOLL/SOLL Little League home field. Already organized and actively served.',
    descriptionIsPlaceholder: true,
    registrationWindowIsPlaceholder: true,
  },
];

// ── ORGANIZATIONAL COVERAGE SCORING ────────────────────────────
// NEW FORMULA (with org presence):
//   Base Score = (SVI × 0.40) + (BaseballFields/18 × 0.20) + (B&GC/18 × 0.20) × 10
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
// Distance Decay: Programs closer to neighborhood have more impact.
// Cap: Total org reduction capped at 3 points out of 10.

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
 * Capped at 3.0 points max to preserve meaningful score differentiation.
 */
export function calculateOrgCoverageReduction(
  neighborhood: Neighborhood,
  programs: Program[]
): number {
  const coverages = findNearbyPrograms(neighborhood, programs);
  const totalImpact = coverages.reduce((sum, cov) => sum + cov.coverageImpact, 0);
  return Math.min(3.0, totalImpact);
}

/**
 * Calculate adjusted need score with org coverage factored in.
 * New weights: SVI 40%, Fields 20%, B&GC 20%, leaves room for org component impact.
 */
export function calculateAdjustedNeedScore(
  sviScore: number,
  baseballFieldCount: number,
  bgcCount: number,
  orgCoverageReduction: number
): number {
  const sviComponent = sviScore * 0.4;
  const fieldComponent = (baseballFieldCount / 18) * 0.2;
  const bgcComponent = (bgcCount / 18) * 0.2;

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
