import { Card } from '@/components/ui/card';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';

interface RuralUrbanFlowVisualizationProps {
  ruralFarmers: number;
  urbanFarmers: number;
  institutions: number;
}

export default function RuralUrbanFlowVisualization({
  ruralFarmers,
  urbanFarmers,
  institutions,
}: RuralUrbanFlowVisualizationProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-8">
      {/* Rural Farmers */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{ruralFarmers}</p>
          <p className="text-sm text-muted-foreground">Rural Farmers</p>
        </div>
      </div>

      {/* Arrow */}
      <div className="hidden md:block">
        <ArrowRight className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="md:hidden">
        <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90" />
      </div>

      {/* Urban Farmers */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{urbanFarmers}</p>
          <p className="text-sm text-muted-foreground">Urban Farmers</p>
        </div>
      </div>

      {/* Arrow */}
      <div className="hidden md:block">
        <ArrowRight className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="md:hidden">
        <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90" />
      </div>

      {/* Institutions */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{institutions}</p>
          <p className="text-sm text-muted-foreground">Institutions Served</p>
        </div>
      </div>
    </div>
  );
}
