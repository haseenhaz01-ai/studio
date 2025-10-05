'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { htmlToPdfSchema } from '@/lib/schemas';

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
import { Globe, FileType } from 'lucide-react';
import { Textarea } from '../ui/textarea';

type HtmlToPdfFormValues = z.infer<typeof htmlToPdfSchema>;

export default function HtmlToPdf() {
  const { toast } = useToast();

  const form = useForm<HtmlToPdfFormValues>({
    resolver: zodResolver(htmlToPdfSchema),
  });
  
  const handleConvert = () => {
    toast({
        title: 'Coming Soon!',
        description: 'HTML to PDF conversion is under construction.'
    });
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">HTML to PDF Converter</CardTitle>
        <CardDescription>
          Enter a URL or paste HTML to convert to PDF. (Feature coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="url">URL to Convert</Label>
            <Input id="url" placeholder="https://example.com" disabled/>
        </div>
        <p className="text-center text-sm text-muted-foreground">OR</p>
        <div className="space-y-2">
            <Label htmlFor="html-code">Paste HTML Code</Label>
            <Textarea id="html-code" placeholder="<html>...</html>" rows={8} disabled/>
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
