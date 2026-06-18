# Scoring Guide: How Neighborhoods Are Ranked

## Overview

Each neighborhood gets a **need score** from 0–10 based on:
1. **Social vulnerability** (economic distress, lack of resources)
2. **Baseball infrastructure** (fields and facilities)
3. **Organizational presence** (nearby RBI, Little League, and other programs)

**Higher score = higher need** for new baseball program support.

---

## The Formula

### Base Score (Social Vulnerability + Infrastructure)

```
Base Score = (SVI × 0.50) + (Fields/18 × 0.25) + (B&GC/18 × 0.25) × 10
```

**Components:**
| Component | Weight | What It Measures |
|-----------|--------|------------------|
| **SVI (Social Vulnerability Index)** | 50% | CDC metric of economic/social distress (0–1 scale) |
| **Baseball Fields** | 25% | Count of confirmed fields; normalized to 18 |
| **Boys & Girls Clubs** | 25% | Count of B&GC locations; normalized to 18 |

**Result**: Base scores typically range from **3–7 out of 10**.

### Adjusted Score (Base Score Minus Program Coverage)

```
Adjusted Score = Base Score − Org Coverage Reduction
```

Where **Org Coverage Reduction** is based on nearby programs:
- **0 points** if no programs nearby
- **Up to 1.5 points** if programs exist within 5 miles
- Factors in program type, cost, and distance

**Result**: Final scores still range **0–10**, but areas with good program coverage score lower (less need).

---

## Organization Weights

Programs are weighted by type. **Better programs = higher reduction** (lower final need score).

| Org Type | Weight | Why |
|----------|--------|-----|
| **RBI** | 2.0 | Comprehensive, free, focuses on underserved youth |
| **Little League** | 1.5 | Established, structured, widely trusted |
| **Parks & Rec** | 0.8 | Often limited focus on baseball specifically |
| **Nonprofit** | 0.6 | Variable quality and focus |

---

## Cost Multipliers

Free programs have more impact than paid programs (they serve more youth).

| Cost | Multiplier |
|------|-----------|
| **Free** | 1.0 |
| **Low-cost** | 0.8 |
| **Paid** | 0.5 |

---

## Distance Decay

Programs closer to a neighborhood have more impact. Impact decreases with distance.

```
Distance Factor = max(0.5, 1 − (distance / 5 miles))
```

- **0 miles** (neighborhood center): 100% impact
- **2.5 miles**: 75% impact
- **5 miles**: 50% impact
- **Beyond 5 miles**: program not considered

**Example**: An RBI program 2 miles away:
```
Impact = OrgType(2.0) × Cost(1.0) × Distance(0.6) = 1.2 points
```

---

## Example Calculations

### Example 1: High-Need Neighborhood (No Programs)

```
Neighborhood: Hegenberger/Coliseum
- SVI: 0.67
- Fields: 12
- B&GC: 0

Base Score = (0.67 × 0.50) + (12/18 × 0.25) + (0/18 × 0.25) × 10
           = (0.335) + (0.167) + (0) × 10
           = 5.02 × 10 = 5.02

Nearby Programs: None
Org Coverage Reduction: 0

Adjusted Score: 5.02 / 10  ← No programs, full need
```

### Example 2: Lower-Need Neighborhood (Strong Program Coverage)

```
Neighborhood: Oakland (Downtown area)
- SVI: 0.52
- Fields: 8
- B&GC: 2

Base Score = (0.52 × 0.50) + (8/18 × 0.25) + (2/18 × 0.25) × 10
           = (0.26) + (0.111) + (0.028) × 10
           = 3.99 / 10

Nearby Programs (within 5 miles):
  1. RBI program, free, 1.2 miles away
     Impact = 2.0 × 1.0 × max(0.5, 1 - 1.2/5) = 2.0 × 1.0 × 0.76 = 1.52
  
  2. Little League, low-cost, 3.5 miles away
     Impact = 1.5 × 0.8 × max(0.5, 1 - 3.5/5) = 1.5 × 0.8 × 0.30 = 0.36

Total Org Coverage Reduction = min(1.52 + 0.36, 1.5) = 1.50 (capped)

Adjusted Score: 3.99 − 1.50 = 2.49 / 10  ← Programs nearby, reduced need
```

---

## Key Insights

### Areas with NO Programs Keep Full Base Score
If a neighborhood has no nearby programs, `Org Coverage Reduction = 0`, so the adjusted score equals the base score. This highlights true unmet need.

**Example**: A neighborhood with low SVI (wealthy, stable) but no programs scores low. This is correct—there's less *need*, not more infrastructure.

### Org Reduction is Capped at 1.5
Even with multiple strong programs nearby, a neighborhood's score can't drop more than 1.5 points. This ensures meaningful differentiation for deployment decisions.

