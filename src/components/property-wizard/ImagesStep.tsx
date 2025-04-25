
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PropertyImage } from "@/types/property";
import { X, Image as ImageIcon } from "lucide-react";

interface ImagesStepProps {
  onNext: (images: PropertyImage[]) => void;
  onBack: () => void;
  initialImages?: PropertyImage[];
}

const ImagesStep = ({ onNext, onBack, initialImages = [] }: ImagesStepProps) => {
  const [images, setImages] = useState<PropertyImage[]>(initialImages);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(images);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="images">Upload Property Images</Label>
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 border-dashed"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <div className="flex flex-col items-center">
                <ImageIcon className="h-8 w-8 mb-2" />
                <span>Click to upload images</span>
                <span className="text-sm text-muted-foreground">
                  or drag and drop
                </span>
              </div>
            </Button>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Property ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Review & Submit</Button>
      </div>
    </form>
  );
};

export default ImagesStep;
