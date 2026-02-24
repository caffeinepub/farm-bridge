import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterFarmer } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FarmLocation, FarmingMethods } from '../backend';

export default function FarmerRegistrationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState<'rural' | 'urban'>('rural');
  const [farmSize, setFarmSize] = useState('');
  const [methods, setMethods] = useState<'organic' | 'conventional' | 'mixed'>('organic');
  const [cropTypes, setCropTypes] = useState('');

  const { mutate: registerFarmer, isPending } = useRegisterFarmer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !farmSize || !cropTypes.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const farmSizeNum = parseInt(farmSize);
    if (isNaN(farmSizeNum) || farmSizeNum <= 0) {
      toast.error('Please enter a valid farm size');
      return;
    }

    const crops = cropTypes.split(',').map((c) => c.trim()).filter((c) => c.length > 0);
    if (crops.length === 0) {
      toast.error('Please enter at least one crop type');
      return;
    }

    registerFarmer(
      {
        name: name.trim(),
        location: FarmLocation[location],
        farmSize: BigInt(farmSizeNum),
        methods: FarmingMethods[methods],
        cropTypes: crops,
      },
      {
        onSuccess: () => {
          toast.success('Farmer profile registered successfully!');
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
              src="/assets/generated/farmer-icon.dim_128x128.png"
              alt="Farmer"
              className="h-24 w-24 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-center">Farmer Registration</CardTitle>
          <CardDescription className="text-center">
            Register your farm to start listing organic produce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Farm/Farmer Name *</Label>
              <Input
                id="name"
                placeholder="Enter your name or farm name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Farm Location *</Label>
              <Select value={location} onValueChange={(value) => setLocation(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rural">Rural</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (in acres) *</Label>
              <Input
                id="farmSize"
                type="number"
                placeholder="Enter farm size"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Farming Methods *</Label>
              <RadioGroup value={methods} onValueChange={(value) => setMethods(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organic" id="organic" />
                  <Label htmlFor="organic" className="font-normal cursor-pointer">
                    Organic - Chemical-free farming
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conventional" id="conventional" />
                  <Label htmlFor="conventional" className="font-normal cursor-pointer">
                    Conventional - Traditional farming with chemicals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="font-normal cursor-pointer">
                    Mixed - Combination of both methods
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cropTypes">Crop Types *</Label>
              <Input
                id="cropTypes"
                placeholder="e.g., Tomatoes, Lettuce, Carrots (comma-separated)"
                value={cropTypes}
                onChange={(e) => setCropTypes(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter crop types separated by commas
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Registering...' : 'Register as Farmer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
