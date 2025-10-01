'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { qrCodeGeneratorSchema } from '@/lib/schemas';
import QRCode from "react-qr-code";
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
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type QrCodeFormValues = z.infer<typeof qrCodeGeneratorSchema>;

export default function QrCodeGenerator() {
  const [qrValue, setQrValue] = useState('');
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<QrCodeFormValues>({
    resolver: zodResolver(qrCodeGeneratorSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = (values: QrCodeFormValues) => {
    setQrValue(values.text);
  };
  
  const handleDownload = () => {
    if (!qrCodeRef.current || !qrValue) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Generate a QR code before downloading.',
      });
      return;
    }
    
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">QR Code Generator</CardTitle>
        <CardDescription>
          Create a QR code from any text or URL.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text or URL</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., https://www.google.com"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {qrValue && (
              <div ref={qrCodeRef} className="rounded-lg border bg-background p-6 flex justify-center">
                <QRCode
                    value={qrValue}
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit" className="w-full">
              Generate QR Code
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              disabled={!qrValue}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
