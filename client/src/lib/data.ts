// FIRST BASE — Alameda County Data
// Real RBI program locations provided by project team.
// Neighborhood need scores are adjusted downward based on proximity to
// existing RBI programs (closer = lower urgency for new investment).
// =============================================================

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  // Scoring signals
  needScore: number; // 1-10 composite (adjusted for RBI proximity)
  baseNeedScore: number; // raw score before proximity adjustment
  sviScore: number; // CDC SVI 0-1
  youthPopulation: number; // ages 5-18
  medianIncome: number;
  povertyRate: number; // percent
  pctBlack: number;
  pctLatino: number;
  milestoNearestAffiliate: number;
  nearestAffiliateName: string;
  hasConfirmedField: boolean;
  nearHighFreeLunchSchool: boolean;
  noLittleLeagueNearby: boolean;
  // Display
  gapStatus: 'gap' | 'covered';
  fields: Field[];
  suggestedAnchor: OrgAnchor | null;
  polygonColor: string;
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
  // Description shown in Families view sidebar
  description: string;
  notes?: string;
}

// ── NEIGHBORHOODS ──────────────────────────────────────────────
// Need scores are adjusted downward based on proximity to real RBI programs.
// Proximity penalty: <3mi = -3.0, 3–5mi = -2.0, 5–8mi = -1.0, 8–12mi = -0.5

export const neighborhoods: Neighborhood[] = [
  {
    id: 'sobrante-park',
    name: 'Sobrante Park',
    city: 'Oakland',
    lat: 37.7299,
    lng: -122.1526,
    baseNeedScore: 9.2,
    needScore: 7.2, // -2.0: Oakland Babe Ruth/Cal Ripken Nike RBI @ 3.2mi
    sviScore: 0.87,
    youthPopulation: 1840,
    medianIncome: 64656,
    povertyRate: 24.3,
    pctBlack: 53.5,
    pctLatino: 38.0,
    milestoNearestAffiliate: 3.2,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: true,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.62,
    fields: [
      {
        id: 'sobrante-park-diamond',
        name: 'Sobrante Park Baseball Diamond',
        lat: 37.7305,
        lng: -122.1530,
        googleRating: 3.8,
        reviewCount: 27,
        condition: 'investment-needed',
        conditionNotes: 'Diamond confirmed via OSM + Google satellite. Backstop intact. Infield needs grading. No lights.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
        hours: 'Dawn to dusk',
      }
    ],
    suggestedAnchor: {
      name: 'Sobrante Park Recreation Center',
      type: 'rec-center',
      distanceMiles: 0.2,
      googleRating: 4.1,
      reviewCount: 48,
      phone: '(510) 238-7275',
      hasGym: true,
    }
  },
  {
    id: 'east-oakland-69th',
    name: 'East Oakland (69th Ave)',
    city: 'Oakland',
    lat: 37.7480,
    lng: -122.1820,
    baseNeedScore: 8.7,
    needScore: 5.7, // -3.0: Oakland Babe Ruth/Cal Ripken Nike RBI @ 1.2mi
    sviScore: 0.84,
    youthPopulation: 2100,
    medianIncome: 52300,
    povertyRate: 29.1,
    pctBlack: 48.2,
    pctLatino: 42.5,
    milestoNearestAffiliate: 1.2,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'covered',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.40,
    fields: [
      {
        id: 'greenman-field',
        name: 'Carter-Gilmore / Greenman Field',
        lat: 37.7620,
        lng: -122.1937,
        googleRating: 4.0,
        reviewCount: 62,
        condition: 'ready',
        conditionNotes: 'Home field of Oakland Babe Ruth/Cal Ripken Nike RBI. Active use.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
        hours: 'Varies by season',
      }
    ],
    suggestedAnchor: null,
  },
  {
    id: 'west-oakland',
    name: 'West Oakland',
    city: 'Oakland',
    lat: 37.8060,
    lng: -122.2980,
    baseNeedScore: 8.4,
    needScore: 7.4, // -1.0: Giants Community Fund RBI @ 5.4mi
    sviScore: 0.82,
    youthPopulation: 1420,
    medianIncome: 43500,
    povertyRate: 35.8,
    pctBlack: 58.2,
    pctLatino: 22.1,
    milestoNearestAffiliate: 5.4,
    nearestAffiliateName: 'Giants Community Fund RBI',
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: true,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.60,
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
    id: 'fruitvale',
    name: 'Fruitvale',
    city: 'Oakland',
    lat: 37.7760,
    lng: -122.2270,
    baseNeedScore: 8.1,
    needScore: 5.1, // -3.0: Oakland Babe Ruth/Cal Ripken Nike RBI @ 2.1mi
    sviScore: 0.80,
    youthPopulation: 2380,
    medianIncome: 55400,
    povertyRate: 27.6,
    pctBlack: 18.4,
    pctLatino: 64.2,
    milestoNearestAffiliate: 2.1,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'covered',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.35,
    fields: [
      {
        id: 'dimond-park',
        name: 'Dimond Park Baseball Field',
        lat: 37.7765,
        lng: -122.2275,
        googleRating: 4.3,
        reviewCount: 58,
        condition: 'ready',
        conditionNotes: 'Active community field. Good condition.',
        confirmedByOSM: true,
        confirmedByGoogle: true,
        isRecCenter: false,
      }
    ],
    suggestedAnchor: null,
  },
  {
    id: 'elmhurst',
    name: 'Elmhurst',
    city: 'Oakland',
    lat: 37.7440,
    lng: -122.1680,
    baseNeedScore: 7.8,
    needScore: 4.8, // -3.0: Oakland Babe Ruth/Cal Ripken Nike RBI @ 1.9mi
    sviScore: 0.79,
    youthPopulation: 1960,
    medianIncome: 56800,
    povertyRate: 26.4,
    pctBlack: 44.1,
    pctLatino: 40.2,
    milestoNearestAffiliate: 1.9,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: true,
    gapStatus: 'covered',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.30,
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
    id: 'south-hayward',
    name: 'South Hayward',
    city: 'Hayward',
    lat: 37.6327,
    lng: -122.0814,
    baseNeedScore: 7.6,
    needScore: 7.1, // -0.5: Oakland Babe Ruth/Cal Ripken Nike RBI @ 10.8mi
    sviScore: 0.76,
    youthPopulation: 2640,
    medianIncome: 58700,
    povertyRate: 23.5,
    pctBlack: 12.4,
    pctLatino: 58.7,
    milestoNearestAffiliate: 10.8,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    hasConfirmedField: true,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'gap',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.55,
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
    id: 'san-antonio',
    name: 'San Antonio',
    city: 'Oakland',
    lat: 37.7600,
    lng: -122.2400,
    baseNeedScore: 7.4,
    needScore: 4.4, // -3.0: Oakland Babe Ruth/Cal Ripken Nike RBI @ 2.5mi
    sviScore: 0.74,
    youthPopulation: 1780,
    medianIncome: 59200,
    povertyRate: 22.8,
    pctBlack: 22.6,
    pctLatino: 52.4,
    milestoNearestAffiliate: 2.5,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    hasConfirmedField: false,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'covered',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.28,
    fields: [],
    suggestedAnchor: null,
  },
  {
    id: 'seminary',
    name: 'Seminary',
    city: 'Oakland',
    lat: 37.7530,
    lng: -122.1840,
    baseNeedScore: 6.9,
    needScore: 3.9, // -3.0: Oakland Babe Ruth/Cal Ripken Nike RBI @ 0.8mi
    sviScore: 0.71,
    youthPopulation: 1680,
    medianIncome: 68200,
    povertyRate: 19.8,
    pctBlack: 35.4,
    pctLatino: 38.9,
    milestoNearestAffiliate: 0.8,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
    hasConfirmedField: false,
    nearHighFreeLunchSchool: true,
    noLittleLeagueNearby: false,
    gapStatus: 'covered',
    polygonColor: '#0D2B18',
    polygonOpacity: 0.22,
    fields: [],
    suggestedAnchor: null,
  },
  {
    id: 'san-leandro-washington',
    name: 'Washington Manor',
    city: 'San Leandro',
    lat: 37.6935,
    lng: -122.1590,
    baseNeedScore: 6.4,
    needScore: 5.4, // -1.0: Oakland Babe Ruth/Cal Ripken Nike RBI @ 5.1mi
    sviScore: 0.64,
    youthPopulation: 1920,
    medianIncome: 74300,
    povertyRate: 16.2,
    pctBlack: 14.8,
    pctLatino: 32.6,
    milestoNearestAffiliate: 5.1,
    nearestAffiliateName: 'Oakland Babe Ruth/Cal Ripken Nike RBI',
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
  },
  {
    id: 'fremont-area',
    name: 'Fremont (Central)',
    city: 'Fremont',
    lat: 37.5485,
    lng: -121.9886,
    baseNeedScore: 5.2,
    needScore: 5.2, // no nearby RBI program
    sviScore: 0.52,
    youthPopulation: 4200,
    medianIncome: 98400,
    povertyRate: 9.2,
    pctBlack: 8.1,
    pctLatino: 14.3,
    milestoNearestAffiliate: 17.8,
    nearestAffiliateName: 'Loyal To My Soil',
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
  }
];

