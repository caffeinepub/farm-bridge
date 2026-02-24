import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  subtitle?: string;
  iconColor?: string;
}

export default function MetricCard({ icon, label, value, subtitle, iconColor = 'text-primary' }: MetricCardProps) {
  return (
    <Card className="shadow-soft hover:shadow-medium transition-all border-2 hover:border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
            <p className="text-3xl font-bold font-heading">{value.toLocaleString()}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
          </div>
          <div className={`h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
