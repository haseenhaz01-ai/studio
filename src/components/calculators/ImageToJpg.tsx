'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { imageToJpgSchema } from '@/lib/schemas';

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
import { UploadCloud, Download } from 'lucide-react';

type ImageToJpgFormValues = z.infer<typeof imageToJpgSchema>;

interface ImageState {
  originalSrc: string;
  originalName: string;
  jpgSrc: string | null;
}

export default function ImageToJpg() {
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const { toast } = useToast();

  const form = useForm<ImageToJpgFormValues>({
    resolver: zodResolver(imageToJpgSchema),
  });
  
  const convertToJpg = useCallback((file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not get canvas context.' });
            return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const jpgSrc = canvas.toDataURL('image/jpeg', 0.95);
        setImageState({
            originalSrc: img.src,
            originalName: file.name,
            jpgSrc: jpgSrc,
        });
      };
    };
  }, [toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        convertToJpg(file);
    } else {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Image to JPG Converter</CardTitle>
        <CardDescription>
          Convert PNG, GIF, WEBP, and other image formats to JPG.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <Input
                type="file"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                accept="image/*"
                onChange={handleFileChange}
            />
            <p className="absolute bottom-4 text-sm text-muted-foreground">Click or drag to upload an image</p>
        </div>

        {imageState?.jpgSrc && (
            <div className="space-y-4">
                <h3 className="font-semibold text-center mb-2">Converted JPG Image</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                     <Image src={imageState.jpgSrc} alt="Converted to JPG" fill style={{ objectFit: 'contain' }} />
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild disabled={!imageState?.jpgSrc}>
            <a
              href={imageState?.jpgSrc ?? '#'}
              download={imageState?.originalName.replace(/\.[^/.]+$/, "") + ".jpg"}
            >
              <Download className="mr-2 h-4 w-4" />
              Download JPG
            </a>
          </Button>
      </CardFooter>
    </Card>
  );
}
