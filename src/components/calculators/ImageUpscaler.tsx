'use client';

import { useState, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { imageUpscalerSchema } from '@/lib/schemas';
import { handleImageUpscaling } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Download, Loader2, RefreshCw, Wand2 } from 'lucide-react';

type ImageUpscalerFormValues = z.infer<typeof imageUpscalerSchema>;

interface ImageState {
  originalSrc: string;
  originalName: string;
}

interface ResultState {
  processedSrc: string;
}

export default function ImageUpscaler() {
  const [isPending, startTransition] = useTransition();
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [resultState, setResultState] = useState<ResultState | null>(null);
  const { toast } = useToast();

  const form = useForm<ImageUpscalerFormValues>({
    resolver: zodResolver(imageUpscalerSchema),
  });
  
  const processImage = useCallback(() => {
    if (!imageState?.originalSrc) return;

    setResultState(null);
    startTransition(async () => {
      const response = await handleImageUpscaling({ imageDataUri: imageState.originalSrc });

      if (response.error) {
        toast({ variant: 'destructive', title: 'Error', description: response.error });
      }
      if (response.success && response.success.outputImageUri) {
        setResultState({ processedSrc: response.success.outputImageUri });
      }
    });
  }, [imageState, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setImageState({ originalSrc: src, originalName: file.name });
        setResultState(null);
      };
      reader.readAsDataURL(file);
    } else {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
    }
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">AI Image Upscaler & Enhancer</CardTitle>
        <CardDescription>
          Upload an image to automatically increase its resolution and quality using AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!imageState ? (
            <div className="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <Input
                    type="file"
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <p className="absolute bottom-4 text-sm text-muted-foreground">Click or drag to upload an image</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-center mb-2">Original Image</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <Image src={imageState.originalSrc} alt="Original" fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-center mb-2">Upscaled & Enhanced Result</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted/20">
                  {isPending && <div className="flex h-full items-center justify-center bg-background/80"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                  {resultState && <Image src={resultState.processedSrc} alt="Upscaled result" fill style={{ objectFit: 'contain' }} />}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Button onClick={processImage} disabled={!imageState || isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          {resultState ? 'Re-process Image' : 'Upscale & Enhance'}
        </Button>
        <Button className="w-full" asChild disabled={!resultState || isPending}>
            <a
              href={resultState?.processedSrc}
              download={`${imageState?.originalName.replace(/\.[^/.]+$/, "")}-upscaled.png`}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Result
            </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
