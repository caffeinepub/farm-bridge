import { useState } from 'react';
import { useRequestProduce } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { ProduceListing } from '../backend';

interface RequestProduceModalProps {
  listingId: number;
  listing: ProduceListing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestProduceModal({ listingId, listing, open, onOpenChange }: RequestProduceModalProps) {
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const { mutate: requestProduce, isPending } = useRequestProduce();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = parseInt(requestedQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (quantity > Number(listing.quantity)) {
      toast.error(`Requested quantity exceeds available quantity (${Number(listing.quantity)} units)`);
      return;
    }

    requestProduce(
      {
        listingId: BigInt(listingId),
        requestedQuantity: BigInt(quantity),
      },
      {
        onSuccess: () => {
          toast.success('Request submitted successfully!');
          setRequestedQuantity('');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(`Failed to submit request: ${error.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Produce</DialogTitle>
          <DialogDescription>
            Submit a request for this organic produce listing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">{listing.crop}</span>
              {listing.organic && (
                <Badge variant="outline" className="bg-primary/10">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Available:</span>
                <p className="font-medium">{Number(listing.quantity)} units</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price per unit:</span>
                <p className="font-medium">${Number(listing.price)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestedQuantity">Quantity to Request *</Label>
              <Input
                id="requestedQuantity"
                type="number"
                placeholder="Enter quantity"
                value={requestedQuantity}
                onChange={(e) => setRequestedQuantity(e.target.value)}
                min="1"
                max={Number(listing.quantity)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum: {Number(listing.quantity)} units
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
