import { useState } from 'react';
import { useMyListings } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBasket, Plus } from 'lucide-react';
import ProduceListingCard from '../components/ProduceListingCard';
import CreateListingForm from '../components/CreateListingForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SectionHeading from '../components/SectionHeading';
import CTAButton from '../components/CTAButton';

export default function MyListingsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: listings, isLoading: listingsLoading } = useMyListings();

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SectionHeading
          title="My Produce Listings"
          subtitle="Manage your produce listings and track their performance"
          level="h1"
        />
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <CTAButton>
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </CTAButton>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Produce Listing</DialogTitle>
            </DialogHeader>
            <CreateListingForm onSuccess={() => setShowCreateForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Listings Section */}
      <div>
        <h2 className="heading-3 mb-6 font-heading">Your Listings</h2>
        {listingsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : !listings || listings.length === 0 ? (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <ShoppingBasket className="h-5 w-5" />
                No Listings Yet
              </CardTitle>
              <CardDescription>
                Create your first listing to start selling organic produce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CTAButton onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </CTAButton>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(([id, listing]) => (
              <ProduceListingCard
                key={Number(id)}
                listingId={Number(id)}
                listing={listing}
                isFarmer={true}
                isInstitution={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
