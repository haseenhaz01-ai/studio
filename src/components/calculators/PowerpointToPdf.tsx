'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { powerpointToPdfSchema } from '@/lib/schemas';

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

type PowerpointToPdfFormValues = z.infer<typeof powerpointToPdfSchema>;

export default function PowerpointToPdf() {
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<PowerpointToPdfFormValues>({
    resolver: zodResolver(powerpointToPdfSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setFileName(file.name);
    } else {
        setFileName(null);
    }
  };
  
  const handleConvert = () => {
    toast({
        title: 'Coming Soon!',
        description: 'PowerPoint to PDF conversion is under construction.'
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">PowerPoint to PDF Converter</CardTitle>
        <CardDescription>
          Upload a PowerPoint file to convert it to PDF. (Feature coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
             <Input
                type="file"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                accept=".ppt,.pptx"
                onChange={handleFileChange}
            />
            {fileName ? (
                <p className="mt-2 font-medium text-foreground">{fileName}</p>
            ) : (
                <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload a PowerPoint file</p>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleConvert} disabled>
          <FileType className="mr-2 h-4 w-4" />
          Convert to PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
