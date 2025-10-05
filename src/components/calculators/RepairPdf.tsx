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
import { UploadCloud, FileCog } from 'lucide-react';

type RepairPdfFormValues = z.infer<typeof splitPdfSchema>;

export default function RepairPdf() {
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<RepairPdfFormValues>({
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
  
  const handleRepair = () => {
    toast({
        title: 'Coming Soon!',
        description: 'PDF repair functionality is under construction.'
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Repair PDF</CardTitle>
        <CardDescription>
          Attempt to repair a corrupted or damaged PDF file. (Feature coming soon)
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
        <Button className="w-full" onClick={handleRepair} disabled>
          <FileCog className="mr-2 h-4 w-4" />
          Repair PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
