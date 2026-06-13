"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface DailyVisit {
  date: string;
  visits: number;
  unique: number;
}

export interface TopPage {
  path: string;
  label: string;
  count: number;
}

interface VisitAnalyticsCardProps {
  visitsToday: number;
  visitsThisMonth: number;
  totalVisits: number;
  uniqueVisitors: number;
  dailyVisits: DailyVisit[];
  topPages: TopPage[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const dailyConfig: ChartConfig = {
  visits: { label: "Visits", color: "var(--chart-1)" },
  unique: { label: "Unique Visitors", color: "var(--chart-2)" },
};

const pagesConfig: ChartConfig = {
  count: { label: "Visits", color: "var(--chart-1)" },
};

export function VisitAnalyticsCard({
  visitsToday,
  visitsThisMonth,
  totalVisits,
  uniqueVisitors,
  dailyVisits,
  topPages,
}: VisitAnalyticsCardProps) {
  const formatted = dailyVisits.map((d) => ({ ...d, label: formatDate(d.date) }));
  const tickInterval = dailyVisits.length > 20 ? 6 : dailyVisits.length > 14 ? 3 : 1;

  const truncatedPages = topPages.map((d) => ({
    ...d,
    label: d.label.length > 30 ? d.label.slice(0, 28) + "…" : d.label,
  }));

  const stats = [
    { value: visitsToday, label: "Today" },
    { value: visitsThisMonth, label: "This Month" },
    { value: totalVisits, label: "Total Visits" },
    { value: uniqueVisitors, label: "Unique Visitors" },
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {/* Daily trend + stats */}
      <Card className="flex flex-col">
        <CardContent className="p-5 space-y-5 flex flex-col flex-1">
          {/* Inline stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="space-y-0.5">
                <p className="text-2xl font-bold tabular-nums">{s.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Area chart */}
          {formatted.length > 0 && (
            <>
              <div className="h-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground mb-3">Last 30 days</p>
                <ChartContainer config={dailyConfig} className="h-[200px] w-full">
                  <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-unique)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--color-unique)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      interval={tickInterval - 1}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      width={30}
                    />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="var(--color-visits)"
                      strokeWidth={2}
                      fill="url(#gv)"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="unique"
                      stroke="var(--color-unique)"
                      strokeWidth={2}
                      fill="url(#gu)"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Top pages chart */}
      {truncatedPages.length > 0 && (
        <Card className="flex flex-col">
          <CardContent className="p-5 flex flex-col flex-1">
            <p className="text-sm font-semibold mb-4">Top Pages</p>
            <ChartContainer
              config={pagesConfig}
              className="w-full flex-1"
              style={{ minHeight: Math.max(truncatedPages.length * 44 + 16, 80) }}
            >
              <BarChart data={truncatedPages} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="label"
                  type="category"
                  tick={{ fontSize: 11, fontFamily: "monospace" }}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {truncatedPages.map((_, i) => (
                    <Cell key={i} fill="var(--color-count)" fillOpacity={Math.max(1 - i * 0.08, 0.35)} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
