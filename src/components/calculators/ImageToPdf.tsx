'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { imageToPdfSchema } from '@/lib/schemas';
import { jsPDF } from 'jspdf';

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
import { UploadCloud, Download, Loader2 } from 'lucide-react';

type ImageToPdfFormValues = z.infer<typeof imageToPdfSchema>;

interface ImageFile {
    file: File;
    src: string;
}

export default function ImageToPdf() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ImageToPdfFormValues>({
    resolver: zodResolver(imageToPdfSchema),
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        const newImageFiles: ImageFile[] = [];
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const src = URL.createObjectURL(file);
                newImageFiles.push({ file, src });
            }
        });
        setImageFiles(prev => [...prev, ...newImageFiles]);
    }
  };

  const handleConvertToPdf = async () => {
    if (imageFiles.length === 0) {
        toast({ variant: 'destructive', title: 'No Images', description: 'Please upload at least one image.'});
        return;
    }
    setIsConverting(true);
    
    const doc = new jsPDF();
    
    for (let i = 0; i < imageFiles.length; i++) {
        const img = imageFiles[i];
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        await new Promise(resolve => imgElement.onload = resolve);

        const imgWidth = imgElement.width;
        const imgHeight = imgElement.height;
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;

        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;
        
        if (i > 0) {
            doc.addPage();
        }
        
        doc.addImage(img.src, 'PNG', x, y, width, height);
    }
    
    doc.save('converted-images.pdf');
    setIsConverting(false);
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">Image to PDF Converter</CardTitle>
        <CardDescription>
          Upload one or more images to convert them into a single PDF document.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <Input
                type="file"
                multiple
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                accept="image/*"
                onChange={handleFileChange}
            />
            <p className="absolute bottom-4 text-sm text-muted-foreground">Click or drag to upload images</p>
        </div>

        {imageFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imageFiles.map((img, index) => (
                    <div key={index} className="relative aspect-square w-full overflow-hidden rounded-md border">
                        <Image src={img.src} alt={`Preview ${index}`} fill style={{ objectFit: 'cover' }} />
                    </div>
                ))}
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleConvertToPdf} disabled={imageFiles.length === 0 || isConverting}>
          {isConverting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Convert to PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
