'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { imageResizerSchema } from '@/lib/schemas';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Download, UploadCloud, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ImageResizerFormValues = z.infer<typeof imageResizerSchema>;

interface ImageState {
  originalFile: File;
  originalSrc: string;
  originalWidth: number;
  originalHeight: number;
}

interface ResizedState {
  resizedSrc: string;
  resizedWidth: number;
  resizedHeight: number;
}

export default function ImageResizer() {
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [resizedState, setResizedState] = useState<ResizedState | null>(null);
  const { toast } = useToast();

  const form = useForm<ImageResizerFormValues>({
    resolver: zodResolver(imageResizerSchema),
    defaultValues: {
      keepAspectRatio: true,
    },
  });

  const resizeImage = useCallback((
    img: HTMLImageElement,
    width: number | undefined,
    height: number | undefined,
    keepAspectRatio: boolean
  ) => {
    const canvas = document.createElement('canvas');
    let targetWidth = width;
    let targetHeight = height;

    if (keepAspectRatio) {
      if (width && !height) {
        targetHeight = Math.round(width * (img.height / img.width));
      } else if (!width && height) {
        targetWidth = Math.round(height * (img.width / img.height));
      }
    }
    
    targetWidth = targetWidth || img.width;
    targetHeight = targetHeight || img.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get canvas context.' });
      return;
    }
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    canvas.toBlob((blob) => {
      if (!blob) {
        toast({ variant: 'destructive', title: 'Error', description: 'Resizing failed.' });
        return;
      }
      const resizedSrc = URL.createObjectURL(blob);
      setResizedState({ resizedSrc, resizedWidth: targetWidth!, resizedHeight: targetHeight! });
    }, imageState?.originalFile.type || 'image/png');
  }, [toast, imageState]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.onload = () => {
          setImageState({
            originalFile: file,
            originalSrc: img.src,
            originalWidth: img.width,
            originalHeight: img.height,
          });
          form.setValue('width', img.width);
          form.setValue('height', img.height);
          setResizedState(null); // Clear previous resized image
        };
      };
    } else {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
    }
  };

  const onSubmit = (values: ImageResizerFormValues) => {
    if (!imageState) {
      toast({ variant: 'destructive', title: 'No Image', description: 'Please upload an image first.' });
      return;
    }
    const img = document.createElement('img');
    img.src = imageState.originalSrc;
    img.onload = () => {
      resizeImage(img, values.width, values.height, values.keepAspectRatio);
    };
  };

  const width = form.watch('width');
  const height = form.watch('height');
  const keepAspectRatio = form.watch('keepAspectRatio');

  useEffect(() => {
    if (keepAspectRatio && imageState) {
        const { originalWidth, originalHeight } = imageState;
        if (width && form.formState.dirtyFields.width) {
            const newHeight = Math.round(width * (originalHeight / originalWidth));
            form.setValue('height', newHeight);
        }
    }
  }, [width, keepAspectRatio, imageState, form]);

  useEffect(() => {
    if (keepAspectRatio && imageState) {
        const { originalWidth, originalHeight } = imageState;
         if (height && form.formState.dirtyFields.height) {
            const newWidth = Math.round(height * (originalWidth / originalHeight));
            form.setValue('width', newWidth);
        }
    }
  }, [height, keepAspectRatio, imageState, form]);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">Image Resizer</CardTitle>
        <CardDescription>
          Upload an image to resize it to your desired dimensions.
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
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="width"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Width (px)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height (px)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="keepAspectRatio"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Keep Aspect Ratio</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                 <Button type="submit" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Resize Image
                </Button>
            </form>
            </Form>
        )}

        {resizedState && (
            <div className="space-y-4">
                 <h3 className="font-semibold text-center mb-2">Resized Image ({resizedState.resizedWidth} x {resizedState.resizedHeight})</h3>
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image src={resizedState.resizedSrc} alt="Resized" fill style={{ objectFit: 'contain' }} />
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            disabled={!resizedState}
            className="w-full"
            asChild
        >
          {resizedState ? (
             <a href={resizedState.resizedSrc} download={imageState?.originalFile.name.replace(/\.[^/.]+$/, "") + '-resized.png'}>
                <Download className="mr-2 h-4 w-4" />
                Download Resized Image
            </a>
          ) : (
            <>
                <Download className="mr-2 h-4 w-4" />
                Download Resized Image
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
