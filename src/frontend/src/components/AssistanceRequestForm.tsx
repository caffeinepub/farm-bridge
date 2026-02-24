import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitAssistanceRequest } from '../hooks/useQueries';
import { AssistanceType } from '../backend';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import ImageUploader from './ImageUploader';
import { ExternalBlob } from '../backend';

interface FormData {
  assistanceType: AssistanceType;
  description: string;
}

export default function AssistanceRequestForm() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();
  const { mutate: submitRequest, isPending } = useSubmitAssistanceRequest();
  const navigate = useNavigate();
  const [images, setImages] = useState<ExternalBlob[]>([]);

  const assistanceType = watch('assistanceType');

  const onSubmit = (data: FormData) => {
    submitRequest(
      {
        assistanceType: data.assistanceType,
        description: data.description,
        images: images,
        video: undefined,
      },
      {
        onSuccess: () => {
          toast.success('Assistance request submitted successfully');
          navigate({ to: '/my-requests' });
        },
        onError: (error) => {
          toast.error(`Failed to submit request: ${error.message}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="assistanceType">Type of Assistance *</Label>
        <Select
          onValueChange={(value) => setValue('assistanceType', value as AssistanceType)}
          value={assistanceType}
        >
          <SelectTrigger id="assistanceType">
            <SelectValue placeholder="Select assistance type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AssistanceType.technicalSupport}>Technical Support</SelectItem>
            <SelectItem value={AssistanceType.postHarvestManagement}>Post-Harvest Management</SelectItem>
            <SelectItem value={AssistanceType.equipmentLoan}>Equipment Loan</SelectItem>
            <SelectItem value={AssistanceType.other}>Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.assistanceType && (
          <p className="text-sm text-destructive">{errors.assistanceType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe the assistance you need in detail..."
          rows={6}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Provide as much detail as possible to help us understand your needs
        </p>
      </div>

      <div className="space-y-2">
        <Label>Supporting Images (Optional)</Label>
        <ImageUploader onImagesChange={setImages} maxImages={5} />
        <p className="text-xs text-muted-foreground">
          Upload images to help illustrate your assistance needs (max 5 images)
        </p>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
}
