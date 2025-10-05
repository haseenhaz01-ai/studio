'use client';

import { useState, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { imageToTextSchema } from '@/lib/schemas';
import { handleImageToText } from '@/lib/actions';

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
import { UploadCloud, Loader2, Text, Copy } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';

type ImageToTextFormValues = z.infer<typeof imageToTextSchema>;

interface ImageState {
  originalSrc: string;
}

interface ResultState {
  extractedText: string;
}

export default function ImageToText() {
  const [isPending, startTransition] = useTransition();
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [resultState, setResultState] = useState<ResultState | null>(null);
  const { toast } = useToast();

  const form = useForm<ImageToTextFormValues>({
    resolver: zodResolver(imageToTextSchema),
  });
  
  const processImage = useCallback(() => {
    if (!imageState?.originalSrc) return;

    setResultState(null);
    startTransition(async () => {
      const response = await handleImageToText({ imageDataUri: imageState.originalSrc });

      if (response.error) {
        toast({ variant: 'destructive', title: 'Error', description: response.error });
      }
      if (response.success && response.success.extractedText) {
        setResultState({ extractedText: response.success.extractedText });
      }
    });
  }, [imageState, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setImageState({ originalSrc: src });
        setResultState(null);
        startTransition(() => processImage()); // Auto-process on upload
      };
      reader.readAsDataURL(file);
    } else {
      toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
    }
  };

  const copyToClipboard = () => {
    if (resultState?.extractedText) {
      navigator.clipboard.writeText(resultState.extractedText);
      toast({
        title: 'Copied to Clipboard!',
        description: 'The extracted text has been copied.',
      });
    }
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">AI Image to Text (OCR)</CardTitle>
        <CardDescription>
          Upload an image to extract the text from it using Optical Character Recognition.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="font-semibold text-center mb-2">Your Image</h3>
                {!imageState ? (
                    <div className="relative flex h-80 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
                        <UploadCloud className="h-10 w-10 text-muted-foreground" />
                        <Input
                            type="file"
                            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                         <p className="absolute bottom-4 text-sm text-muted-foreground">Click or drag to upload</p>
                    </div>
                ) : (
                    <div className="relative h-80 w-full overflow-hidden rounded-md border">
                        <Image src={imageState.originalSrc} alt="Original" fill style={{ objectFit: 'contain' }} />
                    </div>
                )}
            </div>
            <div>
              <h3 className="font-semibold text-center mb-2">Extracted Text</h3>
              <div className="relative h-80 w-full">
                {isPending && <div className="absolute inset-0 flex h-full items-center justify-center bg-background/80 z-10"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                <ScrollArea className="h-full rounded-md border">
                    <Textarea 
                        readOnly
                        value={resultState?.extractedText || ''}
                        className="h-full min-h-full resize-none border-0 focus-visible:ring-0"
                        placeholder="Extracted text will appear here..."
                    />
                </ScrollArea>
              </div>
            </div>
          </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={copyToClipboard} disabled={!resultState || isPending}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Extracted Text
        </Button>
      </CardFooter>
    </Card>
  );
}
