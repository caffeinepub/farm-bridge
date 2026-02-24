import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterInstitution } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { InstitutionType } from '../backend';

export default function InstitutionRegistrationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [instType, setInstType] = useState<keyof typeof InstitutionType>('temple');
  const [interestedCrops, setInterestedCrops] = useState('');

  const { mutate: registerInstitution, isPending } = useRegisterInstitution();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !interestedCrops.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const crops = interestedCrops.split(',').map((c) => c.trim()).filter((c) => c.length > 0);
    if (crops.length === 0) {
      toast.error('Please enter at least one crop type');
      return;
    }

    registerInstitution(
      {
        name: name.trim(),
        instType: InstitutionType[instType],
        interestedCrops: crops,
      },
      {
        onSuccess: () => {
          toast.success('Institution profile registered successfully!');
          navigate({ to: '/marketplace' });
        },
        onError: (error) => {
          toast.error(`Registration failed: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/institution-icon.dim_128x128.png"
              alt="Institution"
              className="h-24 w-24 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-center">Institution Registration</CardTitle>
          <CardDescription className="text-center">
            Register your institution to request organic produce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Institution Name *</Label>
              <Input
                id="name"
                placeholder="Enter institution name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Institution Type *</Label>
              <Select value={instType} onValueChange={(value) => setInstType(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temple">Temple</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="court">Court</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="governmentOffice">Government Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestedCrops">Interested Crops *</Label>
              <Input
                id="interestedCrops"
                placeholder="e.g., Tomatoes, Lettuce, Carrots (comma-separated)"
                value={interestedCrops}
                onChange={(e) => setInterestedCrops(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter crop types you're interested in, separated by commas
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Registering...' : 'Register Institution'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
