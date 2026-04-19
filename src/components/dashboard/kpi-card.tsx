import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  accentColor?: string; // e.g. "text-blue-600", "text-emerald-600", "text-amber-500", "text-indigo-600"
  bgColor?: string; // e.g. "bg-blue-50", "bg-emerald-50"
}

export function KpiCard({
  title,
  value,
  description,
  icon,
  accentColor = "text-stone-500",
  bgColor = "bg-stone-50",
}: KpiCardProps) {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${bgColor}`}>
          <span className={`${accentColor}`}>{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold tracking-tight">
          {value}
        </span>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
