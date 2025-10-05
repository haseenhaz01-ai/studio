'use client';

import { useState, useTransition, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { imageToVideoSchema } from '@/lib/schemas';
import { handleImageToVideo } from '@/lib/actions';

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
import { UploadCloud, Loader2, Clapperboard } from 'lucide-react';
import { Textarea } from '../ui/textarea';

type ImageToVideoFormValues = z.infer<typeof imageToVideoSchema>;

interface ImageState {
  originalSrc: string;
}

interface ResultState {
  videoSrc: string;
}

export default function ImageToVideo() {
  const [isPending, startTransition] = useTransition();
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [resultState, setResultState] = useState<ResultState | null>(null);
  const { toast } = useToast();

  const form = useForm<ImageToVideoFormValues>({
    resolver: zodResolver(imageToVideoSchema),
    defaultValues: { prompt: 'Make this image come to life, cinematic style.' },
  });
  
  const onSubmit = (values: ImageToVideoFormValues) => {
    if (!imageState?.originalSrc) {
      toast({ variant: 'destructive', title: 'No Image', description: 'Please upload an image first.' });
      return;
    }

    setResultState(null);
    startTransition(async () => {
      const response = await handleImageToVideo({ 
        imageDataUri: imageState.originalSrc,
        prompt: values.prompt,
       });

      if (response.error) {
        toast({ variant: 'destructive', title: 'Error Generating Video', description: response.error });
      }
      if (response.success && response.success.outputVideoUri) {
        setResultState({ videoSrc: response.success.outputVideoUri });
      }
    });
  };

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
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">AI Image to Video Generator</CardTitle>
        <CardDescription>
          Bring your images to life! Upload an image and write a prompt to generate a short video.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                        {resultState?.videoSrc ? (
                            <video src={resultState.videoSrc} controls autoPlay loop className="w-full h-full object-contain" />
                        ) : isPending ? (
                            <div className="flex h-full flex-col items-center justify-center bg-background/80 text-center p-4">
                                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                <p className="font-semibold">Generating video...</p>
                                <p className="text-sm text-muted-foreground">This can take up to a minute. Please wait.</p>
                            </div>
                        ) : (
                            <img src={imageState.originalSrc} alt="Uploaded preview" className="w-full h-full object-contain" />
                        )}
                    </div>
                )}
                 <div className="space-y-2">
                    <label htmlFor="prompt" className="font-medium">Prompt</label>
                    <Textarea 
                        id="prompt"
                        placeholder="e.g., A gentle breeze rustles the leaves, cinematic 4k"
                        {...form.register('prompt')}
                        className="resize-none"
                        rows={3}
                        disabled={!imageState || isPending}
                    />
                 </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={!imageState || isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clapperboard className="mr-2 h-4 w-4" />}
                Generate Video
                </Button>
            </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
