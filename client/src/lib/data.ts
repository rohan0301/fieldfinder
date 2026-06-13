// =============================================================
// FIRST BASE — Alameda County Seed Data
// Demo data for hackathon build. All Sobrante Park data is
// sourced and verifiable. Other neighborhoods are representative.
// =============================================================

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  // Scoring signals
  needScore: number; // 1-10 composite
  sviScore: number; // CDC SVI 0-1
  youthPopulation: number; // ages 5-18
  medianIncome: number;
  povertyRate: number; // percent
  pctBlack: number;
  pctLatino: number;
  milestoNearestAffiliate: number;
  hasConfirmedField: boolean;
  nearHighFreeLunchSchool: boolean;
  noLittleLeagueNearby: boolean;
  // Display
  gapStatus: 'gap' | 'covered';
  fields: Field[];
  suggestedAnchor: OrgAnchor | null;
  // Polygon bounds (simplified for demo — center + radius approximation)
  polygonColor: string; // hex based on score
  polygonOpacity: number;
}

export interface Field {
  id: string;
  name: string;
  lat: number;
  lng: number;
  googleRating: number;
  reviewCount: number;
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
  googleRating: number;
  reviewCount: number;
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
  address: string;
  status: 'confirmed-active' | 'listed';
  coverageRadiusMiles: number;
}

// ── NEIGHBORHOODS ──────────────────────────────────────────────

