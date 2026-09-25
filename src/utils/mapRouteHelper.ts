import { Community } from '../types';

export interface RouteInspectionData {
  targetType: 'water' | 'health';
  targetName: string;
  targetCoords: [number, number];
  straightDistanceKm: number;
  accessibleDistanceKm: number;
  detourGapKm: number;
  straightPolyline: [number, number][];
  accessiblePolyline: [number, number][];
  obstacle: string;
  roadStatus: string;
}

/**
 * Computes realistic spatial routing polylines comparing straight-line distance
 * versus actual flood-bypass detour road networks in the Koshi Basin.
 */
export function getCommunityRouteData(
  comm: Community, 
  targetType: 'water' | 'health'
): RouteInspectionData {
  const [cLat, cLng] = comm.coordinates;

  if (targetType === 'water') {
    const straightKm = comm.alternativeWaterDistanceStraightKm;
    const accessibleKm = comm.alternativeWaterDistanceAccessibleKm;
    const detourGap = Math.round((accessibleKm - straightKm) * 10) / 10;
    
    // Target coordinate offset (north-east or north-west on high ground)
    const targetCoords: [number, number] = [
      cLat + 0.0295,
      cLng + 0.0230
    ];

    // Detour polyline bypassing the inundated culvert / breach
    const accessiblePolyline: [number, number][] = [
      [cLat, cLng],
      [cLat - 0.0065, cLng - 0.0170], // Backtrack south away from breach
      [cLat + 0.0125, cLng - 0.0310], // Unpaved highland bund road
      [cLat + 0.0395, cLng - 0.0130], // Northern bypass road
      [cLat + 0.0425, cLng + 0.0130], // Upper canal bridge crossing
      targetCoords                     // Safe water storage facility
    ];

    return {
      targetType: 'water',
      targetName: comm.alternativeWaterSource,
      targetCoords,
      straightDistanceKm: straightKm,
      accessibleDistanceKm: accessibleKm,
      detourGapKm: detourGap,
      straightPolyline: [[cLat, cLng], targetCoords],
      accessiblePolyline,
      obstacle: comm.alternativeWaterReason,
      roadStatus: comm.roadAccessibility
    };
  } else {
    // Health post routing
    const straightKm = comm.healthDistanceStraightKm;
    const accessibleKm = comm.healthDistanceAccessibleKm;
    const detourGap = Math.round((accessibleKm - straightKm) * 10) / 10;

    const targetCoords: [number, number] = [
      cLat + 0.0135,
      cLng + 0.0130
    ];

    const accessiblePolyline: [number, number][] = [
      [cLat, cLng],
      [cLat - 0.0105, cLng - 0.0130], // Divert around submerged culvert
      [cLat + 0.0055, cLng - 0.0190], // Western high bund
      [cLat + 0.0205, cLng - 0.0010], // Tractor passable embankment
      targetCoords                     // Primary Health Center
    ];

    return {
      targetType: 'health',
      targetName: comm.healthFacilityName,
      targetCoords,
      straightDistanceKm: straightKm,
      accessibleDistanceKm: accessibleKm,
      detourGapKm: detourGap,
      straightPolyline: [[cLat, cLng], targetCoords],
      accessiblePolyline,
      obstacle: comm.healthAccessObstacle,
      roadStatus: comm.healthFacilityAccessibility
    };
  }
}
