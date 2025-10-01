'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { imageCompressorSchema } from '@/lib/schemas';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Download, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ImageCompressorFormValues = z.infer<typeof imageCompressorSchema>;

interface ImageState {
  originalFile: File;
  originalSrc: string;
  originalSize: number;
}

interface CompressedState {
  compressedSrc: string;
  compressedSize: number;
}

export default function ImageCompressor() {
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [compressedState, setCompressedState] = useState<CompressedState | null>(null);
  const { toast } = useToast();

  const form = useForm<ImageCompressorFormValues>({
    resolver: zodResolver(imageCompressorSchema),
    defaultValues: {
      quality: 0.7,
    },
  });

  const compressImage = useCallback((file: File, quality: number) => {
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
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            toast({ variant: 'destructive', title: 'Error', description: 'Compression failed.' });
            return;
          }
          const compressedSrc = URL.createObjectURL(blob);
          setCompressedState({ compressedSrc, compressedSize: blob.size });
        }, 'image/jpeg', quality);
      };
    };
  }, [toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const originalSrc = URL.createObjectURL(file);
      setImageState({ originalFile: file, originalSrc, originalSize: file.size });
      compressImage(file, form.getValues('quality'));
    } else {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
    }
  };

  const quality = form.watch('quality');

  // Re-compress when quality slider changes
  const handleQualityChange = (newQuality: number) => {
      form.setValue('quality', newQuality);
      if (imageState) {
          compressImage(imageState.originalFile, newQuality);
      }
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const reductionPercentage = imageState && compressedState 
    ? ((imageState.originalSize - compressedState.compressedSize) / imageState.originalSize) * 100
    : 0;

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">Image Compressor</CardTitle>
        <CardDescription>
          Upload an image to compress it. Adjust the quality slider to change the file size.
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

        {imageState && (
            <div className="space-y-4">
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="quality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Compression Quality ({Math.round(field.value * 100)}%)</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={[field.value]}
                                        onValueChange={(vals) => handleQualityChange(vals[0])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold text-center mb-2">Original ({formatBytes(imageState.originalSize)})</h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                             <Image src={imageState.originalSrc} alt="Original" fill style={{ objectFit: 'contain' }} />
                        </div>
                    </div>
                    <div>
                        {compressedState ? (
                            <>
                                <h3 className="font-semibold text-center mb-2">Compressed ({formatBytes(compressedState.compressedSize)})</h3>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                    <Image src={compressedState.compressedSrc} alt="Compressed" fill style={{ objectFit: 'contain' }} />
                                </div>
                            </>
                        ) : (
                             <div className="flex items-center justify-center h-full">
                                <p>Compressing...</p>
                            </div>
                        )}
                    </div>
                </div>

                {compressedState && (
                    <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6 text-center">
                        <p className="text-sm text-accent-foreground/80">File Size Reduction</p>
                        <p className="font-headline text-4xl font-bold text-accent-foreground">
                            {reductionPercentage.toFixed(1)}%
                        </p>
                    </div>
                )}
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            disabled={!compressedState}
            className="w-full"
            asChild
        >
          {compressedState && (
             <a href={compressedState.compressedSrc} download={imageState?.originalFile.name.replace(/\.[^/.]+$/, "") + '-compressed.jpg'}>
                <Download className="mr-2 h-4 w-4" />
                Download Compressed Image
            </a>
          )}
          {!compressedState && (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Compressed Image
              </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
