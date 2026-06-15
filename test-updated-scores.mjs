import { neighborhoods, programs, getAllAdjustedNeighborhoods } from './client/src/lib/data.ts';

console.log('🎯 UPDATED SCORING — Base Score vs Adjusted Score\n');
console.log('═'.repeat(100));

const adjusted = getAllAdjustedNeighborhoods(programs)
  .sort((a, b) => b.needScore - a.needScore);

console.log('\nTop 15 neighborhoods:\n');
console.log('Rank │ Neighborhood                          │ Base  │ Reduction │ Adjusted │ Status');
console.log('─'.repeat(100));

adjusted.slice(0, 15).forEach((n, i) => {
  const hasOrgs = n.nearbyPrograms.length > 0;
  const status = hasOrgs ? `${n.nearbyPrograms.length} org(s)` : 'NO ORGS';
  const reduction = n.orgCoverageReduction.toFixed(2);
  const base = n.needScore.toFixed(2);
  const adjusted_score = n.adjustedNeedScore.toFixed(2);

  console.log(
    `${String(i + 1).padStart(2)}   │ ${n.name.padEnd(37)} │ ${base.padStart(4)} │ ${reduction.padStart(8)} │ ${adjusted_score.padStart(7)} │ ${status}`
  );
});

console.log('\n' + '═'.repeat(100));
console.log('\nKey changes:');
console.log('✓ Base scores preserved (50/25/25 weights) — areas with low infrastructure stay low');
console.log('✓ Org reduction capped at 1.5 — even strong orgs only reduce score by ~1.5 max');
console.log('✓ Areas with NO nearby orgs keep full score — better reflects true need');
console.log('\nExample: Hegenberger/Coliseum (94621)');

const heg = adjusted.find(n => n.id === 'hegenberger-coliseum');
if (heg) {
  console.log(`  Base:        ${heg.needScore.toFixed(2)}/10 (high infrastructure + SVI)`);
  console.log(`  Orgs nearby: ${heg.nearbyPrograms.length} program(s)`);
  heg.nearbyPrograms.slice(0, 2).forEach(p => {
    console.log(`    - ${p.programName} (${p.orgType}, ${p.cost}, ${p.distanceMiles.toFixed(2)} mi)`);
  });
  console.log(`  Reduction:   ${heg.orgCoverageReduction.toFixed(2)} (capped at 1.5 max)`);
  console.log(`  Adjusted:    ${heg.adjustedNeedScore.toFixed(2)}/10 ← reasonable score, org impact visible`);
}
