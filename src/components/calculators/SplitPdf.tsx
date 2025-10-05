'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { splitPdfSchema } from '@/lib/schemas';

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
import { UploadCloud, Download, Puzzle } from 'lucide-react';
import { Label } from '../ui/label';

type SplitPdfFormValues = z.infer<typeof splitPdfSchema>;

export default function SplitPdf() {
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SplitPdfFormValues>({
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
  
  const handleSplit = () => {
    toast({
        title: 'Coming Soon!',
        description: 'The PDF splitting functionality is under construction.'
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Split PDF</CardTitle>
        <CardDescription>
          Extract a range of pages or split every page into a separate PDF. (Feature coming soon)
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

        <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-medium">Split Options</h3>
             <div className="flex items-center gap-4">
                <Label htmlFor="range" className="flex-shrink-0">Page Range</Label>
                <Input id="range" placeholder="e.g., 1-5, 8, 10-12" disabled/>
             </div>
             <p className="text-center text-sm text-muted-foreground">OR</p>
             <Button variant="outline" className="w-full" disabled>Split All Pages into Separate PDFs</Button>
        </div>

      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSplit} disabled={!fileName}>
          <Puzzle className="mr-2 h-4 w-4" />
          Split PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
