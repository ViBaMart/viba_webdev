import {
  AGENCY_CONFIG,
  AGENCY_METRICS,
  AGENCY_PROCESS,
  AGENCY_SERVICES,
} from "@/config/agency";
import { getEnvironmentDiagnostics } from "@/config/env";

export function getAgencyOverview() {
  return {
    agency: AGENCY_CONFIG,
    metrics: AGENCY_METRICS,
    services: AGENCY_SERVICES,
    process: AGENCY_PROCESS,
  };
}

export function getPlatformHealth() {
  const diagnostics = getEnvironmentDiagnostics();
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "ViBa WebDevloper Core API",
    domain: AGENCY_CONFIG.domain,
    version: "1.0.0",
    diagnostics,
  };
}

