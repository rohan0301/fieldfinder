// ZIP_CODE → neighborhood ID mapping for the Google Maps Data Layer.
//
// One entry per ZIP. The first (and only) ID in each array is the neighborhood
// that owns that ZIP for choropleth coloring and click behavior.
//
// ZIPs present in the GeoJSON but absent from this map render with neutral
// styling and are not clickable. The three Excel ZIPs not in the GeoJSON
// (94706, 94551, 94550) have no entry here — they are scored but unmappable
// until the GeoJSON is updated to include Albany and Livermore.

export const zipToNeighborhoods: Record<string, string[]> = {
  // ── Oakland ──────────────────────────────────────────────────
  '94601': ['fruitvale'],
  '94602': ['maxwell-park'],
  '94603': ['sobrante-park'],
  '94605': ['eastmont'],
  '94606': ['san-antonio'],
  '94608': ['emeryville'],
  '94609': ['temescal'],
  '94610': ['grand-lake'],
  '94611': ['montclair'],
  '94612': ['uptown-oakland'],
  '94618': ['rockridge'],
  '94619': ['redwood-heights'],
  '94621': ['hegenberger-coliseum'],
  // ── Hayward ──────────────────────────────────────────────────
  '94541': ['downtown-hayward'],
  '94542': ['hayward-highlands'],
  '94544': ['south-hayward'],
  '94545': ['hayward-harder'],
  // ── San Leandro ──────────────────────────────────────────────
  '94577': ['north-san-leandro'],
  '94578': ['east-san-leandro'],
  '94579': ['washington-manor'],
  '94580': ['san-lorenzo'],
  // ── Alameda (island) ─────────────────────────────────────────
  '94501': ['alameda-island'],
  '94502': ['alameda-bay-farm'],
  // ── Castro Valley / East Bay suburbs ─────────────────────────
  '94546': ['castro-valley'],
  '94552': ['castro-valley-east'],
  '94566': ['pleasanton'],
  '94568': ['dublin'],
  '94587': ['union-city'],
  '94588': ['pleasanton-ne'],
  // ── Berkeley ─────────────────────────────────────────────────
  '94702': ['west-berkeley'],
  '94703': ['central-berkeley'],
  '94704': ['south-berkeley'],
  '94705': ['elmwood-berkeley'],
  '94707': ['north-berkeley'],
  '94708': ['berkeley-hills'],
  '94709': ['north-berkeley-east'],
  '94710': ['berkeley-marina'],
  // ── San Francisco ─────────────────────────────────────────────
  '94102': ['civic-center-sf'],
  '94103': ['soma-sf'],
  '94107': ['dogpatch-sf'],
  '94108': ['chinatown-sf'],
  '94109': ['nob-hill-sf'],
  '94110': ['mission-sf'],
  '94111': ['financial-district-sf'],
  '94112': ['excelsior'],
  '94114': ['castro-sf'],
  '94115': ['western-addition'],
  '94116': ['west-portal-sf'],
  '94117': ['haight-sf'],
  '94118': ['richmond-district-sf'],
  '94121': ['inner-richmond-sf'],
  '94122': ['outer-sunset-sf'],
  '94123': ['marina-sf'],
  '94124': ['bayview-hp'],
  '94127': ['west-portal-st-francis'],
  '94131': ['glen-park-sf'],
  '94132': ['lake-merced-sf'],
  '94133': ['north-beach-sf'],
  '94134': ['visitacion-valley'],
};

/** Returns the primary neighborhood ID for a ZIP, or null if unmapped. */
export function getPrimaryNeighborhoodId(zip: string): string | null {
  return zipToNeighborhoods[zip]?.[0] ?? null;
}

/** Returns all neighborhood IDs associated with a ZIP. */
export function getNeighborhoodIdsForZip(zip: string): string[] {
  return zipToNeighborhoods[zip] ?? [];
}

/** Returns all ZIP codes that include a given neighborhood ID. */
export function getZipsForNeighborhoodId(id: string): string[] {
  return Object.entries(zipToNeighborhoods)
    .filter(([, ids]) => ids.includes(id))
    .map(([zip]) => zip);
}
