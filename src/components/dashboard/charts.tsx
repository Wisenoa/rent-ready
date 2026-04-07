"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

interface ChartsProps {
  revenue: {
    currentMonth: number;
    previousMonth: number;
  };
  expenses: {
    currentMonth: number;
    previousMonth: number;
    byCategory: Record<string, number>;
  };
  noi: {
    currentMonth: number;
    previousMonth: number;
    yearToDate: number;
  };
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const categoryLabels: Record<string, string> = {
  PLUMBING: "Plomberie",
  ELECTRICAL: "Électricité",
  GENERAL_MAINTENANCE: "Entretien",
  INSURANCE: "Assurance",
  TAX: "Taxes",
  CONDO_FEES: "Copropriété",
  MANAGEMENT_FEES: "Gestion",
  RENOVATION: "Rénovation",
  OTHER: "Autre",
};

export function RevenueExpenseChart({ revenue, expenses }: ChartsProps) {
  const data = [
    {
      name: "Revenus",
      current: revenue.currentMonth,
      previous: revenue.previousMonth,
    },
    {
      name: "Dépenses",
      current: expenses.currentMonth,
      previous: expenses.previousMonth,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenus vsDépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => value != null ? formatCurrency(Number(value)) : ''}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="current" name="Ce mois" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="previous" name="Mois précédent" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ExpenseByCategoryChart({ expenses }: { expenses: Record<string, number> }) {
  const data = Object.entries(expenses)
    .filter(([, amount]) => amount >0)
    .map(([category, amount]) => ({
      name: categoryLabels[category] ?? category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Répartition des dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Aucune dépense ce mois
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Répartition des dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => value != null ? formatCurrency(Number(value)) : ''}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.slice(0,5).map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function NOISummary({ noi }: { noi: { currentMonth: number; previousMonth: number; yearToDate: number } }) {
  const trend = noi.previousMonth !== 0 
    ? ((noi.currentMonth - noi.previousMonth) / Math.abs(noi.previousMonth)) * 100 
    : 0;
  const isPositive = noi.currentMonth >=0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Résultat Net d&apos;Exploitation (NOI)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Ce mois</p>
            <p className={`text-2xl font-bold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(noi.currentMonth)}
            </p>
            {noi.previousMonth !== 0 && (
              <p className={`text-xs ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {trend >= 0 ? "+" : ""}{trend.toFixed(1)}% vs mois précédent
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cumul annuel</p>
            <p className="text-lg font-semibold">
              {formatCurrency(noi.yearToDate)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}