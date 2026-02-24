import { useState } from 'react';
import { useProduceListing, useGetCallerFarmerProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBasket, Plus } from 'lucide-react';
import ProduceListingCard from '../components/ProduceListingCard';
import CreateListingForm from '../components/CreateListingForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from '@tanstack/react-router';
import SectionHeading from '../components/SectionHeading';
import CTAButton from '../components/CTAButton';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Variant_other_institution_farmer } from '../backend';

export default function MarketplacePage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterOrganic, setFilterOrganic] = useState<'all' | 'organic'>('all');

  const { data: allListings, isLoading: allLoading } = useProduceListing(false);
  const { data: organicListings, isLoading: organicLoading } = useProduceListing(true);
  const { data: farmerProfile } = useGetCallerFarmerProfile();
  const { data: userProfile } = useGetCallerUserProfile();

  const isLoading = filterOrganic === 'all' ? allLoading : organicLoading;
  const listings = filterOrganic === 'all' ? allListings : organicListings;

  const isFarmer = !!farmerProfile;
  const isInstitution = userProfile?.userType === Variant_other_institution_farmer.institution;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SectionHeading
          title="Organic Produce Marketplace"
          subtitle="Browse fresh organic produce from farmers worldwide"
          level="h1"
        />
        {isFarmer && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <CTAButton>
                <Plus className="h-4 w-4 mr-2" />
                List Produce
              </CTAButton>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Produce Listing</DialogTitle>
              </DialogHeader>
              <CreateListingForm onSuccess={() => setShowCreateForm(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Hero Image */}
      <Card className="overflow-hidden shadow-medium">
        <img
          src="/assets/generated/organic-produce.dim_400x300.png"
          alt="Organic produce"
          className="w-full h-56 object-cover"
        />
      </Card>

      {/* Filter Tabs */}
      <Tabs value={filterOrganic} onValueChange={(v) => setFilterOrganic(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All Produce</TabsTrigger>
          <TabsTrigger value="organic">Organic Only</TabsTrigger>
        </TabsList>

        <TabsContent value={filterOrganic} className="mt-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : !listings || listings.length === 0 ? (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBasket className="h-5 w-5" />
                  No Listings Available
                </CardTitle>
                <CardDescription>
                  {isFarmer
                    ? 'Be the first to list your organic produce!'
                    : 'Check back soon for fresh organic produce listings.'}
                </CardDescription>
              </CardHeader>
              {isFarmer && (
                <CardContent>
                  <CTAButton onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </CTAButton>
                </CardContent>
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(([id, listing]) => (
                <ProduceListingCard
                  key={Number(id)}
                  listingId={Number(id)}
                  listing={listing}
                  isFarmer={isFarmer}
                  isInstitution={isInstitution}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Registration Prompts */}
      {!isFarmer && !isInstitution && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 shadow-medium">
          <CardHeader>
            <CardTitle className="font-heading">Want to participate?</CardTitle>
            <CardDescription className="body-default">
              Register as a farmer to list produce or as an institution to request organic produce
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <CTAButton asChild>
              <Link to="/register/farmer">Register as Farmer</Link>
            </CTAButton>
            <Button variant="outline" asChild>
              <Link to="/register/institution">Register as Institution</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
