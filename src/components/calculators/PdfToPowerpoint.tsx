'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { splitPdfSchema } from '@/lib/schemas'; // Reuse schema for file upload

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
import { UploadCloud, FileType } from 'lucide-react';

type PdfToPowerpointFormValues = z.infer<typeof splitPdfSchema>;

export default function PdfToPowerpoint() {
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<PdfToPowerpointFormValues>({
    resolver: zodResolver(splitPdfSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
        setFileName(file.name);
    } else {
        setFileName(null);
        if (file) {
            toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select a PDF file.' });
        }
    }
  };
  
  const handleConvert = () => {
    toast({
        title: 'Coming Soon!',
        description: 'PDF to PowerPoint conversion is under construction.'
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">PDF to PowerPoint Converter</CardTitle>
        <CardDescription>
          Convert your PDF into an editable PowerPoint presentation. (Feature coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
             <Input
                type="file"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                accept="application/pdf"
                onChange={handleFileChange}
            />
            {fileName ? (
                <p className="mt-2 font-medium text-foreground">{fileName}</p>
            ) : (
                <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload a PDF</p>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleConvert} disabled>
          <FileType className="mr-2 h-4 w-4" />
          Convert to PowerPoint (.pptx)
        </Button>
      </CardFooter>
    </Card>
  );
}
