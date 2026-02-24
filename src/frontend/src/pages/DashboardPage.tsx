import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetDashboardMetrics } from '../hooks/useQueries';
import { Users, Building2, ShoppingBasket, Leaf, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MetricCard from '../components/MetricCard';
import GeographicDirectory from '../components/GeographicDirectory';
import SectionHeading from '../components/SectionHeading';

export default function DashboardPage() {
  const { data: metrics, isLoading } = useGetDashboardMetrics();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-12 w-80 mb-3" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const organicPercentage = metrics && metrics.totalListings > BigInt(0)
    ? Math.round((Number(metrics.totalOrganicListings) / Number(metrics.totalListings)) * 100)
    : 0;

  return (
    <div className="container py-8 space-y-10">
      <SectionHeading
        title="Platform Impact Dashboard"
        subtitle="Track the growth of our global farming community and employment infrastructure"
      />

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Users className="h-5 w-5" />}
          label="Total Farmers"
          value={metrics ? Number(metrics.totalFarmers) : 0}
          iconColor="text-primary"
        />
        <MetricCard
          icon={<Building2 className="h-5 w-5" />}
          label="Institutions Served"
          value={metrics ? Number(metrics.totalInstitutions) : 0}
          iconColor="text-secondary"
        />
        <MetricCard
          icon={<ShoppingBasket className="h-5 w-5" />}
          label="Produce Listings"
          value={metrics ? Number(metrics.totalListings) : 0}
          iconColor="text-accent"
        />
        <MetricCard
          icon={<Leaf className="h-5 w-5" />}
          label="Organic Listings"
          value={metrics ? Number(metrics.totalOrganicListings) : 0}
          subtitle={`${organicPercentage}% of total`}
          iconColor="text-success"
        />
      </div>

      {/* Geographic Distribution */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-heading">Geographic Distribution</CardTitle>
          <CardDescription>
            Farmers and institutions organized by region and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeographicDirectory
            ruralFarmers={metrics ? Number(metrics.ruralFarmers) : 0}
            urbanFarmers={metrics ? Number(metrics.urbanFarmers) : 0}
            institutions={metrics ? Number(metrics.totalInstitutions) : 0}
          />
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <TrendingUp className="h-5 w-5 text-success" />
              Organic Adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Organic Listings</span>
                  <span className="text-sm font-semibold">{organicPercentage}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-success to-primary transition-all"
                    style={{ width: `${organicPercentage}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {metrics && metrics.totalOrganicListings > BigInt(0)
                  ? `${Number(metrics.totalOrganicListings)} out of ${Number(metrics.totalListings)} listings are certified organic`
                  : 'No organic listings yet'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Users className="h-5 w-5 text-primary" />
              Community Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Requests</span>
                <span className="text-3xl font-bold font-heading text-primary">{metrics ? Number(metrics.totalRequests) : 0}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Strong demand for organic produce with active participation from institutions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
