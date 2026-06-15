# FieldFinder: Updated Scoring System with Organizational Coverage

## Overview

The scoring system now factors in **organizational presence** to adjust neighborhood need scores. Areas with better program coverage see their need scores reduced, reflecting the reality that existing programs already serve those communities.

---

## Scoring Formula

### Base Components (40% each of original 100%)
```
Base Score = (SVI × 0.40) + (BaseballFields/18 × 0.20) + (B&GC/18 × 0.20) × 10
```

| Component | Weight | Description |
|-----------|--------|-------------|
| **SVI (Social Vulnerability Index)** | 40% | CDC metric (0–1); higher = more vulnerable |
| **Baseball Fields** | 20% | Count of confirmed fields, normalized to 18 |
| **Boys & Girls Clubs** | 20% | Count of B&GC locations, normalized to 18 |

### Org Coverage Reduction (Applied After Base Score)
```
Adjusted Score = Base Score - Org Coverage Reduction
Minimum: 0, Maximum: Base Score
Org Coverage Reduction: 0–3 points (capped)
```

---

## Organization Type Weights

Programs are weighted by type. **Better programs = higher reduction** (lower final need score).

| Org Type | Weight | Rationale |
|----------|--------|-----------|
| **RBI** | 2.0 | Comprehensive, free, best for underserved youth |
| **Little League** | 1.5 | Established, structured, high credibility |
| **Parks & Rec** | 0.8 | Often limited focus on baseball specifically |
| **Nonprofit** | 0.6 | Varies widely; moderate baseline |

---

## Cost Multipliers

Program cost affects the magnitude of the reduction.

| Cost | Multiplier | Impact |
|------|-----------|--------|
| **Free** | 1.0 | Full reduction impact |
| **Low-cost** | 0.8 | 80% of full impact |
| **Paid** | 0.5 | 50% of full impact |

---

## Distance Decay

Programs closer to a neighborhood center have greater impact on reducing its need score.

```
Distance Factor = max(0.5, 1 - (distance / maxDistance))
```

- **Default max distance**: 5 miles
- **At 0 miles** (neighborhood center): factor = 1.0 (100% impact)
- **At 2.5 miles** (halfway): factor = 0.75 (75% impact)
- **At 5 miles** (boundary): factor = 0.5 (50% impact)
- **Beyond 5 miles**: program not considered

### Example Calculation

For a neighborhood with no existing programs:
```
Neighborhood: Hegenberger/Coliseum (94621)
Base Score: 6.70
Org Coverage Reduction: 0
Adjusted Score: 6.70 (unchanged)
```

For a neighborhood served by RBI + Little League:
```
Neighborhood: Downtown Hayward (94541)
Base Score: 3.30

Nearby Programs (within 5 miles):
  1. RBI program, free, 1.2 miles away
     Impact = 2.0 × 1.0 × 0.76 = 1.52

  2. Little League, low-cost, 2.8 miles away
     Impact = 1.5 × 0.8 × 0.44 = 0.53

Total Org Coverage Reduction: min(1.52 + 0.53, 3.0) = 2.05

Adjusted Score: 3.30 - 2.05 = 1.25
```

---

## Usage in Code

### Option 1: Get a Single Adjusted Neighborhood

```typescript
import { neighborhoods, programs, getAdjustedNeighborhood } from '@/lib/data';

// Get one neighborhood with adjusted scores
const hood = neighborhoods.find(n => n.id === 'hegenberger-coliseum');
const adjusted = getAdjustedNeighborhood(hood, programs);

console.log(`Original need score: ${adjusted.needScore}`);
console.log(`Adjusted need score: ${adjusted.adjustedNeedScore}`);
console.log(`Org coverage reduction: ${adjusted.orgCoverageReduction}`);
console.log(`Nearby programs:`);
adjusted.nearbyPrograms.forEach(p => {
  console.log(`  - ${p.programName} (${p.orgType}, ${p.distanceMiles}mi away)`);
  console.log(`    Impact: ${p.coverageImpact.toFixed(3)}`);
});
```

### Option 2: Get All Adjusted Neighborhoods (Sorted by Adjusted Need)

```typescript
import { programs, getAllAdjustedNeighborhoods } from '@/lib/data';

const adjusted = getAllAdjustedNeighborhoods(programs)
  .sort((a, b) => b.adjustedNeedScore - a.adjustedNeedScore);

// Top 5 highest-need neighborhoods (accounting for existing programs)
adjusted.slice(0, 5).forEach(hood => {
  console.log(`${hood.name}: ${hood.adjustedNeedScore.toFixed(2)}`);
});
```

### Option 3: Calculate Coverage for a Specific Neighborhood

```typescript
import { neighborhoods, programs, findNearbyPrograms } from '@/lib/data';

const hood = neighborhoods[0];
const coverages = findNearbyPrograms(hood, programs, 5); // 5-mile radius

coverages.forEach(cov => {
  console.log(`${cov.programName}`);
  console.log(`  Type: ${cov.orgType}`);
  console.log(`  Cost: ${cov.cost}`);
  console.log(`  Distance: ${cov.distanceMiles} miles`);
  console.log(`  Impact: ${cov.coverageImpact.toFixed(3)} points`);
});
```

---

## Running the Project

### Prerequisites

Ensure you have Node.js 16+ installed. Check:
```bash
node --version  # Should be v16.0.0 or higher
npm --version   # Should be 7.0.0 or higher
```

