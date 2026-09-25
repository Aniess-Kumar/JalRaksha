import { Community, PriorityWeights, PriorityCategory } from '../types';

export const DEFAULT_WEIGHTS: PriorityWeights = {
  floodExposure: 25,
  washDisruption: 25,
  populationExposure: 20,
  roadAccessibility: 15,
  healthAccessibility: 15,
};

export interface FactorBreakdown {
  floodFactor: number; // 0 - 100
  washFactor: number; // 0 - 100
  populationFactor: number; // 0 - 100
  accessibilityFactor: number; // 0 - 100
  healthFactor: number; // 0 - 100
  weightedScore: number; // 0 - 100
  category: PriorityCategory;
  reasons: string[];
}

export function calculateCommunityPriority(
  community: Community,
  weights: PriorityWeights = DEFAULT_WEIGHTS
): FactorBreakdown {
  // 1. Flood Exposure Factor (0 - 1.0)
  let floodFactor = 0.2;
  if (community.floodExposure === 'CRITICAL') {
    floodFactor = 0.95;
  } else if (community.floodExposure === 'HIGH') {
    floodFactor = 0.75;
  } else if (community.floodExposure === 'MODERATE') {
    floodFactor = 0.45;
  } else {
    floodFactor = 0.20;
  }
  // Adjust with inundation area percentage
  floodFactor = Math.min(1.0, floodFactor * 0.7 + (community.inundatedAreaPct / 100) * 0.3);

  // 2. WASH Disruption Factor (0 - 1.0)
  let washFactor = 0.2;
  if (community.mainWaterStatus === 'Submerged' || community.mainWaterStatus === 'Contaminated') {
    washFactor = 0.95;
  } else if (community.mainWaterStatus === 'Potentially Disrupted') {
    washFactor = 0.80;
  } else if (community.mainWaterStatus === 'Partially Functional') {
    washFactor = 0.50;
  } else {
    washFactor = 0.15;
  }
  if (community.sanitationAffected) {
    washFactor = Math.min(1.0, washFactor + 0.15);
  }

  // 3. Population Exposure Factor (0 - 1.0)
  // Max benchmark population 3,200 for 1.0
  const populationFactor = Math.min(1.0, community.exposedPopulation / 3000);

  // 4. Road Accessibility Difficulty Factor (0 - 1.0)
  let roadFactor = 0.2;
  if (community.roadAccessibility === 'SEVERELY DISRUPTED' || community.roadAccessibility === 'INACCESSIBLE') {
    roadFactor = 0.95;
  } else if (community.roadAccessibility === 'LIMITED') {
    roadFactor = 0.60;
  } else {
    roadFactor = 0.15;
  }
  // Detour gap penalty: difference between accessible road distance and straight line
  const detourGap = Math.max(0, community.alternativeWaterDistanceAccessibleKm - community.alternativeWaterDistanceStraightKm);
  const detourPenalty = Math.min(0.2, (detourGap / 10.0) * 0.2);
  const accessibilityFactor = Math.min(1.0, roadFactor * 0.85 + detourPenalty);

  // 5. Health Facility Accessibility Factor (0 - 1.0)
  let healthFactor = 0.2;
  if (community.healthFacilityAccessibility === 'INACCESSIBLE' || community.healthFacilityAccessibility === 'SEVERELY DISRUPTED') {
    healthFactor = 0.95;
  } else if (community.healthFacilityAccessibility === 'LIMITED') {
    healthFactor = 0.65;
  } else {
    healthFactor = 0.15;
  }

  // Combine normalized factors
  const totalWeight =
    weights.floodExposure +
    weights.washDisruption +
    weights.populationExposure +
    weights.roadAccessibility +
    weights.healthAccessibility || 100;

  const wFlood = weights.floodExposure / totalWeight;
  const wWash = weights.washDisruption / totalWeight;
  const wPop = weights.populationExposure / totalWeight;
  const wAccess = weights.roadAccessibility / totalWeight;
  const wHealth = weights.healthAccessibility / totalWeight;

  const rawScore =
    (floodFactor * wFlood +
      washFactor * wWash +
      populationFactor * wPop +
      accessibilityFactor * wAccess +
      healthFactor * wHealth) *
    100;

  const weightedScore = Math.round(rawScore * 10) / 10;

  let category: PriorityCategory = 'LOW';
  if (weightedScore >= 75) {
    category = 'CRITICAL';
  } else if (weightedScore >= 55) {
    category = 'HIGH';
  } else if (weightedScore >= 35) {
    category = 'MODERATE';
  } else {
    category = 'LOW';
  }

  // Transparent interpretability breakdown
  const reasons: string[] = [];
  if (floodFactor >= 0.7) {
    reasons.push(`High flood exposure: ${community.inundatedAreaPct}% area inundated (depth ${community.floodDepthMeters}m)`);
  }
  if (washFactor >= 0.7) {
    reasons.push(`Main water source: ${community.mainWaterStatus.toLowerCase()} (${community.mainWaterSource})`);
  }
  if (community.sanitationAffected) {
    reasons.push('Sanitation facilities submerged or overflowing with biological contagion risk');
  }
  if (populationFactor >= 0.6) {
    reasons.push(`Large exposed population: ${community.exposedPopulation.toLocaleString()} people affected`);
  }
  if (accessibilityFactor >= 0.6) {
    reasons.push(
      `Road accessibility: ${community.roadAccessibility.toLowerCase().replace('_', ' ')} (${community.alternativeWaterDistanceAccessibleKm} km detour vs ${community.alternativeWaterDistanceStraightKm} km straight-line)`
    );
  }
  if (healthFactor >= 0.6) {
    reasons.push(`Health facility access restricted: ${community.healthFacilityName} is ${community.healthFacilityAccessibility.toLowerCase()}`);
  }
  if (reasons.length === 0) {
    reasons.push('Moderate flood impact with functional local emergency buffer');
  }

  return {
    floodFactor: Math.round(floodFactor * 100),
    washFactor: Math.round(washFactor * 100),
    populationFactor: Math.round(populationFactor * 100),
    accessibilityFactor: Math.round(accessibilityFactor * 100),
    healthFactor: Math.round(healthFactor * 100),
    weightedScore,
    category,
    reasons,
  };
}

export function recalculateAllCommunities(
  communities: Community[],
  weights: PriorityWeights
): Community[] {
  return communities.map((comm) => {
    const result = calculateCommunityPriority(comm, weights);
    return {
      ...comm,
      priorityScore: result.weightedScore,
      priorityCategory: result.category,
      keyReasons: result.reasons,
    };
  });
}
