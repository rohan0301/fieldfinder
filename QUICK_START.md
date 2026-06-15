# Quick Start: New Scoring System

## What Changed

The neighborhood scoring now factors in **organizational presence** to reduce need scores. Areas with good program coverage have lower "need" because they're already served.

```
OLD: Score = (SVI × 0.5) + (Fields/18 × 0.25) + (B&GC/18 × 0.25) × 10

NEW: Score = [(SVI × 0.4) + (Fields/18 × 0.2) + (B&GC/18 × 0.2) × 10] - Org Reduction
   └─ Org Reduction is 0–3 points based on nearby program quality/cost/distance
```

## Run the Project

### 1. Start Development Server
```bash
npm run dev
```

Opens:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### 2. Build for Production
```bash
npm run build
```

### 3. Verify Code Compiles
```bash
npm run check
```

## Use in Your Code

### Get adjusted scores for all neighborhoods:
```typescript
import { programs, getAllAdjustedNeighborhoods } from '@/lib/data';

const adjusted = getAllAdjustedNeighborhoods(programs)
  .sort((a, b) => b.adjustedNeedScore - a.adjustedNeedScore);

adjusted.forEach(hood => {
  console.log(`${hood.name}: ${hood.adjustedNeedScore.toFixed(2)}`);
  console.log(`  Org Coverage Reduction: ${hood.orgCoverageReduction.toFixed(2)}`);
  console.log(`  Nearby Programs: ${hood.nearbyPrograms.length}`);
});
```

### Get a single adjusted neighborhood:
```typescript
import { getAdjustedNeighborhood } from '@/lib/data';

const hood = neighborhoods.find(n => n.id === 'hegenberger-coliseum');
const adjusted = getAdjustedNeighborhood(hood, programs);

console.log(adjusted.adjustedNeedScore);        // e.g., 6.70
console.log(adjusted.orgCoverageReduction);     // e.g., 0.00 (no nearby programs)
console.log(adjusted.nearbyPrograms);           // e.g., []
```

### See programs near a neighborhood:
```typescript
import { findNearbyPrograms } from '@/lib/data';

const programs = findNearbyPrograms(neighborhood, allPrograms, 5); // 5 miles

programs.forEach(prog => {
  console.log(`${prog.programName}`);
  console.log(`  Type: ${prog.orgType}`);       // rbi | little-league | parks-rec | nonprofit
  console.log(`  Cost: ${prog.cost}`);          // free | low-cost | paid
  console.log(`  Distance: ${prog.distanceMiles} miles`);
  console.log(`  Impact: ${prog.coverageImpact.toFixed(3)} points`);
});
```

## Organization Weights

| Type | Weight | Reason |
|------|--------|--------|
| **RBI** | 2.0 | Best: comprehensive, free, underserved focus |
| **Little League** | 1.5 | Traditional, established |
| **Parks & Rec** | 0.8 | Partial focus on baseball |
| **Nonprofit** | 0.6 | Variable quality |

**Cost Multipliers**: Free (1.0) > Low-cost (0.8) > Paid (0.5)

## Key Functions (in `client/src/lib/data.ts`)

```typescript
// Get one neighborhood with adjusted scores + nearby programs
getAdjustedNeighborhood(neighborhood, programs)

// Get all neighborhoods sorted by adjusted need
getAllAdjustedNeighborhoods(programs)

// Find programs within radius of a neighborhood
findNearbyPrograms(neighborhood, programs, maxDistanceMiles?)

// Calculate org coverage reduction manually
calculateOrgCoverageReduction(neighborhood, programs)

// Calculate adjusted score manually
calculateAdjustedNeedScore(svi, fields, bgc, orgReduction)
```

## Full Documentation

See **[SCORING_GUIDE.md](./SCORING_GUIDE.md)** for:
- Detailed formula explanation
- Distance decay algorithm
- Example calculations
- Component integration examples
- Weight customization

## Testing

To see the scoring in action:

1. **In DevTools Console** (browser):
```javascript
import { programs, getAllAdjustedNeighborhoods } from '/src/lib/data.ts';
const adj = getAllAdjustedNeighborhoods(programs);
console.table(adj.slice(0, 5).map(n => ({
  name: n.name,
  original: n.needScore.toFixed(2),
  adjusted: n.adjustedNeedScore.toFixed(2),
  reduction: n.orgCoverageReduction.toFixed(2)
})));
```

2. **Or update a UI component** to display both scores:
```tsx
<div>
  <p>Original Score: {neighborhood.needScore.toFixed(2)}</p>
  <p>With Org Coverage: {adjusted.adjustedNeedScore.toFixed(2)}</p>
  <details>
    <summary>Programs ({adjusted.nearbyPrograms.length})</summary>
    <ul>
      {adjusted.nearbyPrograms.map(p => (
        <li key={p.programId}>{p.programName} ({p.orgType})</li>
      ))}
    </ul>
  </details>
</div>
```

## Backwards Compatibility

✅ **No breaking changes**. The original `neighborhoods` array and `needScore` fields are unchanged. New functions work alongside existing code.

---

**Questions?** See `SCORING_GUIDE.md` for FAQ, detailed calculations, and advanced usage.
