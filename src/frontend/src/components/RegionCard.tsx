import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, MapPin, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface District {
  name: string;
  farmers: number;
  institutions: number;
}

interface Region {
  name: string;
  farmers: number;
  institutions: number;
  districts: District[];
}

interface RegionCardProps {
  region: Region;
}

export default function RegionCard({ region }: RegionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="shadow-soft hover:shadow-medium transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-heading">
            <MapPin className="h-5 w-5 text-primary" />
            {region.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Farmers</p>
              <p className="text-lg font-semibold">{region.farmers}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Institutions</p>
              <p className="text-lg font-semibold">{region.institutions}</p>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="pt-4 border-t space-y-3">
            <p className="text-sm font-semibold text-muted-foreground">Districts</p>
            {region.districts.map((district, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">{district.name}</span>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{district.farmers} farmers</span>
                  <span>{district.institutions} institutions</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
