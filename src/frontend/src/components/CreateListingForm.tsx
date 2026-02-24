import { useState } from 'react';
import { useCreateListing } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface CreateListingFormProps {
  onSuccess: () => void;
}

export default function CreateListingForm({ onSuccess }: CreateListingFormProps) {
  const [crop, setCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [organic, setOrganic] = useState(true);

  const { mutate: createListing, isPending } = useCreateListing();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!crop.trim() || !quantity || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantityNum = parseInt(quantity);
    const priceNum = parseInt(price);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    createListing(
      {
        crop: crop.trim(),
        quantity: BigInt(quantityNum),
        price: BigInt(priceNum),
        organic,
      },
      {
        onSuccess: () => {
          toast.success('Listing created successfully!');
          setCrop('');
          setQuantity('');
          setPrice('');
          setOrganic(true);
          onSuccess();
        },
        onError: (error) => {
          toast.error(`Failed to create listing: ${error.message}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="crop">Crop Type *</Label>
        <Input
          id="crop"
          placeholder="e.g., Tomatoes"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity (units) *</Label>
        <Input
          id="quantity"
          type="number"
          placeholder="e.g., 100"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price per unit ($) *</Label>
        <Input
          id="price"
          type="number"
          placeholder="e.g., 5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="1"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="organic" checked={organic} onCheckedChange={(checked) => setOrganic(checked as boolean)} />
        <Label htmlFor="organic" className="font-normal cursor-pointer">
          Certified Organic
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Listing'}
      </Button>
    </form>
  );
}
