
"use client";

import { OverviewCard } from '@/components/dashboard/overview-card';
import { PendingCasesChart } from '@/components/dashboard/pending-cases-chart';
import { JudgeWorkloadChart } from '@/components/dashboard/judge-workload-chart';
import { FilingsVsResolutionsChart } from '@/components/dashboard/filings-vs-resolutions-chart';
import { Activity, CheckCircle2, FileText, Hourglass, LayoutDashboard, Filter, Percent, TrendingUp, Clock, Landmark } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarGroup } from '@/components/ui/sidebar';

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

export default function DashboardPage() {
  const totalFiled = 1250;
  const totalResolved = 980;
  const totalPending = Math.max(0, totalFiled - totalResolved);
  const averageResolutionTime = '45 days';
  const clearanceRate = totalFiled > 0 ? ((totalResolved / totalFiled) * 100).toFixed(1) + '%' : 'N/A';

  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("all");
  const [selectedCourtRank, setSelectedCourtRank] = useState<string>("all");
  const [selectedCourtName, setSelectedCourtName] = useState<string>("all");
  const [specificCourts, setSpecificCourts] = useState<{ name: string; value: string }[]>([]);

  useEffect(() => {
    if (selectedCourtRank !== "all" && courtData[selectedCourtRank]) {
      setSpecificCourts(courtData[selectedCourtRank]);
    } else {
      setSpecificCourts([]);
    }
    // Reset specific court name when rank changes, unless it's the initial load or rank is 'all'
    if (selectedCourtRank !== "all") {
        // Check if current selectedCourtName is valid for the new rank
        const isValidCourtName = courtData[selectedCourtRank]?.some(court => court.value === selectedCourtName);
        if (!isValidCourtName) {
            setSelectedCourtName("all");
        }
    } else {
         setSelectedCourtName("all");
    }
  }, [selectedCourtRank]);


  const handleCourtRankChange = (value: string) => {
    setSelectedCourtRank(value);
    // setSelectedCourtName("all"); // Reset specific court name when rank changes is handled by useEffect
  };


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <Filter className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary whitespace-nowrap">Filters</h2>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4 space-y-6">
          <SidebarGroup>
            <div className="space-y-1">
              <Label htmlFor="timeFilter" className="text-sm font-medium text-muted-foreground group-data-[collapsible=icon]:sr-only">Time Period</Label>
              <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                <SelectTrigger id="timeFilter" className="w-full rounded-md border-input shadow-sm group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
                  <Clock className="h-4 w-4 hidden group-data-[collapsible=icon]:block" />
                  <SelectValue placeholder="Select period" className="group-data-[collapsible=icon]:hidden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SidebarGroup>
          <SidebarGroup>
            <div className="space-y-1">
              <Label htmlFor="courtRankFilter" className="text-sm font-medium text-muted-foreground group-data-[collapsible=icon]:sr-only">Court Rank</Label>
              <Select value={selectedCourtRank} onValueChange={handleCourtRankChange}>
                <SelectTrigger id="courtRankFilter" className="w-full rounded-md border-input shadow-sm group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
                  <Landmark className="h-4 w-4 hidden group-data-[collapsible=icon]:block" />
                  <SelectValue placeholder="Select rank" className="group-data-[collapsible=icon]:hidden"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  <SelectItem value="supreme">Supreme Court</SelectItem>
                  <SelectItem value="high">High Court</SelectItem>
                  <SelectItem value="district">District Court</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SidebarGroup>
          {selectedCourtRank !== "all" && specificCourts.length > 0 && (
            <SidebarGroup>
              <div className="space-y-1">
                <Label htmlFor="courtNameFilter" className="text-sm font-medium text-muted-foreground group-data-[collapsible=icon]:sr-only">Specific Court</Label>
                <Select value={selectedCourtName} onValueChange={setSelectedCourtName} disabled={specificCourts.length === 0}>
                  <SelectTrigger id="courtNameFilter" className="w-full rounded-md border-input shadow-sm group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
                     <Landmark className="h-4 w-4 hidden group-data-[collapsible=icon]:block opacity-70" />
                     <SelectValue placeholder="Select court" className="group-data-[collapsible=icon]:hidden"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specific Courts</SelectItem>
                    {specificCourts.map(court => (
                      <SelectItem key={court.value} value={court.value}>{court.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" /> {/* Mobile trigger */}
                <LayoutDashboard className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-primary">
                  CourtFlow Dashboard
                </h1>
              </div>
              <SidebarTrigger className="hidden md:flex" /> {/* Desktop trigger */}
            </div>
            <p className="text-muted-foreground mt-1">Key court performance metrics overview.</p>
          </header>

          <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <OverviewCard 
              title="Total Filed Cases" 
              value={totalFiled.toLocaleString()} 
              icon={<FileText className="h-5 w-5 text-primary" />} 
              description="All cases entered into the system." 
            />
            <OverviewCard 
              title="Total Resolved Cases" 
              value={totalResolved.toLocaleString()} 
              icon={<CheckCircle2 className="h-5 w-5 text-[hsl(var(--chart-2))]" />} 
              description="Cases successfully concluded."
              valueClassName="text-[hsl(var(--chart-2))]"
            />
            <OverviewCard 
              title="Total Pending Cases" 
              value={totalPending.toLocaleString()} 
              icon={<Hourglass className="h-5 w-5 text-accent" />} 
              description="Cases currently awaiting resolution."
              valueClassName="text-accent"
            />
            <OverviewCard 
              title="Avg. Resolution Time" 
              value={averageResolutionTime} 
              icon={<Activity className="h-5 w-5 text-[hsl(var(--chart-4))]" />} 
              description="Average time to resolve cases."
              valueClassName="text-[hsl(var(--chart-4))]"
            />
            <OverviewCard
                title="Clearance Rate"
                value={clearanceRate}
                icon={<Percent className="h-5 w-5 text-green-600" />}
                description="Percentage of filed cases resolved."
                valueClassName="text-green-600"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FilingsVsResolutionsChart selectedTimePeriod={selectedTimePeriod} selectedCourtRank={selectedCourtRank} selectedCourtName={selectedCourtName} />
            <PendingCasesChart selectedTimePeriod={selectedTimePeriod} selectedCourtRank={selectedCourtRank} selectedCourtName={selectedCourtName} />
            <JudgeWorkloadChart selectedTimePeriod={selectedTimePeriod} selectedCourtRank={selectedCourtRank} selectedCourtName={selectedCourtName} />
          </section>

          <footer className="mt-12 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CourtFlow. All rights reserved.</p>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
