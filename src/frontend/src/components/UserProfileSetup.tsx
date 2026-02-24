import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { Variant_other_institution_farmer } from '../backend';

export default function UserProfileSetup() {
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'farmer' | 'institution' | 'other'>('farmer');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    saveProfile(
      {
        name: name.trim(),
        userType: Variant_other_institution_farmer[userType],
      },
      {
        onSuccess: () => {
          toast.success('Profile created successfully!');
        },
        onError: (error) => {
          toast.error(`Failed to create profile: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="container max-w-2xl py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Farm Bridge</CardTitle>
          <CardDescription>Let's set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup value={userType} onValueChange={(value) => setUserType(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="farmer" id="farmer" />
                  <Label htmlFor="farmer" className="font-normal cursor-pointer">
                    Farmer - I want to list and sell organic produce
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="institution" id="institution" />
                  <Label htmlFor="institution" className="font-normal cursor-pointer">
                    Institution - I want to purchase organic produce
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="font-normal cursor-pointer">
                    Other - I'm just exploring
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating Profile...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
