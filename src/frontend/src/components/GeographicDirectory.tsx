import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Building2 } from 'lucide-react';
import RegionCard from './RegionCard';

interface GeographicDirectoryProps {
  ruralFarmers: number;
  urbanFarmers: number;
  institutions: number;
}

export default function GeographicDirectory({ ruralFarmers, urbanFarmers, institutions }: GeographicDirectoryProps) {
  const regions = [
    {
      name: 'Rural Areas',
      farmers: ruralFarmers,
      institutions: Math.floor(institutions * 0.3),
      districts: [
        { name: 'North District', farmers: Math.floor(ruralFarmers * 0.4), institutions: Math.floor(institutions * 0.1) },
        { name: 'South District', farmers: Math.floor(ruralFarmers * 0.35), institutions: Math.floor(institutions * 0.1) },
        { name: 'East District', farmers: Math.floor(ruralFarmers * 0.25), institutions: Math.floor(institutions * 0.1) },
      ],
    },
    {
      name: 'Urban Areas',
      farmers: urbanFarmers,
      institutions: Math.ceil(institutions * 0.7),
      districts: [
        { name: 'Central City', farmers: Math.floor(urbanFarmers * 0.5), institutions: Math.ceil(institutions * 0.4) },
        { name: 'Metro District', farmers: Math.floor(urbanFarmers * 0.3), institutions: Math.ceil(institutions * 0.2) },
        { name: 'Suburban Area', farmers: Math.floor(urbanFarmers * 0.2), institutions: Math.ceil(institutions * 0.1) },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Farmers</p>
            <p className="text-2xl font-bold">{ruralFarmers + urbanFarmers}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg">
          <Building2 className="h-8 w-8 text-secondary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Institutions</p>
            <p className="text-2xl font-bold">{institutions}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-lg">
          <MapPin className="h-8 w-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Regions</p>
            <p className="text-2xl font-bold">{regions.length}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {regions.map((region, index) => (
          <RegionCard key={index} region={region} />
        ))}
      </div>
    </div>
  );
}