export const neighborhoods: Neighborhood[] = [
  {
    id: 'sobrante-park',
    name: 'Sobrante Park',
    city: 'Oakland',
    lat: 37.7299,
    lng: -122.1526,
    needScore: 9.2,
    sviScore: 0.87,
    youthPopulation: 1840,
    medianIncome: 64656,
    povertyRate: 24.3,
    pctBlack: 53.5,
    pctLatino: 38.0,
    milestoNearestAffiliate: 4.8,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: true,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.8,
    fields: [
      {
        id: 'sobrante-park-diamond',
        name: 'Sobrante Park Baseball Diamond',
        lat: 37.7295,
        lng: -122.1530,
        googleRating: 4.3,
        reviewCount: 52,
        condition: 'investment-needed',
        conditionNotes: 'Bathrooms permanently closed. Field maintenance needed. Backstop intact.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
        hours: '6am–9pm daily',
      },
      {
        id: 'ira-jinkins-cc',
        name: 'Ira Jinkins Community Center',
        lat: 37.7310,
        lng: -122.1480,
        googleRating: 4.5,
        reviewCount: 91,
        condition: 'ready',
        conditionNotes: 'Gymnasium available. Indoor fallback venue. Active community programming.',
        confirmedByOSM: false,
        confirmedByGoogle: true,
        isRecCenter: true,
      }
    ],
    suggestedAnchor: {
      name: 'Ira Jinkins Community Center',
      type: 'rec-center',
      distanceMiles: 0.8,
      googleRating: 4.5,
      reviewCount: 91,
      phone: '(510) 615-5716',
      hasGym: true,
    }
  },
  {
    id: 'fruitvale',
    name: 'Fruitvale',
    city: 'Oakland',
    lat: 37.7747,
    lng: -122.2244,
    needScore: 8.1,
    sviScore: 0.81,
    youthPopulation: 3240,
    medianIncome: 52400,
    povertyRate: 28.7,
    pctBlack: 18.2,
    pctLatino: 62.4,
    milestoNearestAffiliate: 3.2,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.65,
    fields: [
      {
        id: 'fruitvale-park-field',
        name: 'Fruitvale Park Baseball Field',
        lat: 37.7750,
        lng: -122.2260,
        googleRating: 3.8,
        reviewCount: 28,
        condition: 'investment-needed',
        conditionNotes: 'Infield needs leveling. Lights out in left field. Backstop needs repair.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: {
      name: 'Fruitvale Recreation Center',
      type: 'rec-center',
      distanceMiles: 0.4,
      googleRating: 4.1,
      reviewCount: 63,
      phone: '(510) 482-7850',
      hasGym: true,
    }
  },
  {
    id: 'east-oakland-69th',
    name: 'East Oakland (69th Ave)',
    city: 'Oakland',
    lat: 37.7590,
    lng: -122.1920,
    needScore: 8.7,
    sviScore: 0.84,
    youthPopulation: 2180,
    medianIncome: 48200,
    povertyRate: 31.2,
    pctBlack: 61.3,
    pctLatino: 28.5,
    milestoNearestAffiliate: 5.1,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: true,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.75,
    fields: [
      {
        id: 'mcafee-coliseum-park',
        name: 'Coliseum Park Baseball Diamond',
        lat: 37.7595,
        lng: -122.1935,
        googleRating: 4.0,
        reviewCount: 41,
        condition: 'ready',
        conditionNotes: 'Well-maintained. Youth leagues use this field regularly.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: {
      name: 'East Oakland Youth Development Center',
      type: 'rec-center',
      distanceMiles: 0.6,
      googleRating: 4.3,
      reviewCount: 47,
      phone: '(510) 569-8088',
      hasGym: false,
    }
  },
  {
    id: 'san-antonio',
    name: 'San Antonio',
    city: 'Oakland',
    lat: 37.7920,
    lng: -122.2450,
    needScore: 7.4,
    sviScore: 0.74,
    youthPopulation: 2890,
    medianIncome: 61300,
    povertyRate: 22.1,
    pctBlack: 22.8,
    pctLatino: 55.3,
    milestoNearestAffiliate: 2.8,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.55,
    fields: [
      {
        id: 'san-antonio-park',
        name: 'San Antonio Park Field',
        lat: 37.7925,
        lng: -122.2455,
        googleRating: 4.2,
        reviewCount: 35,
        condition: 'ready',
        conditionNotes: 'Good condition. Backstop solid. Used by informal youth groups.',
        confirmedByOSM: true,
        confirmedByGoogle: false,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: {
      name: 'San Antonio Recreation Center',
      type: 'rec-center',
      distanceMiles: 0.3,
      googleRating: 4.0,
      reviewCount: 88,
      phone: '(510) 535-5620',
      hasGym: true,
    }
  },
  {
    id: 'elmhurst',
    name: 'Elmhurst',
    city: 'Oakland',
    lat: 37.7440,
    lng: -122.1680,
    needScore: 7.8,
    sviScore: 0.79,
    youthPopulation: 1960,
    medianIncome: 56800,
    povertyRate: 26.4,
    pctBlack: 44.1,
    pctLatino: 40.2,
    milestoNearestAffiliate: 4.2,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: true,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.62,
    fields: [
      {
        id: 'elmhurst-park-diamond',
        name: 'Elmhurst Park Diamond',
        lat: 37.7445,
        lng: -122.1685,
        googleRating: 3.6,
        reviewCount: 19,
        condition: 'investment-needed',
        conditionNotes: 'Overgrown outfield. No lights. Backstop needs repair.',
        confirmedByOSM: true,
        confirmedByGoogle: false,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: {
      name: 'Elmhurst United Methodist Church',
      type: 'rec-center',
      distanceMiles: 0.5,
      googleRating: 4.4,
      reviewCount: 32,
      hasGym: false,
    }
  },
  {
    id: 'west-oakland',
    name: 'West Oakland',
    city: 'Oakland',
    lat: 37.8060,
    lng: -122.2980,
    needScore: 8.4,
    sviScore: 0.82,
    youthPopulation: 1420,
    medianIncome: 43500,
    povertyRate: 35.8,
    pctBlack: 58.2,
    pctLatino: 22.1,
    milestoNearestAffiliate: 3.6,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: true,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.70,
    fields: [
      {
        id: 'raimondi-park',
        name: 'Raimondi Park Baseball Field',
        lat: 37.8065,
        lng: -122.2985,
        googleRating: 4.1,
        reviewCount: 44,
        condition: 'ready',
        conditionNotes: 'Well-maintained community field. Active use by youth groups.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: {
      name: 'West Oakland Boys & Girls Club',
      type: 'bgc',
      distanceMiles: 0.7,
      googleRating: 4.6,
      reviewCount: 112,
      phone: '(510) 839-2119',
      hasGym: true,
    }
  },
  {
    id: 'seminary',
    name: 'Seminary',
    city: 'Oakland',
    lat: 37.7530,
    lng: -122.1840,
    needScore: 6.9,
    sviScore: 0.71,
    youthPopulation: 1680,
    medianIncome: 68200,
    povertyRate: 19.8,
    pctBlack: 35.4,
    pctLatino: 38.9,
    milestoNearestAffiliate: 2.4,
    hasConfirmedField: false,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.45,
    fields: [],
    suggestedAnchor: null,
  },
  {
    id: 'fremont-area',
    name: 'Fremont (Central)',
    city: 'Fremont',
    lat: 37.5485,
    lng: -121.9886,
    needScore: 5.2,
    sviScore: 0.52,
    youthPopulation: 4200,
    medianIncome: 98400,
    povertyRate: 9.2,
    pctBlack: 8.1,
    pctLatino: 14.3,
    milestoNearestAffiliate: 1.8,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: false,
    noLittleLeagueNearby: false,
    gapStatus: 'covered',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.25,
    fields: [
      {
        id: 'fremont-central-park',
        name: 'Central Park Baseball Complex',
        lat: 37.5490,
        lng: -121.9890,
        googleRating: 4.6,
        reviewCount: 128,
        condition: 'ready',
        conditionNotes: 'Excellent condition. Multiple diamonds. Lights available.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: null,
  },
  {
    id: 'hayward-south',
    name: 'South Hayward',
    city: 'Hayward',
    lat: 37.6327,
    lng: -122.0814,
    needScore: 7.6,
    sviScore: 0.76,
    youthPopulation: 2640,
    medianIncome: 58700,
    povertyRate: 23.5,
    pctBlack: 12.4,
    pctLatino: 58.7,
    milestoNearestAffiliate: 3.9,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.58,
    fields: [
      {
        id: 'south-hayward-bart-park',
        name: 'Ruus Park Baseball Field',
        lat: 37.6330,
        lng: -122.0820,
        googleRating: 3.9,
        reviewCount: 22,
        condition: 'investment-needed',
        conditionNotes: 'Backstop damaged. Infield needs work. Outfield grass OK.',
        confirmedByOSM: true,
        confirmedByGoogle: false,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: {
      name: 'South Hayward Boys & Girls Club',
      type: 'bgc',
      distanceMiles: 1.1,
      googleRating: 4.2,
      reviewCount: 56,
      phone: '(510) 783-7900',
      hasGym: true,
    }
  },
  {
    id: 'san-leandro-washington',
    name: 'Washington Manor',
    city: 'San Leandro',
    lat: 37.6935,
    lng: -122.1590,
    needScore: 6.4,
    sviScore: 0.64,
    youthPopulation: 1920,
    medianIncome: 74300,
    povertyRate: 16.2,
    pctBlack: 14.8,
    pctLatino: 32.6,
    milestoNearestAffiliate: 2.1,
    hasConfirmedField: true,
    nearHighFreeLunchSchool: false,
    noLittleLeagueNearby: false,
    gapStatus: 'covered',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.35,
    fields: [
      {
        id: 'washington-manor-park',
        name: 'Washington Manor Park Field',
        lat: 37.6940,
        lng: -122.1595,
        googleRating: 4.3,
        reviewCount: 38,
        condition: 'ready',
        conditionNotes: 'Good condition. Active Little League use.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: null,
  }
];

// ── PROGRAMS (Parent View) ─────────────────────────────────────

export const programs: Program[] = [
  {
    id: 'rbi-oakland-east',
    name: 'RBI Oakland East',
    orgType: 'rbi',
    lat: 37.7820,
    lng: -122.2100,
    city: 'Oakland',
    ageMin: 8,
    ageMax: 18,
    cost: 'free',
    equipmentProvided: true,
    season: 'Spring/Summer 2026',
    registrationOpen: true,
    registrationWindow: 'Open through July 15, 2026',
    phone: '(510) 238-7275',
    website: 'https://mlb.com/rbi',
    address: '2550 International Blvd, Oakland, CA 94601',
    status: 'confirmed-active',
    coverageRadiusMiles: 4,
  },
  {
    id: 'oakland-little-league-fruitvale',
    name: 'Fruitvale Little League',
    orgType: 'little-league',
    lat: 37.7760,
    lng: -122.2270,
    city: 'Oakland',
    ageMin: 5,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: false,
    season: 'Spring 2026',
    registrationOpen: false,
    registrationWindow: 'Opens January 2027',
    phone: '(510) 534-7600',
    website: 'https://littleleague.org',
    address: '3700 E 12th St, Oakland, CA 94601',
    status: 'confirmed-active',
    coverageRadiusMiles: 4,
  },
  {
    id: 'parks-rec-mosswood',
    name: 'Mosswood Park Baseball',
    orgType: 'parks-rec',
    lat: 37.8200,
    lng: -122.2600,
    city: 'Oakland',
    ageMin: 6,
    ageMax: 14,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Summer 2026',
    registrationOpen: true,
    registrationWindow: 'Open through June 30, 2026',
    phone: '(510) 238-7275',
    website: 'https://oaklandca.gov/parks',
    address: '3612 Webster St, Oakland, CA 94609',
    status: 'confirmed-active',
    coverageRadiusMiles: 3,
  },
  {
    id: 'bgc-west-oakland-baseball',
    name: 'West Oakland B&GC Baseball',
    orgType: 'nonprofit',
    lat: 37.8070,
    lng: -122.2990,
    city: 'Oakland',
    ageMin: 7,
    ageMax: 17,
    cost: 'free',
    equipmentProvided: true,
    season: 'Year-round',
    registrationOpen: true,
    registrationWindow: 'Rolling enrollment',
    phone: '(510) 839-2119',
    website: 'https://bgca.org',
    address: '1945 Adeline St, Oakland, CA 94607',
    status: 'confirmed-active',
    coverageRadiusMiles: 4,
  },
  {
    id: 'fremont-little-league',
    name: 'Fremont Little League',
    orgType: 'little-league',
    lat: 37.5500,
    lng: -121.9870,
    city: 'Fremont',
    ageMin: 4,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: false,
    season: 'Spring 2026',
    registrationOpen: false,
    registrationWindow: 'Opens December 2026',
    phone: '(510) 793-7600',
    website: 'https://littleleague.org',
    address: '39770 Paseo Padre Pkwy, Fremont, CA 94538',
    status: 'confirmed-active',
    coverageRadiusMiles: 4,
  },
  {
    id: 'hayward-parks-baseball',
    name: 'Hayward Parks & Rec Baseball',
    orgType: 'parks-rec',
    lat: 37.6688,
    lng: -122.0808,
    city: 'Hayward',
    ageMin: 6,
    ageMax: 14,
    cost: 'low-cost',
    equipmentProvided: true,
    season: 'Spring/Summer 2026',
    registrationOpen: true,
    registrationWindow: 'Open through July 1, 2026',
    phone: '(510) 881-6700',
    website: 'https://hayward-ca.gov',
    address: '777 B St, Hayward, CA 94541',
    status: 'confirmed-active',
    coverageRadiusMiles: 4,
  },
  {
    id: 'san-leandro-little-league',
    name: 'San Leandro Little League',
    orgType: 'little-league',
    lat: 37.7249,
    lng: -122.1561,
    city: 'San Leandro',
    ageMin: 5,
    ageMax: 16,
    cost: 'low-cost',
    equipmentProvided: false,
    season: 'Spring 2026',
    registrationOpen: false,
    registrationWindow: 'Opens January 2027',
    phone: '(510) 352-7600',
    website: 'https://littleleague.org',
    address: '14895 E 14th St, San Leandro, CA 94578',
    status: 'confirmed-active',
    coverageRadiusMiles: 4,
  },
  {
    id: 'rbi-berkeley',
    name: 'RBI Berkeley',
    orgType: 'rbi',
    lat: 37.8716,
    lng: -122.2727,
    city: 'Berkeley',
    ageMin: 8,
    ageMax: 18,
    cost: 'free',
    equipmentProvided: true,
    season: 'Spring/Summer 2026',
    registrationOpen: true,
    registrationWindow: 'Open through July 31, 2026',
    phone: '(510) 981-5150',
    website: 'https://mlb.com/rbi',
    address: '2800 Park St, Berkeley, CA 94702',
    status: 'confirmed-active',
    coverageRadiusMiles: 4,
  }
];

// ── HELPER FUNCTIONS ───────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 8.5) return '#0D2B18';
  if (score >= 7.0) return '#0F3020';
  if (score >= 5.5) return '#123525';
  if (score >= 4.0) return '#163A2A';
  return '#1A4A2E';
}

export function getScoreOpacity(score: number): number {
  if (score >= 8.5) return 0.82;
  if (score >= 7.0) return 0.65;
  if (score >= 5.5) return 0.48;
  if (score >= 4.0) return 0.32;
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
    'investment-needed': 'Infrastructure Investment Needed',
    'gap': 'No Field',
  };
  return labels[condition];
}

// Sort neighborhoods by need score descending
export const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b.needScore - a.needScore);
