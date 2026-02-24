import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Trash2, Image as ImageIcon } from 'lucide-react';
import { ProduceListing } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import RequestProduceModal from './RequestProduceModal';
import { useDeleteProduceListing } from '../hooks/useQueries';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProduceListingCardProps {
  listingId: number;
  listing: ProduceListing;
  isFarmer: boolean;
  isInstitution: boolean;
}

export default function ProduceListingCard({ listingId, listing, isFarmer, isInstitution }: ProduceListingCardProps) {
  const { identity } = useInternetIdentity();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteProduceListing();

  const isOwner = identity && listing.farmer.toString() === identity.getPrincipal().toString();

  const handleDelete = () => {
    deleteListing(BigInt(listingId), {
      onSuccess: () => {
        toast.success('Listing deleted successfully');
      },
      onError: (error) => {
        toast.error(`Failed to delete listing: ${error.message}`);
      },
    });
  };

  return (
    <>
      <Card className="flex flex-col shadow-soft hover:shadow-medium transition-all border-2 hover:border-primary/20">
        {listing.listingImage && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={listing.listingImage.getDirectURL()}
              alt={listing.crop}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-heading">{listing.crop}</CardTitle>
            {listing.organic && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Leaf className="h-3 w-3 mr-1" />
                Organic
              </Badge>
            )}
          </div>
          <CardDescription className="caption">
            Farmer: {listing.farmer.toString().slice(0, 15)}...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quantity:</span>
            <span className="font-semibold">{Number(listing.quantity)} units</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price per unit:</span>
            <span className="font-semibold text-primary">${Number(listing.price)}</span>
          </div>
          {listing.videoTour && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              <span>Video tour available</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {isOwner ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting} className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this listing? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : isInstitution ? (
            <Button onClick={() => setShowRequestModal(true)} className="w-full">
              Request Produce
            </Button>
          ) : null}
        </CardFooter>
      </Card>

      {showRequestModal && (
        <RequestProduceModal
          listingId={listingId}
          listing={listing}
          open={showRequestModal}
          onOpenChange={setShowRequestModal}
        />
      )}
    </>
  );
}
