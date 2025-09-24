/**
 * Dashboard Filters Hook
 * 
 * Manages filter state and court data for the dashboard
 */

'use client';

import { useState, useEffect } from 'react';

export interface CourtOption {
  name: string;
  value: string;
}

export interface DashboardFilters {
  selectedTimePeriod: string;
  selectedCourtRank: string;
  selectedCourtName: string;
}

// Mock court data - in real app this would come from API
const courtData: { [key: string]: CourtOption[] } = {
  supreme: [
    { name: "Supreme Court Alpha", value: "supreme-alpha" },
    { name: "Supreme Court Beta", value: "supreme-beta" }
  ],
  high: [
    { name: "High Court of State A", value: "high-a" },
    { name: "High Court of State B", value: "high-b" },
    { name: "High Court of State C", value: "high-c" }
  ],
  district: [
    { name: "District Court - Region 1", value: "district-1" },
    { name: "District Court - Region 2", value: "district-2" }
  ],
};

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>({
    selectedTimePeriod: "all",
    selectedCourtRank: "all",
    selectedCourtName: "all",
  });
  
  const [specificCourts, setSpecificCourts] = useState<CourtOption[]>([]);

  // Update specific courts when court rank changes
  useEffect(() => {
    if (filters.selectedCourtRank !== "all" && courtData[filters.selectedCourtRank]) {
      setSpecificCourts(courtData[filters.selectedCourtRank]);
    } else {
      setSpecificCourts([]);
    }
    
    // Reset court name if it's not valid for the new rank
    if (filters.selectedCourtRank !== "all") {
      const isValidCourtName = courtData[filters.selectedCourtRank]?.some(
        court => court.value === filters.selectedCourtName
      );
      if (!isValidCourtName) {
        setFilters(prev => ({ ...prev, selectedCourtName: "all" }));
      }
    } else {
      setFilters(prev => ({ ...prev, selectedCourtName: "all" }));
    }
  }, [filters.selectedCourtRank, filters.selectedCourtName]);

  // Filter update functions
  const updateTimePeriod = (period: string) => {
    setFilters(prev => ({ ...prev, selectedTimePeriod: period }));
  };

  const updateCourtRank = (rank: string) => {
    setFilters(prev => ({ ...prev, selectedCourtRank: rank }));
  };

  const updateCourtName = (name: string) => {
    setFilters(prev => ({ ...prev, selectedCourtName: name }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      selectedTimePeriod: "all",
      selectedCourtRank: "all",
      selectedCourtName: "all",
    });
  };

  // Get filter summary for display
  const getFilterSummary = () => {
    const activeParts: string[] = [];
    
    if (filters.selectedTimePeriod !== "all") {
      const periodLabels: { [key: string]: string } = {
        last30: "Last 30 days",
        last90: "Last 90 days",
        lastYear: "Last year",
      };
      activeParts.push(periodLabels[filters.selectedTimePeriod] || filters.selectedTimePeriod);
    }
    
    if (filters.selectedCourtRank !== "all") {
      activeParts.push(`Court: ${filters.selectedCourtRank}`);
    }
    
    if (filters.selectedCourtName !== "all") {
      const court = specificCourts.find(c => c.value === filters.selectedCourtName);
      if (court) {
        activeParts.push(`Specific: ${court.name}`);
      }
    }
    
    return activeParts.length > 0 ? activeParts.join(", ") : "All data";
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.selectedTimePeriod !== "all" || 
           filters.selectedCourtRank !== "all" || 
           filters.selectedCourtName !== "all";
  };

  return {
    filters,
    specificCourts,
    updateTimePeriod,
    updateCourtRank,
    updateCourtName,
    resetFilters,
    getFilterSummary,
    hasActiveFilters,
    
    // For backward compatibility with existing component
    selectedTimePeriod: filters.selectedTimePeriod,
    selectedCourtRank: filters.selectedCourtRank,
    selectedCourtName: filters.selectedCourtName,
    setSelectedTimePeriod: updateTimePeriod,
    setSelectedCourtRank: updateCourtRank,
    setSelectedCourtName: updateCourtName,
  };
}