### Installation & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   This starts:
   - **Frontend** (Vite): `http://localhost:5173`
   - **Backend** (Node): `http://localhost:3000`
   
   The dev server watches for file changes and hot-reloads automatically.

3. **Open in browser**:
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

This creates optimized bundles in:
- `client/dist/` — frontend assets
- `server/` — backend (runs as-is)

### Environment Variables

If needed, create `.env` files:

**`.env.local`** (root):
```
VITE_API_URL=http://localhost:3000
```

**`.env`** (server, if applicable):
```
PORT=3000
NODE_ENV=development
```

---

## Integration Points

### If You're Using Neighborhoods in UI Components

Update any component that displays neighborhoods to use adjusted scores:

**Before:**
```tsx
<p>Need Score: {neighborhood.needScore.toFixed(2)}</p>
```

**After:**
```tsx
import { getAdjustedNeighborhood } from '@/lib/data';

const adjusted = getAdjustedNeighborhood(neighborhood, programs);
<p>Need Score: {adjusted.adjustedNeedScore.toFixed(2)}</p>
<p>Org Coverage Reduction: -{adjusted.orgCoverageReduction.toFixed(2)}</p>
{adjusted.nearbyPrograms.length > 0 && (
  <details>
    <summary>Nearby Programs ({adjusted.nearbyPrograms.length})</summary>
    <ul>
      {adjusted.nearbyPrograms.map(prog => (
        <li key={prog.programId}>{prog.programName} ({prog.orgType})</li>
      ))}
    </ul>
  </details>
)}
```

### For Sorting & Ranking

```tsx
// OLD: Sort by original score
const sorted = neighborhoods.sort((a, b) => b.needScore - a.needScore);

// NEW: Sort by adjusted score
import { getAllAdjustedNeighborhoods } from '@/lib/data';

const adjusted = getAllAdjustedNeighborhoods(programs);
const sorted = adjusted.sort((a, b) => b.adjustedNeedScore - a.adjustedNeedScore);
```

---

## Testing the New Scoring

### Quick Test Script

Create `test-scoring.mjs` in the root:

```javascript
import { neighborhoods, programs, getAllAdjustedNeighborhoods } from './client/src/lib/data.ts';

console.log('=== Scoring Comparison ===\n');

const adjusted = getAllAdjustedNeighborhoods(programs);

// Show impact on top-5 neighborhoods
adjusted.slice(0, 5).forEach((hood, i) => {
  const reduction = hood.needScore - hood.adjustedNeedScore;
  console.log(`${i + 1}. ${hood.name}`);
  console.log(`   Original:  ${hood.needScore.toFixed(2)}`);
  console.log(`   Adjusted:  ${hood.adjustedNeedScore.toFixed(2)}`);
  console.log(`   Reduction: ${reduction.toFixed(2)} (${hood.nearbyPrograms.length} programs)`);
  console.log('');
});

console.log('=== Programs Breakdown ===\n');

programs.forEach(prog => {
  console.log(`${prog.name}`);
  console.log(`  Type: ${prog.orgType}, Cost: ${prog.cost}`);
  console.log(`  Location: ${prog.city}`);
  console.log('');
});
```

Run it:
```bash
node test-scoring.mjs
```

---

## Key Behavior Changes

| Scenario | Old Behavior | New Behavior |
|----------|--------------|--------------|
| Area with no programs | Score = base | Score = base (unchanged) |
| Area with 1 nearby RBI | Score = base | Score = base - ~1.5 |
| Area with 2 Little Leagues | Score = base | Score = base - ~2.0 |
| Area with RBI + LL + Parks & Rec | Score = base | Score = base - ~2.8 to 3.0 (capped) |

---

## Modifying Weights

To adjust the weighting, edit the `findNearbyPrograms()` function in `data.ts`:

```typescript
const orgTypeWeights: Record<Program['orgType'], number> = {
  rbi: 2.0,           // ← Increase to make RBI programs more impactful
  'little-league': 1.5,
  'parks-rec': 0.8,   // ← Increase if Parks & Rec should count more
  nonprofit: 0.6,
};

const costMultipliers: Record<Program['cost'], number> = {
  free: 1.0,
  'low-cost': 0.8,    // ← Increase if low-cost should be weighted closer to free
  paid: 0.5,
};
```

Then restart the dev server:
```bash
npm run dev
```

---

## FAQ

**Q: Why is the org coverage capped at 3 points?**
A: To ensure neighborhoods with very high need (high SVI, low infrastructure) never score below ~3–4 even with heavy program coverage. This preserves meaningful differentiation for deployment prioritization.

**Q: What if a program is listed but not confirmed active?**
A: Use the `Program.status` field. Update `findNearbyPrograms()` to filter: `.filter(p => p.status === 'confirmed-active')` if desired.

**Q: How do I add a new program?**
A: Add it to the `programs` array in `data.ts`. The adjusted scores will automatically include it on the next calculation.

**Q: Can I customize the search radius per neighborhood?**
A: Yes. Modify `findNearbyPrograms(neighborhood, programs, 5)` — change the `5` parameter to your desired miles.

---

## Files Changed

- **`client/src/lib/data.ts`**: Added new interfaces (`OrgCoverage`, `AdjustedNeighborhood`) and functions (`findNearbyPrograms`, `calculateOrgCoverageReduction`, `calculateAdjustedNeedScore`, `getAdjustedNeighborhood`, `getAllAdjustedNeighborhoods`).
- **Header comment**: Updated to describe new formula.

**No breaking changes**. The original `neighborhoods` array and `needScore` fields remain unchanged for backward compatibility.

