import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { InsurancePlan, Variant_premium_basic_comprehensive } from '../backend';
import { Badge } from '@/components/ui/badge';

interface InsuranceCoverageCardProps {
  insurance: InsurancePlan;
}

export default function InsuranceCoverageCard({ insurance }: InsuranceCoverageCardProps) {
  const getPlanTypeLabel = (planType: Variant_premium_basic_comprehensive) => {
    switch (planType) {
      case Variant_premium_basic_comprehensive.basic:
        return 'Basic';
      case Variant_premium_basic_comprehensive.premium:
        return 'Premium';
      case Variant_premium_basic_comprehensive.comprehensive:
        return 'Comprehensive';
      default:
        return 'Unknown';
    }
  };

  const getPlanColor = (planType: Variant_premium_basic_comprehensive) => {
    switch (planType) {
      case Variant_premium_basic_comprehensive.basic:
        return 'bg-muted text-muted-foreground';
      case Variant_premium_basic_comprehensive.premium:
        return 'bg-secondary/20 text-secondary';
      case Variant_premium_basic_comprehensive.comprehensive:
        return 'bg-primary/20 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-soft hover:shadow-medium transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-heading">
            <Shield className="h-5 w-5 text-secondary" />
            Insurance Coverage
          </CardTitle>
          <Badge className={getPlanColor(insurance.planType)}>
            {getPlanTypeLabel(insurance.planType)}
          </Badge>
        </div>
        <CardDescription>Your health and life insurance plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Coverage Amount</span>
            <span className="text-lg font-semibold">${Number(insurance.coverageAmount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly Premium</span>
            <span className="text-lg font-semibold">${Number(insurance.monthlyPremium).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
