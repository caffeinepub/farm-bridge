import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onImagesChange: (images: ExternalBlob[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ onImagesChange, maxImages = 5 }: ImageUploaderProps) {
  const [images, setImages] = useState<ExternalBlob[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);

        // Create preview
        const blob = new Blob([uint8Array], { type: file.type });
        const previewUrl = URL.createObjectURL(blob);

        // Create ExternalBlob with progress tracking
        const externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[images.length + i] = percentage;
            return newProgress;
          });
        });

        setImages((prev) => {
          const newImages = [...prev, externalBlob];
          onImagesChange(newImages);
          return newImages;
        });

        setPreviews((prev) => [...prev, previewUrl]);
      };

      reader.readAsArrayBuffer(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newProgress = uploadProgress.filter((_, i) => i !== index);

    setImages(newImages);
    setPreviews(newPreviews);
    setUploadProgress(newProgress);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
        <span className="text-sm text-muted-foreground">
          {images.length} / {maxImages} images
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-border bg-muted">
                <img src={preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                <div className="absolute bottom-2 left-2 right-2">
                  <Progress value={uploadProgress[index]} className="h-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
