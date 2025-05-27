
"use client";

import { OverviewCard } from '@/components/dashboard/overview-card';
import { FiledCasesChart } from '@/components/dashboard/filed-cases-chart';
import { ResolvedCasesChart } from '@/components/dashboard/resolved-cases-chart';
import { PendingCasesChart } from '@/components/dashboard/pending-cases-chart';
import { JudgeWorkloadChart } from '@/components/dashboard/judge-workload-chart';
import { Activity, CheckCircle2, FileText, Hourglass, LayoutDashboard, Filter, Percent } from 'lucide-react';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function DashboardPage() {
  const totalFiled = 1250;
  const totalResolved = 980;
  const totalPending = Math.max(0, totalFiled - totalResolved);
  const averageResolutionTime = '45 days';
  const clearanceRate = totalFiled > 0 ? ((totalResolved / totalFiled) * 100).toFixed(1) + '%' : 'N/A';


  const [selectedCaseType, setSelectedCaseType] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">
            CourtFlow Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground mt-1">Key court performance metrics overview.</p>
      </header>

      {/* Filter Section */}
      <section className="mb-8 p-6 bg-card rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary">Filters</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="caseTypeFilter" className="text-sm font-medium">Case Type</Label>
            <Select value={selectedCaseType} onValueChange={setSelectedCaseType}>
              <SelectTrigger id="caseTypeFilter" className="mt-1 w-full rounded-md border-input shadow-sm">
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Case Types</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ageFilter" className="text-sm font-medium">Case Age</Label>
            <Select value={selectedAge} onValueChange={setSelectedAge}>
              <SelectTrigger id="ageFilter" className="mt-1 w-full rounded-md border-input shadow-sm">
                <SelectValue placeholder="Select case age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="<30">Less than 30 days</SelectItem>
                <SelectItem value="30-90">30-90 days</SelectItem>
                <SelectItem value=">90">Over 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

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
        <FiledCasesChart selectedCaseType={selectedCaseType} selectedAge={selectedAge} />
        <ResolvedCasesChart selectedCaseType={selectedCaseType} selectedAge={selectedAge} />
        <PendingCasesChart selectedCaseType={selectedCaseType} selectedAge={selectedAge} />
        <JudgeWorkloadChart selectedCaseType={selectedCaseType} selectedAge={selectedAge} />
      </section>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CourtFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
