'use client';

import { useState, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { removeTextSchema } from '@/lib/schemas';
import { handleRemoveText } from '@/lib/actions';

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
import { UploadCloud, Download, Loader2, Wand2 } from 'lucide-react';

type RemoveTextFormValues = z.infer<typeof removeTextSchema>;

interface ImageState {
  originalSrc: string;
  originalName: string;
}

interface ResultState {
  processedSrc: string;
}

export default function RemoveText() {
  const [isPending, startTransition] = useTransition();
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [resultState, setResultState] = useState<ResultState | null>(null);
  const { toast } = useToast();

  const form = useForm<RemoveTextFormValues>({
    resolver: zodResolver(removeTextSchema),
  });
  
  const processImage = useCallback(() => {
    if (!imageState?.originalSrc) return;

    setResultState(null);
    startTransition(async () => {
      const response = await handleRemoveText({ imageDataUri: imageState.originalSrc });

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
        <CardTitle className="font-headline">AI Remove Text from Image</CardTitle>
        <CardDescription>
          Upload an image to automatically remove any text from it.
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
              <h3 className="font-semibold text-center mb-2">Result</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted/20">
                  {isPending && <div className="flex h-full items-center justify-center bg-background/80"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                  {resultState && <Image src={resultState.processedSrc} alt="Text removed" fill style={{ objectFit: 'contain' }} />}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Button onClick={processImage} disabled={!imageState || isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          {resultState ? 'Re-process Image' : 'Remove Text'}
        </Button>
        <Button className="w-full" asChild disabled={!resultState || isPending}>
            <a
              href={resultState?.processedSrc}
              download={`${imageState?.originalName.replace(/\.[^/.]+$/, "")}-text-removed.png`}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Result
            </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