**Example**: A vulnerable area (SVI 0.8) with strong programs still scores ~6+ out of 10, signaling it could use additional resources.

---

## How Scoring Is Used in FieldFinder

### Map View
- **Choropleth colors**: Darker = higher need (orange/red for scores 6+, yellow/green for scores 3-5)
- Each neighborhood is shaded based on its adjusted need score

### Sidebar Ranking
- **Priority List**: Neighborhoods sorted by adjusted need score (highest first)
- **NeighborhoodProfile**: Shows the final adjusted score + breakdown of components

### Search
- When you search for a neighborhood, the result shows its adjusted need score

---

## Customizing Scores

### Modify Organization Weights

Edit `client/src/lib/data.ts` in the `findNearbyPrograms()` function:

```typescript
const orgTypeWeights: Record<Program['orgType'], number> = {
  rbi: 2.0,           // ← Increase to weight RBI more heavily
  'little-league': 1.5,
  'parks-rec': 0.8,
  nonprofit: 0.6,
};
```

Then restart: `npm run dev`

### Modify Cost Multipliers

In the same function:

```typescript
const costMultipliers: Record<Program['cost'], number> = {
  free: 1.0,
  'low-cost': 0.8,    // ← Adjust if low-cost should count more
  paid: 0.5,
};
```

### Change the Search Radius

Change the `5` in `findNearbyPrograms()` calls:

```typescript
findNearbyPrograms(neighborhood, programs, 5)  // ← Change 5 to your preferred miles
```

### Adjust the Org Reduction Cap

In `calculateOrgCoverageReduction()`:

```typescript
Math.min(1.5, totalImpact)  // ← Change 1.5 to your preferred cap
```

---

## Using Scores in Code

### Get Adjusted Scores for All Neighborhoods

```typescript
import { programs, getAllAdjustedNeighborhoods } from '@/lib/data';

const adjusted = getAllAdjustedNeighborhoods(programs)
  .sort((a, b) => b.adjustedNeedScore - a.adjustedNeedScore);

adjusted.forEach(hood => {
  console.log(`${hood.name}: ${hood.adjustedNeedScore.toFixed(1)}/10`);
});
```

### Get a Single Neighborhood with Program Details

```typescript
import { neighborhoods, programs, getAdjustedNeighborhood } from '@/lib/data';

const hood = neighborhoods.find(n => n.id === 'hegenberger-coliseum');
const adjusted = getAdjustedNeighborhood(hood, programs);

console.log(`Name: ${adjusted.name}`);
console.log(`Need Score: ${adjusted.adjustedNeedScore.toFixed(1)}/10`);
console.log(`Nearby Programs: ${adjusted.nearbyPrograms.length}`);

adjusted.nearbyPrograms.forEach(p => {
  console.log(`  - ${p.programName} (${p.distanceMiles.toFixed(1)} mi)`);
});
```

### Find Programs Near a Neighborhood

```typescript
import { findNearbyPrograms } from '@/lib/data';

const progs = findNearbyPrograms(neighborhood, programs, 5);

progs.forEach(p => {
  console.log(`${p.programName}`);
  console.log(`  Type: ${p.orgType}, Cost: ${p.cost}`);
  console.log(`  Distance: ${p.distanceMiles.toFixed(1)} miles`);
  console.log(`  Impact on Score: −${p.coverageImpact.toFixed(2)} points`);
});
```

---

## FAQ

**Q: Why base scores on SVI, fields, and B&GC?**  
A: SVI captures economic need. Fields and B&GCs are measurable proxies for baseball infrastructure and youth programs. Together, they reflect real barriers to access.

**Q: Why cap org reduction at 1.5 points?**  
A: Neighborhoods with high need (high SVI, low infrastructure) should never score below ~3–4 even with strong program coverage. This preserves meaningful ranking for deployment decisions.

**Q: How often are scores updated?**  
A: Scores update when you restart the dev server (they're calculated from data.ts at runtime). To sync with external databases, modify `data.ts` to fetch from an API.

**Q: Can I add new programs?**  
A: Yes! Add them to the `programs` array in `client/src/lib/data.ts`. Scores update automatically on the next calculation.

**Q: Can neighborhoods have negative scores?**  
A: No. The formula ensures scores stay in 0–10 range even with heavy program coverage.

---

## Files

- **`client/src/lib/data.ts`**: Contains scoring functions and all neighborhood + program data
- **`client/src/components/MapView.tsx`**: Uses adjusted scores for map coloring
- **`client/src/components/NeighborhoodSidebar.tsx`**: Displays adjusted scores in sidebar
- **`client/src/components/TopNav.tsx`**: Shows adjusted scores in search results

---

## Questions?

See [QUICK_START.md](./QUICK_START.md) for setup instructions.
