'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { mergePdfSchema } from '@/lib/schemas';

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
import { UploadCloud, Puzzle } from 'lucide-react';

type MergePdfFormValues = z.infer<typeof mergePdfSchema>;

export default function MergePdf() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<MergePdfFormValues>({
    resolver: zodResolver(mergePdfSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        const names = Array.from(files).map(f => f.name);
        setFileNames(names);
    } else {
        setFileNames([]);
    }
  };
  
  const handleMerge = () => {
    toast({
        title: 'Coming Soon!',
        description: 'The PDF merging functionality is under construction.'
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Merge PDF</CardTitle>
        <CardDescription>
          Combine multiple PDF files into a single document. (Feature coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
             <Input
                type="file"
                multiple
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                accept="application/pdf"
                onChange={handleFileChange}
            />
            {fileNames.length > 0 ? (
                <div className="mt-2 text-center text-sm font-medium text-foreground">
                    <p>{fileNames.length} file(s) selected:</p>
                    <ul className="list-disc list-inside">
                        {fileNames.map((name, i) => <li key={i}>{name}</li>)}
                    </ul>
                </div>
            ) : (
                <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload PDFs</p>
            )}
        </div>

      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleMerge} disabled={fileNames.length < 2}>
          <Puzzle className="mr-2 h-4 w-4" />
          Merge PDFs
        </Button>
      </CardFooter>
    </Card>
  );
}