// ── PROGRAMS (Families View) ───────────────────────────────────
// Real RBI program locations provided by project team.
// Descriptions are placeholders pending official copy from each org.

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
    coverageRadiusMiles: 5,
    description: 'The Giants Community Fund RBI program is headquartered at Oracle Park, home of the San Francisco Giants. This program provides youth baseball and softball opportunities across the Bay Area, with a focus on underserved communities.',
    notes: 'Located at Oracle Park — the official headquarters for the Giants Community Fund.',
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
    coverageRadiusMiles: 5,
    description: 'Oakland Babe Ruth/Cal Ripken Nike RBI operates out of Carter-Gilmore/Greenman Field in East Oakland. This program serves youth ages 4–18 with a focus on providing baseball access to underserved Oakland communities.',
    notes: 'Home field: Carter-Gilmore/Greenman Field at 1390 66th Avenue, Oakland, CA 94621. Mailing: PO Box 27549, Oakland, CA 94602.',
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
    description: 'Bay Area Ballplayers is a nonprofit organization based in Moraga providing year-round baseball and softball training, development, and league play for youth across the East Bay. Programs emphasize skill development and community.',
    notes: 'Located in Moraga, serving youth across Contra Costa and Alameda Counties.',
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
  },
];

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
    'investment-needed': 'Infrastructure Investment Needed',
    'gap': 'No Field',
  };
  return labels[condition];
}

// Sort neighborhoods by need score descending
export const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b.needScore - a.needScore);
