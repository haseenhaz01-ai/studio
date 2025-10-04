'use client';

import { useState, useTransition, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import Image from 'next/image';
import { backgroundRemoverSchema } from '@/lib/schemas';
import { handleBackgroundRemoval } from '@/lib/actions';

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
import { Label } from '@/components/ui/label';
import { Download, UploadCloud, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BackgroundRemoverFormValues = z.infer<typeof backgroundRemoverSchema>;

interface ImageState {
  originalSrc: string;
}

interface ResultState {
  processedSrc: string;
}

export default function BackgroundRemover() {
  const [isPending, startTransition] = useTransition();
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [resultState, setResultState] = useState<ResultState | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const { toast } = useToast();

  const form = useForm<BackgroundRemoverFormValues>({
    resolver: zodResolver(backgroundRemoverSchema),
  });

  const processImage = useCallback(() => {
    if (!imageState?.originalSrc) return;

    setResultState(null);
    startTransition(async () => {
      const response = await handleBackgroundRemoval({
        imageDataUri: imageState.originalSrc,
        backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
      });

      if (response.error) {
        toast({ variant: 'destructive', title: 'Error', description: response.error });
      }
      if (response.success && response.success.outputImageUri) {
        setResultState({ processedSrc: response.success.outputImageUri });
      }
    });
  }, [imageState, backgroundColor, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setImageState({ originalSrc: src });
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
        <CardTitle className="font-headline">AI Background Remover</CardTitle>
        <CardDescription>
          Upload an image to automatically remove the background, powered by AI.
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-center mb-2">Original Image</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image src={imageState.originalSrc} alt="Original" fill style={{ objectFit: 'contain' }} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-center mb-2">Result</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-transparent" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none'%3e%3cpath d='M0 0h16v16H0z' fill='%23f0f0f0'/%3e%3cpath d='M16 16h16v16H16z' fill='%23f0f0f0'/%3e%3c/svg%3e")`, backgroundRepeat: 'repeat' }}>
                    {isPending && <div className="flex h-full items-center justify-center bg-background/80"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                    {resultState && <Image src={resultState.processedSrc} alt="Background removed" fill style={{ objectFit: 'contain' }} />}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-medium">Advanced Options</h3>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="bg-color">Background Color</Label>
                        <Input
                            id="bg-color"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 p-1"
                            disabled={isPending}
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => setBackgroundColor('transparent')}
                        disabled={isPending}
                    >
                        Use Transparent Background
                    </Button>
                </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Button onClick={processImage} disabled={!imageState || isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          {resultState ? 'Re-process Image' : 'Remove Background'}
        </Button>
        <Button className="w-full" asChild disabled={!resultState || isPending}>
            <a
              href={resultState?.processedSrc}
              download="background-removed.png"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Result
            </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
