/**
 * Quick test to verify new scoring functions work
 * Run with: npx ts-node test-scoring.ts
 */

import { neighborhoods, programs, getAllAdjustedNeighborhoods, getAdjustedNeighborhood, findNearbyPrograms } from './client/src/lib/data';

console.log('🎯 FieldFinder Scoring System Test\n');
console.log('═'.repeat(70));

// Test 1: Get adjusted scores for all neighborhoods
console.log('\n📊 Top 10 Neighborhoods by Original Need Score:');
console.log('─'.repeat(70));

const original = neighborhoods
  .sort((a, b) => b.needScore - a.needScore)
  .slice(0, 10);

original.forEach((n, i) => {
  console.log(`${String(i + 1).padStart(2)}. ${n.name.padEnd(40)} ${n.needScore.toFixed(2)}`);
});

// Test 2: Get adjusted scores
console.log('\n\n🔄 Top 10 Neighborhoods by Adjusted Need Score (with Org Coverage):');
console.log('─'.repeat(70));

const adjusted = getAllAdjustedNeighborhoods(programs)
  .sort((a, b) => b.adjustedNeedScore - a.adjustedNeedScore)
  .slice(0, 10);

adjusted.forEach((n, i) => {
  const delta = (n.needScore - n.adjustedNeedScore).toFixed(2);
  const sign = Number(delta) > 0 ? '-' : ' ';
  console.log(`${String(i + 1).padStart(2)}. ${n.name.padEnd(40)} ${n.adjustedNeedScore.toFixed(2)} (${sign}${Math.abs(Number(delta)).toFixed(2)})`);
});

// Test 3: Show detailed breakdown for one neighborhood
console.log('\n\n📍 Detailed Breakdown Example: Downtown Hayward / Cherryland');
console.log('─'.repeat(70));

const example = neighborhoods.find(n => n.id === 'downtown-hayward');
if (example) {
  const adj = getAdjustedNeighborhood(example, programs);

  console.log(`\nNeighborhood: ${adj.name} (${adj.zipCodes.join(', ')})`);
  console.log(`Location: ${adj.lat.toFixed(4)}, ${adj.lng.toFixed(4)}`);
  console.log(`\n📈 Scoring Components:`);
  console.log(`  SVI Score:                ${adj.sviScore.toFixed(3)} (Social Vulnerability)`);
  console.log(`  Baseball Fields:          ${adj.baseballFieldCount} (normalized by 18)`);
  console.log(`  Boys & Girls Clubs:       ${adj.bgcCount} (normalized by 18)`);
  console.log(`  Free Lunch %:             ${(adj.freeLunchPct * 100).toFixed(1)}%`);

  console.log(`\n📊 Score Calculation:`);
  const baseScore = (adj.sviScore * 0.4 + adj.baseballFieldCount / 18 * 0.2 + adj.bgcCount / 18 * 0.2) * 10;
  console.log(`  Base Score:               ${baseScore.toFixed(2)}`);
  console.log(`  Org Coverage Reduction:   -${adj.orgCoverageReduction.toFixed(2)}`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  ADJUSTED NEED SCORE:      ${adj.adjustedNeedScore.toFixed(2)}`);
  console.log(`  Original (unchanged):     ${adj.needScore.toFixed(2)}`);

  if (adj.nearbyPrograms.length > 0) {
    console.log(`\n🏟️  Nearby Programs (${adj.nearbyPrograms.length} within 5 miles):`);
    adj.nearbyPrograms.forEach((prog, idx) => {
      console.log(`\n  ${idx + 1}. ${prog.programName}`);
      console.log(`     Type: ${prog.orgType.padEnd(15)} | Cost: ${prog.cost}`);
      console.log(`     Distance: ${prog.distanceMiles.toFixed(1)} miles`);
      console.log(`     Impact: ${prog.coverageImpact.toFixed(3)} points`);
    });
  } else {
    console.log('\n🏟️  Nearby Programs: None found within 5 miles');
  }
}

// Test 4: Show neighborhoods that saw the biggest reductions
console.log('\n\n⚡ Neighborhoods with Highest Org Coverage Impact:');
console.log('─'.repeat(70));

const highestImpact = adjusted
  .filter(n => n.orgCoverageReduction > 0)
  .sort((a, b) => b.orgCoverageReduction - a.orgCoverageReduction)
  .slice(0, 5);

highestImpact.forEach((n, i) => {
  const reduction = (n.needScore - n.adjustedNeedScore).toFixed(2);
  const programCount = n.nearbyPrograms.length;
  console.log(`${i + 1}. ${n.name.padEnd(40)} Reduction: ${reduction.padStart(4)} (${programCount} programs)`);
});

console.log('\n' + '═'.repeat(70));
console.log('✅ Scoring system test complete!');
console.log('\nTo use in your app, call:');
console.log('  - getAdjustedNeighborhood(neighborhood, programs)');
console.log('  - getAllAdjustedNeighborhoods(programs)');
console.log('  - findNearbyPrograms(neighborhood, programs, maxDistance?)');
