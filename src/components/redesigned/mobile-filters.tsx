"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from '@/components/ui/card';

interface MobileFiltersProps {
  selectedTimePeriod: string;
  setSelectedTimePeriod: (value: string) => void;
  selectedCourtRank: string;
  setSelectedCourtRank: (value: string) => void;
  selectedCourtName: string;
  setSelectedCourtName: (value: string) => void;
  specificCourts: { name: string; value: string }[];
}

const courtData: { [key: string]: { name: string; value: string }[] } = {
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

export function MobileFilters({
  selectedTimePeriod,
  setSelectedTimePeriod,
  selectedCourtRank,
  setSelectedCourtRank,
  selectedCourtName,
  setSelectedCourtName,
  specificCourts
}: MobileFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const timePeriodSelectRef = useRef<HTMLButtonElement>(null);

  const handleCourtRankChange = (value: string) => {
    setSelectedCourtRank(value);
    // Reset specific court when rank changes
    setSelectedCourtName("all");
  };

  // Focus management for accessibility
  useEffect(() => {
    if (isExpanded && timePeriodSelectRef.current) {
      // Focus the first interactive element when expanded
      timePeriodSelectRef.current.focus();
    } else if (!isExpanded && expandButtonRef.current) {
      // Return focus to the expand button when collapsed
      expandButtonRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <Card 
      className="mb-6 border border-border rounded-lg shadow-sm"
      role="region"
      aria-labelledby="filters-heading"
    >
      <Button
        ref={expandButtonRef}
        variant="ghost"
        className="w-full justify-between p-4 h-auto"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="mobile-filters-content"
        id="filters-heading"
      >
        <span className="font-medium">Filters</span>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>
      
      {isExpanded && (
        <CardContent 
          id="mobile-filters-content"
          className="pt-0 pb-4"
          role="group"
          aria-label="Filter options"
        >
          <div className="space-y-4 pt-2">
            {/* Time Period Filter */}
            <div className="space-y-2">
              <Label htmlFor="timeFilter" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Time Period
              </Label>
              <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                <SelectTrigger 
                  id="timeFilter" 
                  className="w-full rounded-md border-input shadow-sm"
                  ref={timePeriodSelectRef}
                >
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Court Rank Filter */}
            <div className="space-y-2">
              <Label htmlFor="courtRankFilter" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                Court Rank
              </Label>
              <Select value={selectedCourtRank} onValueChange={handleCourtRankChange}>
                <SelectTrigger id="courtRankFilter" className="w-full rounded-md border-input shadow-sm">
                  <SelectValue placeholder="Select rank"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  <SelectItem value="supreme">Supreme Court</SelectItem>
                  <SelectItem value="high">High Court</SelectItem>
                  <SelectItem value="district">District Court</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specific Court Filter */}
            {selectedCourtRank !== "all" && (
              <div className="space-y-2">
                <Label htmlFor="courtNameFilter" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Landmark className="h-4 w-4 opacity-70" />
                  Specific Court
                </Label>
                <Select 
                  value={selectedCourtName} 
                  onValueChange={setSelectedCourtName} 
                  disabled={specificCourts.length === 0}
                >
                  <SelectTrigger id="courtNameFilter" className="w-full rounded-md border-input shadow-sm">
                    <SelectValue placeholder="Select court"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specific Courts</SelectItem>
                    {specificCourts.map(court => (
                      <SelectItem key={court.value} value={court.value}>{court.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}